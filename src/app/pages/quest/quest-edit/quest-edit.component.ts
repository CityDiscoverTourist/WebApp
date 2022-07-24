import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
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
  tap,
  take,
} from 'rxjs';
import { hourValidator } from 'src/app/common/validations';
import { IdValue, Quest, QuestCreate, QuestListItem } from 'src/app/models';
import { QuestService } from 'src/app/services';
import { AreaModalComponent, QuestTypeModalComponent } from '../../share';
import { QuestDetailState, QuestState, QUEST_STATE } from '../states';

interface QuestEditState {
  showQuestDescription: boolean;
  files: File[];
  error?: string;
  submitting: boolean;
}
@Component({
  selector: 'app-quest-edit',
  templateUrl: './quest-edit.component.html',
  styleUrls: ['./quest-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class QuestEditComponent implements OnInit {
  status: { id: number; value: string }[] = [];
  private id: string;
  public questListItem: QuestListItem;
  public img: string = '';
  constructor(
    @Inject(QUEST_STATE) private questState: RxState<QuestState>,
    private fb: FormBuilder,
    private toast: HotToastService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questDetailState: RxState<QuestDetailState>,
    private questService: QuestService,
    private state: RxState<QuestEditState>,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, _) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));

    this.initForm();
    this.status = this.questService.status;

    this.questDetailState.connect(
      this.activatedRoute.paramMap
        .pipe(
          tap((_) => this.questDetailState.set({ loading: true })),
          filter((p) => p.has('id')),
          map((p) => p.get('id')?.toString()),
          switchMap((s) => this.questService.getQuestByIdNoLangue(s))
        )
        .pipe(
          tap((data) => {
            this.id = data.id.toString();
            var da = data.availableTime;
            var availableTime = data.availableTime
              .toString()
              .toLocaleLowerCase()
              .split('-');
            this.form.patchValue(data);
            this.form
              .get('availableTime1')
              ?.setValue(availableTime[0]?.replace('am', '').trim());
            this.form
              .get('availableTime2')
              ?.setValue(availableTime[1]?.replace('pm', '').trim());
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

    const [valid$, invalid$] = partition(
      this.submit$,
      ({ form }) => form.valid
    );

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        pipe(
          tap(({ form, redirect }) => {
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
            if (arrDescription.length == 1) {
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
          this.questService.updateQuest(form.value as QuestCreate).pipe(
            catchError(() => of({ status: 'data not modified', data: null })),
            map((r) => ({ ...r, redirect }))
          )
        ),
        tap((result) => {
          if (!result.data?.id) {
            return;
          }
          this.toast.success(`Cập nhật quest thành công`);
          if (result.redirect) {
            this.router.navigate(['../../', result.data?.id], {
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
      this.toast.error('Giá trị bạn nhập không đúng');
      form.revalidateControls([]);
    });

    this.questState.connect(this.questypeIds$, (prev, curr) => ({
      questTypeIds: [...prev.questTypeIds, { id: curr.id, value: curr.name }],
    }));

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
      questTypeId: ['', [Validators.required]],
      image: [''],
      // questOwnerId: [2],
      areaId: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  get quest$(): Observable<Quest> {
    return this.questDetailState.select('quest');
  }
  toggleDescription$ = new Subject<void>();
  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();
  loadFile$ = new Subject<File>();
  get vm$(): Observable<QuestEditState> {
    return this.state.select();
  }
  get questTypeIds(): Observable<IdValue[]> {
    return this.questState.select('questTypeIds');
  }

  get areaIds$(): Observable<IdValue[]> {
    return this.questState.select('areaIds');
  }

  get loading$(): Observable<boolean> {
    return this.questDetailState.select('loading');
  }

  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();
  questypeIds$ = new Subject<{ id: number; name: string }>();

  deleteImage() {
    this.img = '';
    this.form.controls['image'].setValue('');
  }

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
