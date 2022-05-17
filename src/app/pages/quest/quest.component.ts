import { Component, Inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { QuestService } from 'src/app/services';
import { QuestListPageState, QUEST_PAGE_STATE } from './quest-list/states';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
  providers: [RxState]
})
export class QuestComponent implements OnInit {

  constructor(
    // private readonly categoryServices: CategoryService,
   private questService: QuestService,
    @Inject(QUEST_PAGE_STATE) private productPageState: RxState<QuestListPageState>
  ) {
   
  }

  ngOnInit(): void {
    // this.productPageState.connect(this.questService.getCategories(), (_, curr) => ({
    //   categories: curr,
    // }));
  }
}
