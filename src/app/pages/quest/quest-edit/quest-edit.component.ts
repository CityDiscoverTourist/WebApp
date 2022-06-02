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
import {
  BehaviorSubject,
  Observable,
  partition,
  pipe,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
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
  private id: string;
  public questListItem: QuestListItem;
  constructor(
    @Inject(QUEST_STATE) private questState: RxState<QuestState>,
    private fb: FormBuilder,
    private toast: HotToastService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private questDetailState: RxState<QuestDetailState>,
    private questService: QuestService,
    private state: RxState<QuestUpdateState>
  ) {}

  ngOnInit(): void {
    var id = +this.route.snapshot.params['id'].toString();
    this.state.connect(this.toggleDescription$, (prev, _) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));

    this.initForm();
    this.search$.next({ id: id.toString() });
    this.questDetailState.connect(
      this.search$
        .pipe(
          tap((_) => this.questDetailState.set({ loading: true })),
          switchMap((s) => this.questService.getQuestById(s.id))
        )
        .pipe(
          tap((data) => {
            this.id = data.id.toString();
            this.form.patchValue(data);
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
        .pipe(tap((file) => this.form.patchValue({ image: file[0] }))),
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

    const [valid$, invalid$] = partition(this.submit$, (f) => f.valid);

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        switchMap((f) => this.questService.updateQuest(f.value as QuestCreate)),
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
    // hay
    this.state.hold(invalid$.pipe(), (f) => {
      this.toast.error('Giá trị bạn nhập không đúng');
      // this.form.revalidateControls([]);
      f.revalidateControls([]);
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
      estimatedTime: [''],
      estimatedDistance: [],
      availableTime: [],
      questTypeId: [],
      imagePath: [],
      questOwnerId: [2],
      areaId: [],
      status: [],
    });
  }

  search$ = new BehaviorSubject<{ id: string | undefined }>({ id: '' });
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

  get areaIds(): Observable<IdValue[]> {
    return this.questState.select('areaIds');
  }

  get loading$(): Observable<boolean> {
    return this.questDetailState.select('loading');
  }

  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<FormGroup>();
  questypeIds$ = new Subject<{ id: number; name: string }>();
}
