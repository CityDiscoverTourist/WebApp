import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  of,
  partition,
  pipe,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { IdValue, QuestItemCreate, QuestItemType } from 'src/app/models';
import { QuestItemService } from 'src/app/services';
import {
  QuestItemDetailState,
  QuestItemState,
  QUEST_ITEM_STATE,
} from '../states';

interface QuestItemEditState {
  showQuestDescription: boolean;
  showTypeQuestsion: boolean;
  image: File[];
  error?: string;
  submitting: boolean;
}

@Component({
  selector: 'app-quest-item-edit',
  templateUrl: './quest-item-edit.component.html',
  styleUrls: ['./quest-item-edit.component.scss'],
})
export class QuestItemEditComponent implements OnInit {
  id: string = '';
  questItemType: number;
  listImages: string[] = [];
  listImage: string[] = [];
  status: { id: string; value: string }[] = [];
  constructor(
    @Inject(QUEST_ITEM_STATE) private questItemState: RxState<QuestItemState>,
    private fb: FormBuilder,
    private state: RxState<QuestItemEditState>,
    private questItemService: QuestItemService,
    private toast: HotToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private questItemDetailState: RxState<QuestItemDetailState>,
    private cd: ChangeDetectorRef
  ) {
    this.state.set({
      showQuestDescription: false,
      image: [],
      showTypeQuestsion: false,
    });
  }

  ngOnInit(): void {
    this.questItemDetailState.connect(
      this.activatedRoute.paramMap
        .pipe(
          tap((p) => console.log(p)),
          filter((p) => p.has('id') && Number(p.get('id')) > 0),
          map((p) => Number(p.get('id'))),
          switchMap((id) => this.questItemService.getQuestItemById(id))
        )
        .pipe(
          tap((data) => {
            this.id = data.id.toString();
            this.questItemType = data.questItemTypeId;
            this.listImages = data.listImages;
            this.form.patchValue(data);
            if (this.questItemType == 2) {
              this.toggleIsType$.next(2);
            }
          })
        ),
      (_, result) => ({
        location: result,
        loading: false,
      })
    );

    this.state.connect(
      this.selectedFile$
        .pipe(tap(() => setTimeout(() => this.cd.detectChanges(), 100)))
        .pipe(tap((file) => this.form.patchValue({ image: file }))),
      (prev, curr) => ({
        image: [...prev.image, ...curr],
      })
    );

    this.state.connect(
      this.removedFiles$.pipe(
        tap(() => setTimeout(() => this.cd.markForCheck(), 100))
      ),
      (prev, curr) => {
        prev.image.splice(prev.image.indexOf(curr), 1);
        return {
          image: prev.image,
        };
      }
    );

    this.status = this.questItemService.status;
    this.state.connect(this.toggleDescription$, (prev, curr) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));
    const [valid$, invalid$] = partition(
      this.submit$,
      ({ form }) => form.valid
    );

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        pipe(
          tap(({ form }) => {
            var content = form.controls['content'].value + ' ';
            var arrName = content.split('|');
            if (arrName.length == 1) {
              content = arrName[0] + '()' + arrName[0];
            } else {
              content = arrName[0] + '()' + arrName[1];
            }
            form.value['content'] = content;
            var description = form.controls['description'].value + '';
            var arrDescription = description.split('|');
            if (arrDescription.length == 1 && description != null) {
              description = arrDescription[0] + '()' + arrDescription[0];
            } else {
              description = arrDescription[0] + '()' + arrDescription[1];
            }
            form.value['description'] = description;
            var ssss = this.listImages;

            console.log(ssss);
            form.value['listImages'] = this.listImages;
            return form;
          })
        ),
        switchMap(({ form, redirect }) =>
          this.questItemService
            .updateQuestItemById(form.value as QuestItemCreate)
            .pipe(
              catchError(() => {
                this.toast.error('Có lỗi hãy kiểm tra lại!');
                return of({ status: 'data not modified', data: null });
              }),
              map((r) => ({ ...r, redirect }))
            )
        ),
        tap((result) => {
          if (!result.data?.id) {
            return;
          }
          this.toast.success(`Cập nhật câu hỏi thành công`);
          if (result.redirect) {
            this.router.navigate(['../../../'], {
              relativeTo: this.activatedRoute,
            });
          } else {
            this.form.reset();
            this.initForm();
          }
        })
      ),
      (_prev, curr) => ({
        error: undefined,
        submitting: false,
      })
    );

    this.state.hold(invalid$.pipe(), ({ form }) => {
      this.toast.error('Giá trị bạn nhập không hợp lệ');
      form.revalidateControls([]);
    });

    this.state.connect(this.toggleIsType$, (prev, curr) => {
      var check = false;
      if (curr == 2 && !prev.showTypeQuestsion) {
        check = true;
      } else {
        check = false;
      }
      return {
        showTypeQuestsion: check,
      };
    });
    this.initForm();
  }

  form!: FormGroup;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      content: ['', Validators.required],
      description: [''],
      duration: [0],
      createdDate: [''],
      updatedDate: [],
      qrCode: [''],
      triggerMode: [0],
      rightAnswer: [''],
      answerImageUrl: [],
      status: [],
      questItemTypeId: [1, Validators.required],
      locationId: ['', Validators.required],
      questId: [],
      itemId: [''],
      image: [],
      listImages: [],
    });
  }
  get vm$(): Observable<QuestItemEditState> {
    return this.state.select();
  }
  toggleDescription$ = new Subject<void>();
  toggleIsType$ = new Subject<number>();
  get locationIds(): Observable<IdValue[]> {
    return this.questItemState.select('locationIds');
  }
  get questItemTypeIds(): Observable<QuestItemType[]> {
    return this.questItemState
      .select('questItemTypeIds')
      .pipe(map((data) => data.filter((x) => x.status == 'Active')));
  }
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();

  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();

  showAddLocation() {
    this.router.navigate(['../../../../../location/create', 'redirect'], {
      relativeTo: this.activatedRoute,
    });
  }

  removeImage(url: string) {
    this.listImages = this.listImages.filter((x) => x != url);
    this.listImage.map((item) => "'" + item + "'");
    console.log(this.listImage);
  }

  public get submitting$(): Observable<boolean> {
    return this.state.select('submitting');
  }
}
