import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CityService } from 'src/app/services';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
  constructor(
    public bsModalRef: BsModalRef,
    private cityService: CityService,
    private router: Router,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {}
  deleteQuest(id: string) {
    this.bsModalRef.hide();
    this.cityService.deleteCityById(id).subscribe((data) => {
      this.bsModalRef.onHide?.emit({
        status: data,
      });
      this.bsModalRef.hide();
      this.toast.success('Xóa thành phố thành công');
    });
  }
  id = '';
}
