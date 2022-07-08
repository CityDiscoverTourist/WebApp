import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  AreaService,
  CityService,
  LocationService,
  LocationtypeService,
  QuestItemService,
  QuestItemTypeService,
  QuestTypeService,
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
    private locationTypeService: LocationtypeService,
    private areaService: AreaService,
    private questTypeService: QuestTypeService,
    private locationService: LocationService,
    private questItemService: QuestItemService
  ) {}

  ngOnInit(): void {}
  delete(id: string) {
    switch (this.title) {
      case 'loại Quest Item':
        {
          this.questItemTypeService
            .deleteQuestItemTypeById(id)
            .subscribe((data) => {
              if (data?.questItems?.length) {
                this.bsModalRef.hide();
                this.toast.error(`Xóa ${this.title} không thành công`);
                this.toast.info(
                  `Loại quest item này đang chứa các quest item khác nên không xóa được`
                );
              } else {
                this.bsModalRef.onHide?.emit({
                  data: data,
                });
                this.bsModalRef.hide();
                this.toast.success(`Xóa ${this.title} thành công`);
              }
            });
        }
        break;
      case 'thành phố':
        {
          this.cityService.deleteCityById(id).subscribe((data) => {
            if (data?.areas?.length) {
              this.bsModalRef.hide();
              this.toast.error(`Xóa ${this.title} không thành công`);
              var title = data.areas.map((x) => x.name).join(', ');
              this.toast.info(
                `Thành phồ này đang chứa các khu vực ${title} nên không xóa được`
              );
            } else {
              this.bsModalRef.onHide?.emit({
                data: data,
              });
              this.bsModalRef.hide();
              this.toast.success(`Xóa ${this.title} thành công`);
            }
          });
        }
        break;
      case 'loại địa điểm':
        {
          this.locationTypeService
            .deleteLocationTypeById(id)
            .subscribe((data) => {
              if (data?.locations?.length) {
                this.bsModalRef.hide();
                this.toast.error(`Xóa ${this.title} không thành công`);
                this.toast.info(
                  `Loại địa điểm này đang chứa các địa điểm khác nên không xóa được`
                );
              } else {
                this.bsModalRef.onHide?.emit({
                  data: data,
                });
                this.bsModalRef.hide();
                this.toast.success(`Xóa ${this.title} thành công`);
              }
            });
        }
        break;
      case 'địa điểm':
        {
          this.locationService.deleteLocationById(id).subscribe((data) => {
            if (data?.questItems) {
              this.bsModalRef.hide();
              this.toast.error(`Xóa ${this.title} không thành công`);
              this.toast.info(
                `QuestItem khác đang sử dụng địa điểm nên không xóa được`
              );
            } else {
              this.bsModalRef.onHide?.emit({
                data: data,
              });
              this.bsModalRef.hide();
              this.toast.success(`Xóa ${this.title} thành công`);
            }
          });
        }
        break;
      case 'khu vực':
        {
          this.areaService.deleteAreaById(id).subscribe((data) => {
            if (data?.locations?.length) {
              this.bsModalRef.hide();
              this.toast.error(`Xóa ${this.title} không thành công`);
              this.toast.info(
                `Khu vực này đang chứa các địa điểm khác nên không xóa được`
              );
            } else {
              this.bsModalRef.onHide?.emit({
                data: data,
              });
              this.bsModalRef.hide();
              this.toast.success(`Xóa ${this.title} thành công`);
            }
          });
        }
        break;
      case 'loại Quest':
        {
          this.questTypeService.deleteQuestTypeById(id).subscribe((data) => {
            if (data?.quests?.length) {
              this.bsModalRef.hide();
              this.toast.error(`Xóa ${this.title} không thành công`);
              this.toast.info(
                `Loại quest này đang chứa các quest khác nên không xóa được`
              );
            } else {
              this.bsModalRef.onHide?.emit({
                data: data,
              });
              this.bsModalRef.hide();
              this.toast.success(`Xóa ${this.title} thành công`);
            }
          });
        }
        break;
      case 'Quest Item':
        {
          this.questItemService.deleteQuestItemById(id).subscribe((data) => {
            this.bsModalRef.onHide?.emit({
              status: data,
            });
            this.bsModalRef.hide();
            this.toast.success(`Xóa ${this.title} thành công`);
          });
        }
        break;
      default:
        console.log('No such day exists!');
        break;
    }
  }
}
