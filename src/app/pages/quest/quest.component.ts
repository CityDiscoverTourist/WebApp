import { Component, Inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { AreaService, QuestTypeService } from 'src/app/services';
import { QuestState, QUEST_STATE } from './states/quest.state';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
  providers: [RxState],
})
export class QuestComponent implements OnInit {
  constructor(
    private readonly questTypeService: QuestTypeService,
    @Inject(QUEST_STATE) private questState: RxState<QuestState>,
    private readonly areaService: AreaService
  ) {
    questState.connect(questTypeService.getQuestTypeIdValue(), (_, curr) => ({
      questTypeIds: curr,
    }));
    questState.connect(areaService.getAreaIdValue(), (_, curr) => ({
      areaIds: curr,
    }));
  }
  ngOnInit(): void {}
}
