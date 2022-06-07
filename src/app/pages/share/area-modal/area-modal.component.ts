import { Component, Inject, OnInit } from '@angular/core';
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
import { IdValue } from 'src/app/models';
import { AreaService } from 'src/app/services';
import { AreaListPageState, AREA_PAGE_STATE } from '../../area/area-list/states';
import { AreaDetailState } from '../states';
declare type ModalState = {
  hasError: boolean;
};
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
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<ModalState>,
    private areaSerice: AreaService,
    private areaDetailState: RxState<AreaDetailState>,
    @Inject(AREA_PAGE_STATE) private areaPageState: RxState<AreaListPageState>,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.search$.next({ id: this.id });
    this.areaDetailState.connect(
      this.search$
        .pipe(
          tap((_) => this.areaDetailState.set({ loading: true })),
          switchMap((s) => this.areaSerice.getAreaById(s.id))
        )
        .pipe(
          tap((data) => {
            this.form.patchValue({
              id: data.id,
              name: data.name,
              status: data.status,
              cityId:data.cityId
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
              return this.areaSerice
                .updateAreaById(form.value)
                .pipe(
                  catchError(() =>
                    of({ status: 'data not modified', data: null })
                  )
                );
            } else {
              return this.areaSerice
                .addArea(form.value)
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
      name: [null, [Validators.required]],
      status: [],
      cityId:[]
    });
  }

  submit$ = new Subject<FormGroup>();

  public get hasError$(): Observable<boolean> {
    return this.state.select('hasError');
  }
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });
  get cityIds$(): Observable<IdValue[]> {
    return this.areaPageState.select('cityIds');  }
}
