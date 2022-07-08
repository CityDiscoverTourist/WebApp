import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  catchError,
  filter,
  map,
  Observable,
  of,
  partition,
  pipe,
  Subject,
  switchMap,
  take,
  tap
} from 'rxjs';
import { IdValue, QuestCreate } from 'src/app/models';
import { QuestService } from 'src/app/services';
import { AreaModalComponent, QuestTypeModalComponent } from '../../share';
import { QuestState, QUEST_STATE } from '../states/quest.state';

interface QuestCreateState {
  showQuestDescription: boolean;
  files: File[];
  error?: string;
  submitting: boolean;
}

@Component({
  selector: 'app-quest-create',
  templateUrl: './quest-create.component.html',
  styleUrls: ['./quest-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class QuestCreateComponent implements OnInit {
  status: { id: number; value: string }[] = [];
  constructor(
    @Inject(QUEST_STATE) private questState: RxState<QuestState>,
    private state: RxState<QuestCreateState>,
    private fb: FormBuilder,
    private toast: HotToastService,
    private cd: ChangeDetectorRef,
    private questService: QuestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {
    this.state.set({
      showQuestDescription: false,
      files: [],
    });
  }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, _) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));

    this.initForm();
    this.status = this.questService.status;

    this.state.connect(
      this.selectedFile$
        .pipe(tap(() => setTimeout(() => this.cd.detectChanges(), 100)))
        .pipe(tap((file) => this.form.patchValue({ image: file[0] }))),
      (_prev, files) => ({ files: [...files] })
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

    const [valid$, invalid$] = partition(
      this.submit$,
      ({ form }) => form.valid
    );

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        pipe(
          tap(({ form }) => {
            var title = form.controls['title'].value + ' ';
            var arrName = title.split('|');
            if (arrName.length == 1) {
              title = arrName[0] + '()' + arrName[0];
            } else {
              title = arrName[0] + '()' + arrName[1];
            }
            form.value['title'] = title;
            var description = form.controls['description'].value + '';
            var arrDescription = description.split('|');
            if (arrDescription.length == 1 && description != null) {
              description = arrDescription[0] + '()' + arrDescription[0];
            } else {
              description = arrDescription[0] + '()' + arrDescription[1];
            }
            form.value['description'] = description;
            var availableTime =
              form.controls['availableTime1'].value +
              ' AM - ' +
              form.controls['availableTime2'].value +
              ' PM ';
            form.value['availableTime'] = availableTime;
            return form;
          })
        ),
        switchMap(({ form, redirect }) =>
          this.questService.addQuest(form.value as QuestCreate).pipe(
            catchError(() => of({ status: 'data not modified', data: null })),
            map((r) => ({ ...r, redirect }))
          )
        ),
        tap((result) => {
          if (!result.data?.id) {
            return;
          }
          this.toast.success(`Tạo quest thành công`);
          if (result.redirect) {
            this.router.navigate(['../', result.data?.id], {
              relativeTo: this.activatedRoute,
            });
          } else {
            this.initForm();
          }
        })
      ),
      (_prev, curr) => ({
        error: undefined,
        submitting: false,
      })
    );

    this.state.hold(invalid$.pipe(), ({ form }) => {
      this.toast.error('Giá trị bạn nhập không hợp lệ');
      form.revalidateControls([]);
    });

    this.questState.connect(
      this.questypeAdded$.pipe(
        tap((questType) => {
          this.form.get('questTypeId')?.setValue(questType.id);
        })
      ),
      (prev, curr) => ({
        questTypeIds: [...prev.questTypeIds, { id: curr.id, value: curr.name }],
      })
    );

    this.questState.connect(
      this.areaAdded$.pipe(
        tap((area) => {
          this.form.get('areaId')?.setValue(area.id);
        })
      ),
      (prev, curr) => ({
        areaIds: [...prev.areaIds, { id: curr.id, value: curr.name }],
      })
    );
  }

  toggleDescription$ = new Subject<void>();
  get vm$(): Observable<QuestCreateState> {
    return this.state.select();
  }

  get questTypeIds(): Observable<IdValue[]> {
    return this.questState.select('questTypeIds');
  }

  get areaIds$(): Observable<IdValue[]> {
    return this.questState.select('areaIds');
  }

  form!: FormGroup;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(8)]],
      description: [],
      price: [0, [Validators.required, Validators.min(10)]],
      estimatedTime: ['', [Validators.required]],
      estimatedDistance: ['', [Validators.required]],
      availableTime: [''],
      availableTime1: [
        '',
        [
          Validators.required,
          Validators.pattern('^([7-9]|0[7-9]|1[0-2]):[0-5][0-9]$'),
        ],
      ],
      availableTime2: [
        '',
        [
          Validators.required,
          Validators.pattern('^([1-6]|0[1-6]):[0-5][0-9]$'),
        ],
      ],
      questTypeId: [null, [Validators.required]],
      image: [],
      questOwnerId: [''],
      areaId: [null, [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  get availableTime2() {
    return this.form.get('availableTime2');
  }

  get title() {
    return this.form.get('title');
  }

  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();

  showAddQuestType() {
    const bsModalRef = this.modalService.show(QuestTypeModalComponent, {
      initialState: {
        simpleForm: false,
        title: 'loại quest',
        type: 'Thêm',
      },
    });
    bsModalRef.onHide
      ?.pipe(
        take(1),
        filter((s) => (s as any).success)
      )
      .subscribe({
        next: (result) => {
          const data = result as { id: number; name: string };
          const questTypeAdded = result as { id: number; name: string };
          this.questypeAdded$.next({
            id: questTypeAdded.id,
            name: questTypeAdded.name,
          });
          if (data.id > 0 && data.name.length > 0) {
            this.toast.success('Tạo loại quest thành công!');
          }
        },
      });
  }

  showAddArea() {
    const bsModalRef = this.modalService.show(AreaModalComponent, {
      initialState: {
        simpleForm: false,
        title: 'khu vực',
        type: 'Thêm',
      },
    });
    bsModalRef.onHide
      ?.pipe(
        take(1),
        filter((s) => (s as any).success)
      )
      .subscribe({
        next: (result) => {
          const data = result as { id: number; name: string };
          const areaAdded = result as { id: number; name: string };
          this.areaAdded$.next({
            id: areaAdded.id,
            name: areaAdded.name,
          });
          if (data.id > 0 && data.name.length > 0) {
            this.toast.success('Tạo khu vực thành công!');
          }
        },
      });
  }

  questypeAdded$ = new Subject<{ id: number; name: string }>();
  areaAdded$ = new Subject<{ id: number; name: string }>();
}
