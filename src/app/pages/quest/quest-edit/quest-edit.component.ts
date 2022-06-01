import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, take, tap } from 'rxjs';
import { IdValue } from 'src/app/models';
import { QuestService } from 'src/app/services';
import { QuestTypeModalComponent } from '../../share/quest-type-modal/quest-type-modal.component';
import { QuestState, QUEST_STATE } from '../states/quest.state';

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

  constructor( @Inject(QUEST_STATE) private questState: RxState<QuestState>,
  private state: RxState<QuestEditState>,
  private fb: FormBuilder,
  private toast: HotToastService,
  private cd: ChangeDetectorRef,
  private questService: QuestService,
  private activatedRoute: ActivatedRoute,
  private modalService: BsModalService) { }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, _) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));

    this.initForm();

    this.state.connect(
      this.selectedFile$
        .pipe(tap(() => setTimeout(() => this.cd.detectChanges(), 100)))
        //pick image event
        .pipe(tap((file) => this.form.patchValue({ image: file[0] }))),
      (_prev, files) => ({
        // files: [...prev.files, ...files],
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

    this.questState.connect(this.questypeIds$, (prev, curr) => ({
      questTypeIds: [...prev.questTypeIds, { id: curr.id, value: curr.name }],
    }));

    
  }

  form!: FormGroup;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(8)]],
      // title: [],
      description: [],
      // description: ['',[Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(10)]],
      // price: [],
      // estimatedTime: ['', [customQuestValidator()]],
      estimatedTime: [''],
      estimatedDistance: [],
      availableTime: [],
      // availableTime: ['', [Validators.pattern("^(1[0123456789]|[1-9])(am|pm)\-(1[012]|[1-9])(am|pm)")]],
      questTypeId: [],
      image: [],
      questOwnerId: [2],
      areaId: [],
      status: [false],
    });
  }
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<FormGroup>();
  toggleDescription$ = new Subject<void>();
  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();
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
  get questTypeIds(): Observable<IdValue[]> {
    return this.questState.select('questTypeIds').pipe(tap((data)=>console.log("dataa"+data)));
  }

  get areaIds(): Observable<IdValue[]> {
    return this.questState.select('areaIds');
  }
  get vm$(): Observable<QuestEditState> {
    return this.state.select();
  }
}
