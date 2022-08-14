import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerquestService } from 'src/app/services';

@Component({
  selector: 'app-force-delete-customerquest-modal',
  templateUrl: './force-delete-customerquest-modal.component.html',
  styleUrls: ['./force-delete-customerquest-modal.component.scss'],
})
export class ForceDeleteCustomerquestModalComponent implements OnInit {
  id: string = '';
  title: string = '';
  status: string = '';

  constructor(
    public bsModalRef: BsModalRef,
    private toast: HotToastService,
    private customerQuestService: CustomerquestService
  ) {}

  ngOnInit(): void {}
  onDelete(customerQuest: string, status: string) {
    this.customerQuestService
      .forceDelete(customerQuest, status)
      .subscribe((data) => {
        try {
          this.bsModalRef.onHide?.emit({
            data: 'success',
          });
          this.bsModalRef.hide();
          this.toast.success(
            `Kết thúc customer quest thành công!`,
            {
              duration: 5000,
            }
          );
        } catch (error) {
          this.toast.error('Có lỗi hãy kiểm tra lại!');
        }
      });
  }
}
