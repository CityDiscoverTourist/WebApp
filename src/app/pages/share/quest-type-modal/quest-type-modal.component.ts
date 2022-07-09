import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
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
import { QuestTypeService } from 'src/app/services/quest-type.service';

interface QuestTypeDetailState {
  loading: boolean;
  submitting: boolean;
  hasError: boolean;
  files: File[];
}

@Component({
  selector: 'app-quest-type-modal',
  templateUrl: './quest-type-modal.component.html',
  styleUrls: ['./quest-type-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class QuestTypeModalComponent implements OnInit {
  id: string = '';
  title: string = '';
  type: string = '';
  public img: string = '';
  status: { id: number; value: string }[] = [];
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private state: RxState<QuestTypeDetailState>,
    private questTypeService: QuestTypeService,
    private cd: ChangeDetectorRef
  ) {
    this.state.set({
      files: [],
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.status = this.questTypeService.status;
    this.search$.next({ id: this.id });
    this.state.connect(
      this.search$
        .pipe(
          tap((_) => this.state.set({ loading: true })),
          switchMap((s) => {
            // var id = s.id > 0 ? s.id : '0';
            return this.questTypeService.getQuestTypeById(s.id);
          })
        )
        .pipe(
          tap((data) => {
            this.form.patchValue({
              id: data.id,
              name: data.name,
              status: data.status,
            });
            this.img = data.imagePath;
          })
        ),
      (_, result) => ({
        quest: result,
        loading: false,
      })
    );

    this.state.connect(
      this.selectedFile$
        .pipe(tap(() => setTimeout(() => this.cd.detectChanges(), 100)))
        .pipe(
          tap((file) => {
            this.img = '';
            this.form.patchValue({ image: file[0] });
          })
        ),
      (_prev, files) => ({
        files: [...files],
      })
    );

    this.state.connect(
      this.removedFiles$.pipe(
        tap(() => setTimeout(() => this.cd.markForCheck(), 100))
      ),
      (prev, curr) => {
        prev.files.splice(prev.files.indexOf(curr), 1);
        return {
          files: prev.files,
        };
      }
    );

    const [$valid, $invalid] = partition(
      this.submit$,
      ({ form }) => form.valid
    );
    this.state.connect(
      $valid
        .pipe(
          tap(() => this.state.set({ submitting: true })),
          tap(({ form }) => {
            var name = form.controls['name'].value + ' ';
            var arrName = name.split('|');
            if (arrName.length == 1) {
              name = arrName[0] + '()' + arrName[0];
            } else {
              name = arrName[0] + '()' + arrName[1];
            }
            form.value['name'] = name;
            return form;
          }),
          switchMap(({ form }) => {
            if (+this.id > 0) {
              return this.questTypeService
                .updateQuestTypeById(form.value)
                .pipe(
                  catchError(() =>
                    of({ status: 'data not modified', data: null })
                  )
                );
            } else {
              return this.questTypeService
                .addQuestType(form.value)
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
        submitting: false,
      })
    );
  }

  form!: FormGroup;
  simpleForm = false;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      image: [],
    });
  }

  submit$ = new Subject<{ form: FormGroup }>();

  public get hasError$(): Observable<boolean> {
    return this.state.select('hasError');
  }
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });

  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();
  get vm$(): Observable<QuestTypeDetailState> {
    return this.state.select();
  }

  get name() {
    return this.form.get('name')?.value?.length;
  }

  public get submitting$(): Observable<boolean> {
    return this.state.select('submitting');
  }
}
