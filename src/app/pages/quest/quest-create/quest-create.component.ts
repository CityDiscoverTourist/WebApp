import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RxState } from '@rx-angular/state';

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

}
