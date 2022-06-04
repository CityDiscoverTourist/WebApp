import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { Observable, partition, Subject, switchMap, tap } from 'rxjs';
import { IdValue, QuestItemCreate } from 'src/app/models';
import { QuestItemService } from 'src/app/services';
import { QuestItemState, QUEST_ITEM_STATE } from '../states';

interface QuestItemCreateState {
  showQuestDescription: boolean;
  error?: string;
  submitting: boolean;
}

@Component({
  selector: 'app-quest-item-create',
  templateUrl: './quest-item-create.component.html',
  styleUrls: ['./quest-item-create.component.scss'],
})
export class QuestItemCreateComponent implements OnInit {
  constructor(
    @Inject(QUEST_ITEM_STATE) private questItemState: RxState<QuestItemState>,
    private fb: FormBuilder,
    private state: RxState<QuestItemCreateState>,
    private questItemService: QuestItemService,
    private toast: HotToastService
  ) {
    this.state.set({
      showQuestDescription: false,
    });
  }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, curr) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));
    this.initForm();
    // this.state.connect(
    //   this.formSubmit$
    //     .pipe(switchMap((f) => this.questItemService.addQuestItem(f.value as QuestItemCreate)))
    //     .pipe(tap((data) => console.log(data))),
    //   (_prev, curr) => ({})
    // );

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

  get locationIds(): Observable<IdValue[]> {
    return this.questItemState.select('locationIds');
  }
  get questItemTypeIds(): Observable<IdValue[]> {
    return this.questItemState.select('questItemTypeIds');
  }
  form!: FormGroup;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      content: [''],
      description: [''],
      duration: [0],
      // createdDate:[],
      // updatedDate:[],
      qrCode: [''],
      triggerMode: [0],
      rightAnswer: [''],
      answerImageUrl: [],
      status: [],
      questItemTypeId: [''],
      locationId: [],
      questId: [9],
      itemId: [null],
    });
  }
  toggleDescription$ = new Subject<void>();
  get vm$(): Observable<QuestItemCreateState> {
    return this.state.select();
  }
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<FormGroup>();

  // submitForm() {
  //   const valid = this.form.valid;
  //   console.log('value', valid);

  //   this.formSubmit$.next(this.form);
  //   console.log(`form state =${valid}`, this.form.value);

  //   if (valid) {
  //     this.formSubmit$.next(this.form);
  //   } else {
  //     this.form.revalidateControls([]);
  //   }
  // }
}
