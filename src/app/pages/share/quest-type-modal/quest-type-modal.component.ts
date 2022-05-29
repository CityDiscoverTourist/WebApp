import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
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
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<ModalState>,
    private questTypeService: QuestTypeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const [$valid, $invalid] = partition(this.submit$, (f) => f.valid);
    this.state.connect(
      $invalid.pipe(tap(() => this.form.revalidateControls([]))),
      () => ({
        hasError: true,
      })
    );
    this.state.connect(
      $valid
        .pipe(
          switchMap((form) =>
            this.questTypeService
              .addQuestType(form.value)
              // .pipe(catchError(() => of({ isOk: false,data:null })))
              .pipe(
                catchError(() =>
                  of({ status: 'data not modified', data: null })
                )
              )
          )
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
        // hasError: false,
        hasError: curr.status == 'data modified' ? true : false,
      })
    );
  }

  form!: FormGroup;
  simpleForm = false;

  initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      durationMode: [null],
      status: [],
      distanceMode: [],
    });
  }
  submit$ = new Subject<FormGroup>();
  public get hasError$(): Observable<boolean> {
    return this.state.select('hasError');
  }
}
