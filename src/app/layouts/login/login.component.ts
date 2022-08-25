import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticateService, UserService } from 'src/app/services';
import { LoginState } from './states';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [RxState],
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  constructor(
    private userService: UserService,
    private authService: AuthenticateService,
    private fb: FormBuilder,
    private router: Router,
    private state: RxState<LoginState>,
    private toast: HotToastService
  ) {}
  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }

  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  private sub$ = new Subject<void>();
  submit(): void {
    if (!this.form.valid) {
      this.form.revalidateControls([]);
      return;
    }
    const username = this.form.get('username')?.value;
    const pw = this.form.get('password')?.value;
    this.userService
      .login(username, pw)
      .pipe(takeUntil(this.sub$))
      .subscribe({
        next: (userToken) => {
          if (userToken?.jwtToken.length) {
            this.router.navigate(['/']);
            localStorage.setItem('userId',userToken.accountId);
            localStorage.setItem('emailAdmin',userToken.email);
            this.authService.persistToken(userToken?.jwtToken);
            this.toast.success('Đăng nhập thành công');
          }
        },
        error: (err: Error) =>
          this.toast.error('Tài khoản hoặc mật khẩu không chính xác'),
      });
  }
}
