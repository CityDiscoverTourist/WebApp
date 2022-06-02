import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  catchError,
  Observable,
  of,
  partition,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { RxState } from '@rx-angular/state';
import { QuestState, QUEST_STATE } from '../states/quest.state';
import { IdValue, QuestCreate } from 'src/app/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { QuestService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { QuestTypeModalComponent } from '../../share/quest-type-modal/quest-type-modal.component';

interface QuestEditState {
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
  constructor(
    @Inject(QUEST_STATE) private questState: RxState<QuestState>,
    private state: RxState<QuestEditState>,
    private fb: FormBuilder,
    private toast: HotToastService,
    private cd: ChangeDetectorRef,
    private questService: QuestService,
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

    //cach này đúng nhưng dỡ
    // this.state.connect(
    //   this.formSubmit$
    //     .pipe(
    //       switchMap((f) => this.questService.addQuest(f.value as QuestCreate))
    //     )
    //     .pipe(
    //       tap((data) => {
    //         console.log(data);
    //         console.log('có vao ko');
    //       })
    //     ),
    //   (_prev, curr) => ({
    //     error: undefined,
    //   })
    // );

    const [valid$, invalid$] = partition(this.submit$, (f) => f.valid);

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        switchMap((f) => this.questService.addQuest(f.value as QuestCreate)),
        tap((result) => {
          if (result.id) {
            this.toast.success('Tạo quest thành công');
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

  toggleDescription$ = new Subject<void>();
  get vm$(): Observable<QuestEditState> {
    return this.state.select();
  }

  get questTypeIds(): Observable<IdValue[]> {
    return this.questState.select('questTypeIds');
  }

  get areaIds(): Observable<IdValue[]> {
    return this.questState.select('areaIds');
  }

  form!: FormGroup;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(8)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(10)]],
      estimatedTime: [''],
      estimatedDistance: [''],
      availableTime: [],
      questTypeId: [],
      image: [],
      questOwnerId: [''],
      areaId: [],
      status: [false],
    });
  }
  submitForm() {
    const valid = this.form.valid;
    this.formSubmit$.next(this.form);
    console.log(`form state =${valid}`, this.form.value);

    if (valid) {
      this.formSubmit$.next(this.form);
    } else {
      this.form.revalidateControls([]);
    }
  }
  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<FormGroup>();

  showAddQuestType() {
    const bsModalRef = this.modalService.show(QuestTypeModalComponent, {
      initialState: {
        simpleForm: true,
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        const questypeIds = result as { id: number; name: string };
        this.questypeIds$.next({ id: questypeIds.id, name: questypeIds.name });
      },
    });
  }

  questypeIds$ = new Subject<{ id: number; name: string }>();
}
