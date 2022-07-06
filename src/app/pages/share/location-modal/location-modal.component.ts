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
import { LocationService } from 'src/app/services';
declare type ModalState = {
  hasError: boolean;
};
@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class LocationModalComponent implements OnInit {
  id: string = '';
  title: string = '';
  type: string = '';
  status: { id: number; value: string }[] = [];
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<ModalState>,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.status = this.locationService.status;
    this.search$.next({ id: this.id });

    const [$valid, $invalid] = partition(this.submit$, (f) => f.valid);
    this.state.connect(
      $valid
        .pipe(
          switchMap((form) => {
            return this.locationService
              .addLocation(form.value)
              .pipe(
                catchError(() =>
                  of({ status: 'data not modified', data: null })
                )
              );
          })
        )
        .pipe(
          filter((result) => (result.status == 'data modified' ? true : false)),
          tap((result) => {
            this.bsModalRef.onHide?.emit({
              id: result?.data?.id,
              name: result?.data?.name,
              success: true,
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
}
