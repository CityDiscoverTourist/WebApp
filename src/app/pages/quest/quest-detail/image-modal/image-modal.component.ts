import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestItemService } from 'src/app/services';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent implements OnInit {
  questItemId: string = '';
  listImages: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private questItemService: QuestItemService
  ) {}

  ngOnInit(): void {
    this.questItemService.getListImage(this.questItemId).subscribe((data) => {
      this.listImages = data;
    });
  }
}
