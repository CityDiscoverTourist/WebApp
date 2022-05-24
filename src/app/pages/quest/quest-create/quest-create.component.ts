import {
  ChangeDetectionStrategy,
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
    private toast:HotToastService,
  ) {
    this.state.set({
      showQuestDescription: false,
    });
  }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev,_) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));

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
      description: [],
      price: [],
      estimatedTime: [],
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
}
