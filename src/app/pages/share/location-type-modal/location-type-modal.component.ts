import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
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
import { LocationtypeService } from 'src/app/services';
import { AreaState, AREA_STATE } from '../../area/states/area.state';

import { LocationTypeDetailState } from '../states';
declare type ModalState = {
  hasError: boolean;
};
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
  status: { id: number; name: string }[] = [];
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<ModalState>,
    private locationTypeService: LocationtypeService,
    private locationTypeDetailState: RxState<LocationTypeDetailState>,
    @Inject(AREA_STATE) private areaState: RxState<AreaState>,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.status=this.locationTypeService.status;
    this.search$.next({ id: this.id });
    this.locationTypeDetailState.connect(
      this.search$
        .pipe(
          tap((_) => this.locationTypeDetailState.set({ loading: true })),
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
    const [$valid, $invalid] = partition(this.submit$, (f) => f.valid);
    this.state.connect(
      $valid
        .pipe(
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
              success:true,
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
      status: ['',[Validators.required]],
    });
  }

  submit$ = new Subject<FormGroup>();

  public get hasError$(): Observable<boolean> {
    return this.state.select('hasError');
  }
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });

  get cityIds$(): Observable<IdValue[]> {
    return this.areaState
      .select('cityIds')
      // .pipe(tap((x) => x.forEach((x) => this.citys.set(x.id, x.value))));
  }

}
