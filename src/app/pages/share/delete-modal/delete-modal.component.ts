import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  CityService,
  LocationtypeService,
  QuestItemTypeService,
} from 'src/app/services';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  id: string = '';
  title: string = '';

  constructor(
    public bsModalRef: BsModalRef,
    private toast: HotToastService,
    private cityService: CityService,
    private questItemTypeService: QuestItemTypeService,
    private locationTypeService: LocationtypeService
  ) {}

  ngOnInit(): void {}
  deleteQuest(id: string) {
    switch (this.title) {
      case 'loại Quest Item':
        {
          this.questItemTypeService
            .deleteQuestItemTypeById(id)
            .subscribe((data) => {
              this.bsModalRef.onHide?.emit({
                status: data,
              });
              this.bsModalRef.hide();
              this.toast.success(`Xóa ${this.title} thành công`);
            });
        }
        break;
      case 'thành phố':
        {
          this.cityService.deleteCityById(id).subscribe((data) => {
            this.bsModalRef.onHide?.emit({
              status: data,
            });
            this.bsModalRef.hide();
            this.toast.success(`Xóa ${this.title} thành công`);
          });
        }
        break;
      case 'loại vị trí':
        {
          this.locationTypeService
            .deleteLocationTypeById(id)
            .subscribe((data) => {
              this.bsModalRef.onHide?.emit({
                status: data,
              });
              this.bsModalRef.hide();
              this.toast.success(`Xóa ${this.title} thành công`);
            });
        }
        break;
      // case 3:
      //     console.log("It is a Wednesday.");
      //     break;
      // case 4:
      //     console.log("It is a Thursday.");
      //     break;
      // case 5:
      //     console.log("It is a Friday.");
      //     break;
      // case 6:
      //     console.log("It is a Saturday.");
      //     break;
      default:
        console.log('No such day exists!');
        break;
    }
  }
}
