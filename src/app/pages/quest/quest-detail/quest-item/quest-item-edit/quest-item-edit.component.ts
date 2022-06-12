import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { Observable, partition, Subject, switchMap, tap } from 'rxjs';
import { IdValue, QuestItemCreate } from 'src/app/models';
import { QuestItemService } from 'src/app/services';
import { QuestItemState, QUEST_ITEM_STATE } from '../states';

interface QuestItemEditState {
  showQuestDescription: boolean;
  files: File[];
  error?: string;
  submitting: boolean;
}

@Component({
  selector: 'app-quest-item-edit',
  templateUrl: './quest-item-edit.component.html',
  styleUrls: ['./quest-item-edit.component.scss'],
})
export class QuestItemEditComponent implements OnInit {
  constructor(
    @Inject(QUEST_ITEM_STATE) private questItemState: RxState<QuestItemState>,
    private fb: FormBuilder,
    private state: RxState<QuestItemEditState>,
    private questItemService: QuestItemService,
    private toast: HotToastService, // private cd: ChangeDetectorRef, // private route: ActivatedRoute,
    private route: ActivatedRoute,
  ) 
  {
    this.state.set({
      showQuestDescription: false,
      // files: [],
    });
  }

  ngOnInit(): void {
    var data=this.route.snapshot.params['id'];
    console.log("dhdhd");
    console.log(data);

    this.initForm();
    this.state.connect(this.toggleDescription$, (prev, curr) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));
    const [valid$, invalid$] = partition(this.submit$, (f) => f.valid);

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        switchMap((f) =>
          this.questItemService.addQuestItem(f.value as QuestItemCreate)
        ),
        tap((result) => {
          if (result.id) {
            this.toast.success('Tạo quest thành công');
          }
        })
      ),
      (_prev, curr) => ({
        error: undefined,
        submitting: false,
      })
    );
    // hay
    this.state.hold(invalid$.pipe(), (f) => {
      this.toast.error('Giá trị bạn nhập không đúng');
      f.revalidateControls([]);
    });
  }

  form!: FormGroup;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      content: [''],
      description: [''],
      duration: [0],
      createdDate: [new Date()],
      updatedDate: [],
      qrCode: [''],
      triggerMode: [0],
      rightAnswer: [''],
      answerImageUrl: [],
      status: [],
      questItemTypeId: [1],
      locationId: [],
      questId: [],
      itemId: [null],
    });
  }
  get vm$(): Observable<QuestItemEditState> {
    return this.state.select();
  }
  toggleDescription$ = new Subject<void>();
  get locationIds(): Observable<IdValue[]> {
    return this.questItemState.select('locationIds');
  }
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<FormGroup>();
}
