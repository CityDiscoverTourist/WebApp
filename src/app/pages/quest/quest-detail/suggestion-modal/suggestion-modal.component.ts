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

 status: { id: string; value: string }[] = [];
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
    if (Number(this.id) > 0) {
      this.suggestioService.getSuggesionById(this.id).subscribe((data) => {
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
          tap((form) => {
            var content = form.controls['content'].value + ' ';
            var arrContent = content.split('|');
            if (arrContent.length == 1) {
              content = arrContent[0] + '()' + arrContent[0];
            } else {
              content = arrContent[0] + '()' + arrContent[1];
            }
            form.value['content'] = content;
            return form;
          }),
          switchMap((form) => {
            if (+this.id > 0) {
              return this.suggestioService
                .updateSuggesionById(form.value)
                .pipe(
                  catchError(() => {
                    this.toast.error('Có lỗi hãy kiểm tra lại!');
                    return of({ status: 'data not modified', data: null });
                  }),
                );
            } else {
              return this.suggestioService
                .addSuggesion(form.value)
                .pipe(
                  catchError(() => {
                    this.toast.error('Có lỗi hãy kiểm tra lại!');
                    return of({ status: 'data not modified', data: null });
                  }),
                );
            }
          })
        )
        .pipe(
          filter((result) => (result.status == 'data modified' ? true : false)),
          tap((result) => {
            this.activeModal.close();
            if (Number(this.id) > 0) {
              this.toast.success('Cập nhật gợi ý thành công!');
              setTimeout(()=>  window.location.reload(), 3000);
            } else {
              this.toast.success('Thêm gợi ý thành công!');
              setTimeout(()=>  window.location.reload(), 3000);
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
