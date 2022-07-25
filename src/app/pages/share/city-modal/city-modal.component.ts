import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
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
import { isExistedNameValidatorCity } from 'src/app/common/validations';
import { CityService } from 'src/app/services';

interface CityState {
  loading: boolean;
  submitting: boolean;
  hasError: boolean;
}

@Component({
  selector: 'app-city-modal-update',
  templateUrl: './city-modal.component.html',
  styleUrls: ['./city-modal.component.scss'],
  providers: [RxState],
})
export class CityModalComponent implements OnInit {
  id: string = '';
  title: string = '';
  type: string = '';
  status: { id: string; value: string }[] = [];
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<CityState>,
    private cityService: CityService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.status = this.cityService.status;
    if (Number(this.id) > 0) {
      this.search$.next({ id: this.id });
      this.state.connect(
        this.search$
          .pipe(
            tap((_) => this.state.set({ loading: true })),
            switchMap((s) => this.cityService.getCityById(s.id))
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
          city: result,
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
              return this.cityService.updateCity(form.value).pipe(
                catchError(() => {
                  this.toast.error('Có lỗi hãy kiểm tra lại!');
                  return of({ status: 'data not modified', data: null });
                })
              );
            } else {
              return this.cityService.addCity(form.value).pipe(
                catchError(() => {
                  this.toast.error('Có lỗi hãy kiểm tra lại!');
                  return of({ status: 'data not modified', data: null });
                })
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
        submitting: false,
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
        [isExistedNameValidatorCity(this.cityService, this.type)],
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
