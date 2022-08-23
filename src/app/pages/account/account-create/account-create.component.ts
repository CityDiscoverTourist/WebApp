import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import {
  catchError,
  Observable,
  of,
  partition,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { UserService } from 'src/app/services';

interface AccountCreateState {
  error?: string;
  submitting: boolean;
}

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class AccountCreateComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private state: RxState<AccountCreateState>,
    private toast: HotToastService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  roles: { id: string; value: string }[] = [];
  ngOnInit(): void {
    this.initForm();
    this.roles = [
      {
        id: 'Admin',
        value: '1',
      },
      {
        id: 'Quest Owner',
        value: '2',
      },
    ];
  }
  form!: FormGroup;
  initForm() {
    this.form = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      role: ['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]],
    });

    const [valid$, invalid$] = partition(
      this.submit$,
      ({ form }) => form.valid
    );

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        switchMap(({ form, redirect }) =>
          this.userService
            .addAdminAccount(
              form.controls['role'].value + '',
              form.controls['email'].value + '',
              form.controls['password'].value + ''
            )
            .pipe(
              catchError(() => {
                this.toast.error('Tài khoản đã tồn tại!');
                return of(false);
              })
            )
        ),
        tap((result) => {
          if (result) {
            this.toast.success(`Kiểm tra email để xác nhận!`);
            this.form.reset();
          }
        })
      ),
      (_prev, curr) => ({
        error: undefined,
        submitting: false,
      })
    );

    this.state.hold(invalid$.pipe(), ({ form, redirect }) => {
      this.toast.error('Giá trị nhập không hợp lệ!');
      form.revalidateControls([]);
    });
  }

  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();

  public get submitting$(): Observable<boolean> {
    return this.state.select('submitting');
  }
}
