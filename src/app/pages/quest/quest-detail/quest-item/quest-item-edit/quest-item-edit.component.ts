import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import {
  BehaviorSubject,
  catchError,
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
  id: string = '';
  status: { id: number; value: string }[] = [];
  constructor(
    @Inject(QUEST_ITEM_STATE) private questItemState: RxState<QuestItemState>,
    private fb: FormBuilder,
    private state: RxState<QuestItemEditState>,
    private questItemService: QuestItemService,
    private toast: HotToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private questItemDetailState: RxState<QuestItemDetailState>
  ) {
    this.state.set({
      showQuestDescription: false,
    });
  }

  ngOnInit(): void {
    this.search$.next({ id: this.activatedRoute.snapshot.params['id'] });
    this.questItemDetailState.connect(
      this.search$
        .pipe(
          tap((_) => this.questItemDetailState.set({ loading: true })),
          switchMap((s) => this.questItemService.getQuestItemById(s.id))
        )
        .pipe(
          tap((data) => {
            console.log(data);
            this.id = data.id.toString();
            this.form.patchValue(data);
          })
        ),
      (_, result) => ({
        location: result,
        loading: false,
      })
    );

    this.initForm();
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
            return form;
          })
        ),
        switchMap(({ form, redirect }) =>
          this.questItemService
            .updateQuestItemById(form.value as QuestItemCreate)
            .pipe(
              catchError(() => of({ status: 'data not modified', data: null })),
              map((r) => ({ ...r, redirect }))
            )
        ),
        tap((result) => {
          if (!result.data?.id) {
            return;
          }
          this.toast.success(`Cập nhật quest item thành công`);
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
  }

  form!: FormGroup;
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });

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
      rightAnswer: ['', Validators.required],
      answerImageUrl: [],
      status: [],
      questItemTypeId: [1, Validators.required],
      locationId: ['', Validators.required],
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
  get questItemTypeIds(): Observable<QuestItemType[]> {
    return this.questItemState
      .select('questItemTypeIds')
      .pipe(map((data) => data.filter((x) => x.status == 'Active')));
  }
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();

  showAddLocation() {
    this.router.navigate(['../../../../../location/create', 'redirect'], {
      relativeTo: this.activatedRoute,
    });
  }
}
