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
import { isExistedNameValidatorLocationType } from 'src/app/common/validations';
import { LocationtypeService } from 'src/app/services';
interface LocationTypeState {
  loading: boolean;
  submitting: boolean;
  hasError: boolean;
}

@Component({
  selector: 'app-location-type-modal',
  templateUrl: './location-type-modal.component.html',
  styleUrls: ['./location-type-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class LocationTypeModalComponent implements OnInit {
  id: string = '';
  title: string = '';
  type: string = '';
  status: { id: number; value: string }[] = [];
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<LocationTypeState>,
    private locationTypeService: LocationtypeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.status = this.locationTypeService.status;
    if (Number(this.id) > 0) {
      this.search$.next({ id: this.id });
      this.state.connect(
        this.search$
          .pipe(
            tap((_) => this.state.set({ loading: true })),
            switchMap((s) => this.locationTypeService.getLocationTypeById(s.id))
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
          tap(() => this.state.set({ submitting: true })),
          switchMap((form) => {
            if (+this.id > 0) {
              return this.locationTypeService
                .updateLocationTypeById(form.value)
                .pipe(
                  catchError(() =>
                    of({ status: 'data not modified', data: null })
                  )
                );
            } else {
              return this.locationTypeService
                .addLocationType(form.value)
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
      id: [0],
      name: [
        '',
        [Validators.required],
        [
          isExistedNameValidatorLocationType(
            this.locationTypeService,
            this.type
          ),
        ],
      ],
      status: ['', [Validators.required]],
    });
  }

  submit$ = new Subject<FormGroup>();

  public get hasError$(): Observable<boolean> {
    return this.state.select('hasError');
  }
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });

  get name() {
    return this.form.get('name');
  }

  public get submitting$(): Observable<boolean> {
    return this.state.select('submitting');
  }
}
