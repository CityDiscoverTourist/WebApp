import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  of,
  partition,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { QuestItemTypeService } from 'src/app/services';

interface QuestItemTypeState {
  loading: boolean;
  submitting: boolean;
  hasError: boolean;
}

@Component({
  selector: 'app-quest-item-type-modal',
  templateUrl: './quest-item-type-modal.component.html',
  styleUrls: ['./quest-item-type-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class QuestItemTypeModalComponent implements OnInit {
  id: string = '';
  title: string = '';
  type: string = '';
  status: { id: number; value: string }[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<QuestItemTypeState>,
    private questItemTypeService: QuestItemTypeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.status = this.questItemTypeService.status;

    if (Number(this.id) > 0) {
      this.search$.next({ id: this.id });
      this.state.connect(
        this.search$
          .pipe(
            tap((_) => this.state.set({ loading: true })),
            switchMap((s) =>
              this.questItemTypeService.getQuestItemTypeById(s.id)
            )
          )
          .pipe(
            tap((data) => {
              this.form.patchValue({
                id: data.id,
                name: data.name,
                status: data.status,
              });
            })
          ),
        (_, result) => ({
          quest: result,
          loading: false,
        })
      );
    }
    const [$valid, $invalid] = partition(this.submit$, (f) => f.valid);
    this.state.connect(
      $valid
        .pipe(
          switchMap((form) => {
            if (+this.id > 0) {
              return this.questItemTypeService
                .updateQuestItemTypeById(form.value)
                .pipe(
                  catchError(() =>
                    of({ status: 'data not modified', data: null })
                  )
                );
            } else {
              return this.questItemTypeService
                .addQuestItemType(form.value)
                .pipe(
                  catchError(() =>
                    of({ status: 'data not modified', data: null })
                  )
                );
            }
          })
        )
        .pipe(
          filter((result) => (result.status == 'data modified' ? true : false)),
          tap((result) => {
            this.bsModalRef.onHide?.emit({
              id: result?.data?.id,
              name: result?.data?.name,
            });
            this.bsModalRef.hide();
          })
        ),
      (_prev, curr) => ({
        hasError: curr.status == 'data modified' ? false : true,
      })
    );
    this.state.connect(
      $invalid.pipe(tap(() => this.form.revalidateControls([]))),
      () => ({
        hasError: true,
      })
    );
  }

  form!: FormGroup;
  simpleForm = false;

  initForm() {
    this.form = this.fb.group({
      id: [],
      name: [null, [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  submit$ = new Subject<FormGroup>();

  public get hasError$(): Observable<boolean> {
    return this.state.select('hasError');
  }
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });

  public get submitting$(): Observable<boolean> {
    return this.state.select('submitting');
  }
}
