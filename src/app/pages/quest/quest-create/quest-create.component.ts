import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { RxState } from '@rx-angular/state';
import { QuestState, QUEST_STATE } from '../states/quest.state';
import { IdValue } from 'src/app/models';

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
  ) { 
    this.state.set({
      showQuestDescription: false,
    });
  }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));
  }

  toggleDescription$ = new Subject<void>();

  get questTypeIds():Observable<IdValue[]>{
    return this.questState.select('questTypeIds').pipe(tap((m) => console.log(m)));
  }

  get areaIds():Observable<IdValue[]>{
    return this.questState.select('areaIds').pipe(tap((m)=>console.log(m)));
  }

}
