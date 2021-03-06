import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
// import { BsModalRef } from 'ngx-bootstrap/modal';
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
import { SuggestionService } from 'src/app/services';

interface SuggestionState {
  loading: boolean;
  submitting: boolean;
  hasError: boolean;
}

@Component({
  selector: 'app-suggestion-modal',
  templateUrl: './suggestion-modal.component.html',
  styleUrls: ['./suggestion-modal.component.scss'],
  providers: [RxState],
})
export class SuggestionModalComponent implements OnInit {
  id: string = '';
  title: string = '';
  type: string = '';
  questItemId: string = '';

  status: { id: number; value: string }[] = [];
  constructor(
    // public bsModalRef: BsModalRef,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private state: RxState<SuggestionState>,
    private suggestioService: SuggestionService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.status = this.suggestioService.status;

    console.log(this.id);

    if (Number(this.id) > 0) {
      this.suggestioService.getSuggesionById(this.id).subscribe((data) => {
        console.log(data);

        this.form.patchValue({
          id: data.id,
          content: data.content,
          status: data.status,
          questItemId: data.questItemId,
        });
      });
    } else {
      this.form.patchValue({
        id: 0,
        questItemId: this.questItemId,
      });
    }

    const [$valid, $invalid] = partition(this.submit$, (f) => f.valid);

    this.state.connect(
      $valid
        .pipe(
          tap(() => this.state.set({ submitting: true })),
          switchMap((form) => {
            if (+this.id > 0) {
              return this.suggestioService
                .updateSuggesionById(form.value)
                .pipe(
                  catchError(() =>
                    of({ status: 'data not modified', data: null })
                  )
                );
            } else {
              return this.suggestioService
                .addSuggesion(form.value)
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
            this.activeModal.close();
            if (Number(this.id) > 0) {
              this.toast.success('C???p nh???t g???i ?? th??nh c??ng!');
            } else {
              this.toast.success('T???o g???i ?? th??nh c??ng!');
            }
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
      id: [],
      content: ['', [Validators.required]],
      status: ['', [Validators.required]],
      questItemId: [''],
    });
  }

  submit$ = new Subject<FormGroup>();

  public get hasError$(): Observable<boolean> {
    return this.state.select('hasError');
  }

  public get submitting$(): Observable<boolean> {
    return this.state.select('submitting');
  }
}
