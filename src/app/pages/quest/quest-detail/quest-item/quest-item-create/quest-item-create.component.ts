import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { Observable, partition, Subject, switchMap, tap } from 'rxjs';
import { QuestItemType } from 'src/app/common/enums';
import { IdValue, QuestItemCreate } from 'src/app/models';
import { QuestItemService } from 'src/app/services';
import { QuestItemState, QUEST_ITEM_STATE } from '../states';

interface QuestItemCreateState {
  showQuestDescription: boolean;
  files: File[];
  error?: string;
  submitting: boolean;
}

@Component({
  selector: 'app-quest-item-create',
  templateUrl: './quest-item-create.component.html',
  styleUrls: ['./quest-item-create.component.scss'],
})
export class QuestItemCreateComponent implements OnInit {
  private id: string;
  public href: string = '';
  constructor(
    @Inject(QUEST_ITEM_STATE) private questItemState: RxState<QuestItemState>,
    private fb: FormBuilder,
    private state: RxState<QuestItemCreateState>,
    private questItemService: QuestItemService,
    private toast: HotToastService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.state.set({
      showQuestDescription: false,
      files: [],
    });
  }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, curr) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));
    this.initForm();
    this.href = this.router.url;
    var questId = this.href.match(/([\d]+)/g)?.[0];
    this.form.controls['questId'].setValue(questId);

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
    this.state.connect(
      this.selectedFile$
        .pipe(tap(() => setTimeout(() => this.cd.detectChanges(), 100)))
        .pipe(tap((file) => this.form.patchValue({ image: file[0] }))),
      (_prev, files) => ({ files: [...files] })
    );

    this.state.connect(
      this.removedFiles$.pipe(
        tap(() => setTimeout(() => this.cd.markForCheck(), 100))
      ),
      (prev, curr) => {
        prev.files.splice(prev.files.indexOf(curr), 1);
        return {
          files: prev.files,
        };
      }
    );
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
      createdDate: [new Date()],
      updatedDate: [],
      qrCode: [''],
      triggerMode: [0],
      rightAnswer: [''],
      answerImageUrl: [],
      status: [],
      questItemTypeId: [QuestItemType.QuestionandAnswer],
      locationId: [],
      questId: [],
      itemId: [null],
    });
  }
  toggleDescription$ = new Subject<void>();
  get vm$(): Observable<QuestItemCreateState> {
    return this.state.select();
  }
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<FormGroup>();

  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();

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
