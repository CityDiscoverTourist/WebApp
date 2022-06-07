import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { QuestTypeService } from 'src/app/services/quest-type.service';
import { QuestTypeDetailState } from '../states';

declare type ModalState = {
  hasError: boolean;
};
@Component({
  selector: 'app-quest-type-modal',
  templateUrl: './quest-type-modal.component.html',
  styleUrls: ['./quest-type-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class QuestTypeModalComponent implements OnInit {
  id: string = '';
  title: string = '';
  type: string = '';
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<ModalState>,
    private questTypeService: QuestTypeService,
    private questTypeDetailState: RxState<QuestTypeDetailState>,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.search$.next({ id: this.id });
    this.questTypeDetailState.connect(
      this.search$
        .pipe(
          tap((_) => this.questTypeDetailState.set({ loading: true })),
          switchMap((s) => this.questTypeService.getQuestTypeById(s.id))
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

    this.questTypeDetailState.connect(
      this.selectedFile$
        .pipe(tap(() => setTimeout(() => this.cd.detectChanges(), 100)))
        .pipe(tap((file) => this.form.patchValue({ image: file[0] }))),
      (_prev, files) => ({
        files: [...files],
      })
    );

    this.questTypeDetailState.connect(
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

    const [$valid, $invalid] = partition(this.submit$, (f) => f.valid);
    this.state.connect(
      $valid
        .pipe(
          switchMap((form) => {
            if (+this.id > 0) {
              return this.questTypeService
                .updateQuestTypeById(form.value)
                .pipe(
                  catchError(() =>
                    of({ status: 'data not modified', data: null })
                  )
                );
            } else {
              return this.questTypeService
                .addQuestType(form.value)
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
      status: [],
      image:[],
    });
  }

  submit$ = new Subject<FormGroup>();

  public get hasError$(): Observable<boolean> {
    return this.state.select('hasError');
  }
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });

  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();
  get vm$(): Observable<QuestTypeDetailState> {
    return this.questTypeDetailState.select();
  }
}
