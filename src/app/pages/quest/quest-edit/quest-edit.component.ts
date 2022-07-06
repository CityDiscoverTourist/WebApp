import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import {
  filter,
  map,
  Observable,
  partition,
  pipe,
  Subject,
  switchMap, tap
} from 'rxjs';
import { hourValidator } from 'src/app/common/validations';
import { IdValue, Quest, QuestCreate, QuestListItem } from 'src/app/models';
import { QuestService } from 'src/app/services';
import { QuestDetailState, QuestState, QUEST_STATE } from '../states';

interface QuestUpdateState {
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
    private activatedRoute: ActivatedRoute,
    private questDetailState: RxState<QuestDetailState>,
    private questService: QuestService,
    private state: RxState<QuestUpdateState>
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
            this.form.patchValue(data);
            this.img = data.imagePath;
          }),
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
            var description = form.controls['description'].value;
            var arrDescription = description.split('|');
            if (arrDescription.length == 1) {
              description = arrDescription[0] + '()' + arrDescription[0];
            } else {
              description = arrDescription[0] + '()' + arrDescription[1];
            }
            form.value['description'] = description;
            return form;
          })
        ),
        switchMap(({ form }) => {
          console.log(this.form.value);
          return this.questService.updateQuest(form.value as QuestCreate);
        }),
        tap((result) => {
          if (result.id) {
            this.toast.success('Cập nhật quest thành công');
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
      availableTime: ['', [Validators.required], [hourValidator()]],
      questTypeId: ['', [Validators.required]],
      image: [''],
      questOwnerId: [2],
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
  get vm$(): Observable<QuestUpdateState> {
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

  showAddQuestType() {}

  showAddArea() {}
}
