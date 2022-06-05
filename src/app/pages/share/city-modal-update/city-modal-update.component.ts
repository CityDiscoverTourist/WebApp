import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  Observable,
  partition,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { CityCreate } from 'src/app/models';
import { CityService } from 'src/app/services';
import { CityDetailState } from '../states';

declare type ModalState = {
  hasError: boolean;
};

interface CityUpdateState {
  showQuestDescription: boolean;
  error?: string;
  submitting: boolean;
}

@Component({
  selector: 'app-city-modal-update',
  templateUrl: './city-modal-update.component.html',
  styleUrls: ['./city-modal-update.component.scss'],
  providers: [RxState],
})
export class CityModalUpdateComponent implements OnInit {
  id = '';
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private modalState: RxState<ModalState>,
    private cityDetailState: RxState<CityDetailState>,
    private cityService: CityService,
    private toast: HotToastService,
    private state: RxState<CityUpdateState>
  ) {}

  ngOnInit(): void {
    this.initForm();
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
    const [valid$, invalid$] = partition(this.submit$, (f) => f.value);

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        switchMap((f) => this.cityService.updateCity(f.value as CityCreate)),
        tap((result) => {
          if (result.id) {
            this.bsModalRef.hide();
            this.toast.success('Cập nhật thành phố thành công');
          }
        })
      ),
      (_prev, curr) => ({
        error: undefined,
        submitting: false,
      })
    );

    this.state.hold(invalid$.pipe(), (f) => {
      this.toast.error('Giá trị bạn nhập không đúng');
      f.revalidateControls([]);
    });
  }

  form!: FormGroup;
  initForm() {
    this.form = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      status: ['', [Validators.required]],
    });
  }
  submit$ = new Subject<FormGroup>();

  public get hasError$(): Observable<boolean> {
    return this.modalState.select('hasError');
  }
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });
}
