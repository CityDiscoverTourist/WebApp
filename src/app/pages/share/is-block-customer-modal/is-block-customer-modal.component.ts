import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerService } from 'src/app/services';

@Component({
  selector: 'app-is-block-customer-modal',
  templateUrl: './is-block-customer-modal.component.html',
  styleUrls: ['./is-block-customer-modal.component.scss'],
})
export class IsBlockCustomerModalComponent implements OnInit {
  id: string = '';
  title: string = '';
  status: boolean = false;
  mail: string = '';
  constructor(
    public bsModalRef: BsModalRef,
    private toast: HotToastService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {}

  isBlock(id: string) {
    this.customerService.isBlockCustomer(id, this.status).subscribe((data) => {
      this.bsModalRef.onHide?.emit({
        data: data,
      });
      this.bsModalRef.hide();
      if (this.status) {
        this.toast.success(`Mở khóa ${this.title} thành công`);
      } else {
        this.toast.success(`Khóa ${this.title} thành công`);
      }
    });
  }
}
