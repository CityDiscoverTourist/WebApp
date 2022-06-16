import { Component, OnInit } from '@angular/core';
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
import { CityService } from 'src/app/services';
import { CityDetailState } from '../states';

declare type ModalState = {
  hasError: boolean;
};

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
  status: { id: number; name: string }[] = [];
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<ModalState>,
    private cityService: CityService,
    private cityDetailState: RxState<CityDetailState>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.status = this.cityService.status;
    this.search$.next({ id: this.id });
    this.cityDetailState.connect(
      this.search$
        .pipe(
          tap((_) => this.cityDetailState.set({ loading: true })),
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
        quest: result,
        loading: false,
      })
    );
    const [$valid, $invalid] = partition(this.submit$, (f) => f.valid);

    this.state.connect(
      $valid
        .pipe(
          switchMap((form) => {
            if (+this.id > 0) {
              return this.cityService
                .updateCity(form.value)
                .pipe(
                  catchError(() =>
                    of({ status: 'data not modified', data: null })
                  )
                );
            } else {
              return this.cityService
                .addCity(form.value)
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
      id: [0],
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  submit$ = new Subject<FormGroup>();

  public get hasError$(): Observable<boolean> {
    return this.state.select('hasError');
  }
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });

  submit(){
    console.log(this.form.value);
  }
}
