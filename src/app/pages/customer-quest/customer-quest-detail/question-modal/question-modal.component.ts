import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestItem } from 'src/app/models';
import { QuestItemService } from 'src/app/services';

@Component({
  selector: 'app-question-modal',
  templateUrl: './question-modal.component.html',
  styleUrls: ['./question-modal.component.scss'],
})
export class QuestionModalComponent implements OnInit {
  questItemId: string = '';
  constructor(
    public activeModal: NgbActiveModal,
    private questItemService: QuestItemService
  ) {}

  questItem: QuestItem = {
    id: 0,
    content: '',
    description: '',
    story:'',
    duration: 0,
    createdDate: new Date(),
    updatedDate: new Date(),
    qrCode: '',
    triggerMode: 0,
    rightAnswer: '',
    answerImageUrl: '',
    status: '',
    questItemTypeId: 0,
    locationId: 0,
    questId: 0,
    itemId: 0,
    listImages: [],
  };
  ngOnInit(): void {
    if (Number(this.questItemId) > 0) {
      this.questItemService
        .getQuestItemById(Number(this.questItemId))
        .subscribe((data) => {
          this.questItem = data;
        });
    }
  }
}
