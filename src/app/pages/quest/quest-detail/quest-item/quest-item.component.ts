import { Component, Inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { LocationService } from 'src/app/services/location.service';
import { QuestItemTypeService } from 'src/app/services/quest-item-type.service';
import { QuestItemState, QUEST_ITEM_STATE } from './states/questitem.state';

@Component({
  selector: 'app-quest-item',
  templateUrl: './quest-item.component.html',
  styleUrls: ['./quest-item.component.scss'],
  providers: [RxState],
})
export class QuestItemComponent implements OnInit {
  constructor(
    @Inject(QUEST_ITEM_STATE) private questItemState: RxState<QuestItemState>,
    // private readonly questItemTypeService: QuestItemTypeService,
    private readonly locationService: LocationService
  ) {
    // questItemState.connect(
    //   questItemTypeService.getQuestItemTypeIds(),
    //   (_, curr) => ({
    //     questItemTypeIds: curr,
    //   })
    // );
    questItemState.connect(locationService.getLocationIds(), (_, curr) => ({
      locationIds: curr,
    }));
  }

  ngOnInit(): void {}
}
