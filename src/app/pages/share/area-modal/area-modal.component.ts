import { Component, Inject, OnInit } from '@angular/core';
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
import { isExistedNameValidatorArea } from 'src/app/common/validations';
import { IdValue } from 'src/app/models';
import { AreaService, CityService } from 'src/app/services';
import { AreaState, AREA_STATE } from '../../area/states/area.state';
interface AreaDetailState {
  loading: boolean;
  submitting: boolean;
  hasError: boolean;
}
@Component({
  selector: 'app-area-modal',
  templateUrl: './area-modal.component.html',
  styleUrls: ['./area-modal.component.scss'],
  providers: [RxState],
})
export class AreaModalComponent implements OnInit {
  id: string = '';
  title: string = '';
  type: string = '';
 status: { id: string; value: string }[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<AreaDetailState>,
    private areaSerice: AreaService,
    @Inject(AREA_STATE) private areaState: RxState<AreaState>,
    private readonly cityService: CityService,
    private toast: HotToastService
  ) {
    areaState.connect(cityService.getCityIdValue(), (_, curr) => ({
      cityIds: curr,
    }));
  }

  ngOnInit(): void {
    this.initForm();
    this.status = this.areaSerice.status;
    if (Number(this.id) > 0) {
      this.search$.next({ id: this.id });
      this.state.connect(
        this.search$
          .pipe(
            tap((_) => this.state.set({ loading: true })),
            switchMap((s) => this.areaSerice.getAreaById(s.id))
          )
          .pipe(
            tap((data) => {
              this.form.patchValue({
                id: data.id,
                name: data.name,
                status: data.status,
                cityId: data.cityId,
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
              return this.areaSerice
                .updateAreaById(form.value)
                .pipe(
                  catchError(() => {
                    this.toast.error('Có lỗi hãy kiểm tra lại!');
                    return of({ status: 'data not modified', data: null });
                  })
                );
            } else {
              return this.areaSerice
                .addArea(form.value)
                .pipe(
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
        null,
        [Validators.required],
        [isExistedNameValidatorArea(this.areaSerice, this.type)],
      ],
      status: ['', [Validators.required]],
      cityId: [0, [Validators.required]],
    });
  }

  submit$ = new Subject<FormGroup>();

  public get hasError$(): Observable<boolean> {
    return this.state.select('hasError');
  }
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });
  get cityIds$(): Observable<IdValue[]> {
    return this.areaState.select('cityIds');
  }

  get name() {
    return this.form.get('name');
  }

  public get submitting$(): Observable<boolean> {
    return this.state.select('submitting');
  }
}
