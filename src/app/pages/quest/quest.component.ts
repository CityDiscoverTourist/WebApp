import { Component, Inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { AreaService, CityService, QuestService, QuestTypeService } from 'src/app/services';
import { QuestListPageState, QUEST_PAGE_STATE } from './quest-list/states';
import { QuestState, QUEST_STATE } from './states/quest.state';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
  providers: [RxState]
})
export class QuestComponent implements OnInit {

  constructor(
    private readonly questTypeService:QuestTypeService,
    @Inject(QUEST_STATE) private questState: RxState<QuestState>,
    private readonly areaService:AreaService
  ) {
    questState.connect(questTypeService.getAreaType(),(_,curr)=>({
      questTypeIds:curr
    }));
    questState.connect(areaService.getAreaType(),(_,curr)=>({
      areaIds:curr
    }));
  }
  ngOnInit(): void {
  }
}
