import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'app-quest-type-create',
  templateUrl: './quest-type-create.component.html',
  styleUrls: ['./quest-type-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class QuestTypeCreateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  showAddCategory(){
    // const  bsModalRef = this.modalService.show(CategoryModalComponent);
   }
}
