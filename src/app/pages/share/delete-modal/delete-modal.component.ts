import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  AreaService,
  CityService,
  LocationService,
  LocationtypeService,
  QuestItemService,
  QuestItemTypeService,
  QuestService,
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
  status: string = '';

  constructor(
    public bsModalRef: BsModalRef,
    private toast: HotToastService,
    private cityService: CityService,
    private questItemTypeService: QuestItemTypeService,
    private locationTypeService: LocationtypeService,
    private areaService: AreaService,
    private questTypeService: QuestTypeService,
    private locationService: LocationService,
    private questItemService: QuestItemService,
    private questService: QuestService
  ) {}

  ngOnInit(): void {}
  updateStatus(id: string, status: string) {
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
          this.cityService.updateStatus(id, status).subscribe((data) => {
            try {
              if (data?.areas?.length) {
                this.bsModalRef.hide();
                var title = data.areas.map((x) => x.name).join(', ');
                this.toast.error(
                  `${
                    status == 'Active'
                      ? 'Hoạt động lại'
                      : 'Không thể ngừng hoạt động'
                  } ${this.title} ${data.name}!
                  <br> 
                  Thành phồ này đang chứa khu vực ${title} nên không thể ngừng hoạt động!
                `,
                  {
                    autoClose: false,
                    dismissible: true,
                  }
                );
              } else {
                this.bsModalRef.onHide?.emit({
                  data: data,
                });
                this.bsModalRef.hide();
                this.toast.success(
                  `${
                    status == 'Active' ? 'Hoạt động lại' : 'Ngừng hoạt động'
                  } ${this.title} ${data?.name} thành công!`,
                  {
                    duration: 5000,
                  }
                );
              }
            } catch (error) {
              this.toast.error('Có lỗi hãy kiểm tra lại!');
            }
          });
        }
        break;
      case 'loại địa điểm':
        {
          this.locationTypeService
            .updateStatus(id, status)
            .subscribe((data) => {
              try {
                if (data?.locations?.length) {
                  this.bsModalRef.hide();
                  var title = data.locations.map((x) => x.name).join(', ');
                  this.toast.error(
                    `${
                      status == 'Active'
                        ? 'Hoạt động lại'
                        : 'Không thể ngừng hoạt động'
                    } ${this.title} ${data.name}!
                  <br> 
                  Loại địa này này đang chứa địa điểm khác nên không thể ngừng hoạt động!
                `,
                    {
                      autoClose: false,
                      dismissible: true,
                    }
                  );
                } else {
                  this.bsModalRef.onHide?.emit({
                    data: data,
                  });
                  this.bsModalRef.hide();
                  this.toast.success(
                    `${
                      status == 'Active' ? 'Hoạt động lại' : 'Ngừng hoạt động'
                    } ${this.title} ${data?.name} thành công!`,
                    {
                      duration: 5000,
                    }
                  );
                }
              } catch (error) {
                this.toast.error('Có lỗi hãy kiểm tra lại!');
              }
            });
        }
        break;
      case 'địa điểm':
        {
          this.locationService.updateStatus(id, status).subscribe((data) => {
            try {
              if (data?.questItems?.length) {
                this.bsModalRef.hide();
                this.toast.error(
                  `${
                    status == 'Active'
                      ? 'Hoạt động lại'
                      : 'Không thể ngừng hoạt động'
                  } ${this.title} ${data.name}!
                  <br> 
                  Địa điểm này có các câu hỏi đang sử dụng nên không thể ngừng hoạt động!
                `,
                  {
                    autoClose: false,
                    dismissible: true,
                  }
                );
              } else {
                this.bsModalRef.onHide?.emit({
                  data: data,
                });
                this.bsModalRef.hide();
                this.toast.success(
                  `${
                    status == 'Active' ? 'Hoạt động lại' : 'Ngừng hoạt động'
                  } ${this.title} ${data?.name} thành công!`,
                  {
                    duration: 5000,
                  }
                );
              }
            } catch (error) {
              this.toast.error('Có lỗi hãy kiểm tra lại!');
            }
          });
        }
        break;
      case 'khu vực':
        {
          this.areaService.updateStatus(id, status).subscribe((data) => {
            try {
              if (data?.locations?.length) {
                this.bsModalRef.hide();
                var title = data.locations.map((x) => x.name).join(', ');
                this.toast.error(
                  `${
                    status == 'Active'
                      ? 'Hoạt động lại'
                      : 'Không thể ngừng hoạt động'
                  } ${this.title} ${data.name}!
                  <br> 
                  Khu vực này đang chứa địa điểm ${title} nên không thể ngừng hoạt động!
                `,
                  {
                    autoClose: false,
                    dismissible: true,
                  }
                );
              } else {
                this.bsModalRef.onHide?.emit({
                  data: data,
                });
                this.bsModalRef.hide();
                this.toast.success(
                  `${
                    status == 'Active' ? 'Hoạt động lại' : 'Ngừng hoạt động'
                  } ${this.title} ${data?.name} thành công!`,
                  {
                    duration: 5000,
                  }
                );
              }
            } catch (error) {
              this.toast.error('Có lỗi hãy kiểm tra lại!');
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
      case 'Quest':
        {
          this.questService.deleteQuestById(id).subscribe((data) => {
            if (data?.questItems?.length) {
              this.bsModalRef.hide();
              this.toast.error(`Xóa ${this.title} không thành công`);
              this.toast.info(
                `Quest này đang chứa các quest item khác nên không xóa được`
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
