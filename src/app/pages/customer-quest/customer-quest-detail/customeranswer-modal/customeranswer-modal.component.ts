import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerAnswer } from 'src/app/models';
import { CustomerAnswerService } from 'src/app/services/customer-answer.service';

@Component({
  selector: 'app-customeranswer-modal',
  templateUrl: './customeranswer-modal.component.html',
  styleUrls: ['./customeranswer-modal.component.scss'],
})
export class CustomeranswerModalComponent implements OnInit {
  id: string = '';
  customerAnswer: CustomerAnswer = {
    id: 0,
    note: '',
    customerReply: '',
    customerTaskId: 0,
    questItemId: 0,
    answerImageUrl: '',
  };
  customerAnswers: CustomerAnswer[] = [];
  constructor(
    private customerAnserService: CustomerAnswerService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    // if (Number(this.id) > 0) {
    this.customerAnserService
      .getCustomerAnwerByCustomerTask(this.id)
      .subscribe((data) => {
        this.customerAnswers = data;
      });
  }
}
