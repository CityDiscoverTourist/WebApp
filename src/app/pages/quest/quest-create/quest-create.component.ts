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
import { IdValue, QuestData } from 'src/app/models';
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

    //cach này đúng nhưng dỡ
    this.state.connect(
      this.formSubmit$.pipe(
        switchMap((f) => this.questService.addQuest(f.value as QuestData))
      ).pipe(tap((data)=>{
        console.log(data);
        console.log("có vao ko");
        
      })),
      (_prev, curr) => ({
        error: undefined,
      })
    );
    //hay
    // const [valid$,invalid$]=partition(
    //   this.submit$,
    //   f=>f.valid
    // );

    // this.state.connect(
    //   valid$.pipe(
    //     //them loading bo neu duoc
    //     tap(()=>this.state.set({submitting:true})),
    //     switchMap((f)=>this.questService.addQuest(f.value as QuestData)
    //     // .pipe(catchError((err))=>of(err))
    //     ),
    //     tap(result=>{
    //       if(result.status)//if(result.isOk)
    //       {
    //         this.toast.success("Tao product thanh cong")
    //       }
    //     })
    //   ),(_prev,curr)=>({
    //     // error:undefined,
    //     error:curr.status,
    //     submitting:false
    //   })
    // )
    //hay

    // this.state.hold(
    //   invalid$.pipe(
    //   ),f=>{
    //     this.toast.error('Loi roi ne');
    //     // this.form.revalidateControls([]);
    //     f.revalidateControls([]);
    //   }
    // )

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
    // .pipe(tap((m) => console.log(m)));
  }

  get areaIds(): Observable<IdValue[]> {
    return this.questState.select('areaIds');
    // .pipe(tap((m) => console.log(m)));
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
  submitForm() {
    const valid = this.form.valid;
    this.formSubmit$.next(this.form);
    //if
    console.log(`form state =${valid}`, this.form.value, this.form.errors);
    // this.formSubmit$.next(this.form);

    if (valid) {
      this.toast.success('Ok roi ne');
      this.formSubmit$.next(this.form);
    } else {
      this.toast.error('Loi roi ne');
      // this.form.get('title')?.markAsTouched({onlySelf:true});
      // this.form.get('price')?.markAsTouched({onlySelf:true});
      // for(let key in this.form.controls){
      //   this.form.get(key)?.markAsTouched({onlySelf:true});
      // }
      this.form.revalidateControls([]);
    }
  }
  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();

  // hasError(key:string):boolean{
  //   const control=this.form.get(key);
  //   if(!control){
  //     return false;
  //   }
  //   return control.invalid && (control.dirty || control.touched);
  // }

  // formSubmit$ = new Subject<FormGroup>();
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<FormGroup>();

  // onFileSelect(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (!input.files?.length) {
  //     return;
  //   }
  //   const file = input.files[0];
  //   this.form.patchValue({ image: file });
  // }
  
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
