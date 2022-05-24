import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { RxState } from '@rx-angular/state';
import { QuestState, QUEST_STATE } from '../states/quest.state';
import { IdValue } from 'src/app/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

interface QuestEditState {
  showQuestDescription: boolean;
  files: File[];
}

@Component({
  selector: 'app-quest-create',
  templateUrl: './quest-create.component.html',
  styleUrls: ['./quest-create.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class QuestCreateComponent implements OnInit {
  constructor(
    @Inject(QUEST_STATE) private questState: RxState<QuestState>,
    private state: RxState<QuestEditState>,
    private fb: FormBuilder,
    private toast:HotToastService,
    private cd:ChangeDetectorRef,
  ) {
    this.state.set({
      showQuestDescription: false,
      files: [],
    });
  }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev,_) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));

    this.state.connect(
      this.selectedFile$.pipe(tap(() => setTimeout(()=>this.cd.detectChanges(),100))),
      (prev, files) => ({
        files: [...prev.files, ...files],
      })
    );

    this.state.connect(
      this.removedFiles$.pipe(tap(()=>setTimeout(()=>this.cd.markForCheck(),100))),
      (prev, curr) => {
       prev.files.splice(prev.files.indexOf(curr), 1);
        return {
          files: prev.files
        };
      }
    );

    this.initForm();
  }

  toggleDescription$ = new Subject<void>();
  get vm$():Observable<QuestEditState>{
    return this.state.select();
  }

  get questTypeIds(): Observable<IdValue[]> {
    return this.questState
      .select('questTypeIds')
      .pipe(tap((m) => console.log(m)));
  }

  get areaIds(): Observable<IdValue[]> {
    return this.questState.select('areaIds').pipe(tap((m) => console.log(m)));
  }

  form!: FormGroup;

  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      // sku: [null, [customProductSkuValidator()]],
      description: ['',[Validators.required, Validators.minLength(10)]],
      price: [],
      estimatedTime: [],
      estimatedDistance:[],
      image:[],
      availableTime: [],
      questTypeId: [],
      // salePrice: [0, [Validators.required, Validators.min(10)]],
      questOwnerId: [],
      areaId: [],
      status: [],
    });
  }
  submitForm(){
    const valid=this.form.valid;
    console.log(`form state =${valid}`,this.form.value,this.form.errors);
    if(valid){
     this.toast.success("Ok roi ne");
    }else{
      this.toast.error("Loi roi ne");
    }
  }
  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();
}
