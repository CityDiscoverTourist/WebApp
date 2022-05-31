import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestListItem } from 'src/app/models';
import { QuestService } from 'src/app/services';

@Component({
  selector: 'app-quest-detail',
  templateUrl: './quest-detail.component.html',
  styleUrls: ['./quest-detail.component.scss'],
})
export class QuestDetailComponent implements OnInit {
  private id: string;
  public questListItem:QuestListItem;
  constructor(
    private route: ActivatedRoute,
    private questService: QuestService
  ) {}

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get('id');
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    
    this.questService.getQuestById(this.id).subscribe((data) => {
     this.questListItem=data;
     console.log(data);
     
    });
  }
}
