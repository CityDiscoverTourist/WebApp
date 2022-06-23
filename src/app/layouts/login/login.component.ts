import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private state: RxState<LoginState>
  ) {}
  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }

  ngOnInit(): void {
    this.initForm();
    // this.manageEvents();
    // this.state.connect(
    //   this.form.valueChanges,
    //   (prev, curr: { username: string; password: string }) => ({
    //     ...prev,
    //     username: curr.username,
    //     password: curr.password,
    //   })
    // );
  }
  initForm(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  private sub$ = new Subject<void>();
  submit(): void {
    if (!this.form.valid) {
      return; //todo: show msg
    }
    const username = this.form.get('username')?.value;
    const pw = this.form.get('password')?.value;
    this.userService
      .login(username, pw)
      .pipe(takeUntil(this.sub$))
      .subscribe({
        next: (userToken) => {
          console.log(userToken?.jwtToken);
          console.log(userToken?.jwtToken.length);
          if (userToken?.jwtToken.length) {
            this.router.navigate(['/']);
            this.authService.persistToken(userToken?.jwtToken);
            //todo: use redireactUrl
          }
        },
      });
  }
  // private onSubmit = new Subject<void>();
  // private manageEvents() {
  //   this.state.hold(this.onSubmit, () => {
  //     const valid = this.form.valid;
  //     this.state.set({
  //       hasError: !valid,
  //     });
  //     if (!valid) return;

  //     this.userService.login(
  //       this.state.get('username'),
  //       this.state.get('password')
  //     ).subscribe({
  //       next:response=>{}
  //     });
  //   });
  // }
}
