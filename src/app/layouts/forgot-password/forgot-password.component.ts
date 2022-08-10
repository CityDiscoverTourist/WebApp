import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import {
  catchError, Observable, of, partition,
  Subject, switchMap, tap
} from 'rxjs';
import { UserService } from 'src/app/services';
interface ForgetPasswordState {
  loading: boolean;
  submitting: boolean;
  hasError: boolean;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [RxState],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private state: RxState<ForgetPasswordState>,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const [$valid, $invalid] = partition(this.submit$, (f) => f.valid);

    this.state.connect(
      $valid
        .pipe(
          tap(() => this.state.set({ submitting: true })),
          switchMap((form) => {
            return this.userService
              .forgetPassword(form.controls['email'].value.toString())
              .pipe(
                catchError(() => {
                  this.toast.error('Tài khoản không tồn tại trên hệ thống');
                  return of({ status: 'data not modified', data: null });
                })
              );
          })
        )
        .pipe(
          tap((result) => {
            if (result?.status != 'data not modified') {
              this.toast.success('Hãy kiểm tra email để nhận mật khẩu mới');
            }
          })
        ),
      (_prev, curr) => ({
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
  initForm(): void {
    this.form = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
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
