import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { MessageConstants } from 'src/app/contants';
import { City } from 'src/app/models';
import { CityService, NotificationService } from 'src/app/services';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrls: ['./city-detail.component.scss'],
})
export class CityDetailComponent implements OnInit, OnDestroy {
  constructor(
    public bsModalRef: BsModalRef,
    private cityService: CityService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  private subscription = new Subscription();
  public entityForm: FormGroup | any;
  public dialogTitle: string;
  private savedEvent: EventEmitter<any> = new EventEmitter();
  public entityId: string;
  public btnDisabled = true;

  public blockedPanel = true;
  // public btnDisabled = false;

  // public blockedPanel = false;

  // Validate
  validation_messages = {
    id: [
      { type: 'required', message: 'Trường này bắt buộc' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 25 kí tự' },
    ],
    name: [
      { type: 'required', message: 'Trường này bắt buộc' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 30 kí tự' },
    ],
  };

  ngOnInit() {
    this.entityForm = this.fb.group({
      id: new FormControl(
        { value: '', disabled: true }
        // Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
      name: new FormControl(
        ''
        // Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
      status:new FormControl(

      )
    });
    if (this.entityId) {
      this.dialogTitle = 'Cập nhật';
      this.loadFormDetails(this.entityId);
      this.entityForm.controls['id'].disable({ onlySelf: true });
    } else {
      this.dialogTitle = 'Thêm mới';
      this.entityForm.controls['id'].enable({ onlySelf: true });
      this.blockedPanel = false;
    }
  }

  private loadFormDetails(id: string) {
    // this.blockedPanel = true;
    this.subscription.add(
      // this.cityService.getDetail(id).subscribe(
      //   (response: City) => {
      //     this.entityForm.setValue({
      //       id: response.id,
      //       name: response.name,
      //     });
      //     setTimeout(() => {
      //       this.blockedPanel = false;
      //       this.btnDisabled = false;
      //     }, 1000);
      //   },
      //   (error) => {
      //     setTimeout(() => {
      //       this.blockedPanel = false;
      //       this.btnDisabled = false;
      //     }, 1000);
      //   }
      // )
      // this.cityService.getDetail(id).subscribe({
      //   next: (res: Pagination<City>) => {
      //     var responses = res;
      //     console.log('data ne ' + res);
      //     var response = res.data;
      //     console.log('Resssss' + response);
      //     var abc = Object.keys(response);
      //     var ddd = Object.values(response);
      //     var abc1 = Object.values(response)[0];
      //     var ddd1 = Object.values(response)[1];
      //     var sddd = Object.keys(response)[0];
      //     var sdddss = Object.keys(response)[1];
      //     // var k=response["id"];
      //     var mm = abc[0];
      //     this.entityForm.setValue({
      //       id: Object.values(response)[0],
      //       name: Object.values(response)[1],
      //       status:"6626"
      //     });
      //     setTimeout(() => {
      //       this.blockedPanel = false;
      //     }, 1000);
      //   },
      //   error: () =>
      //     setTimeout(() => {
      //       this.blockedPanel = false;
      //     }, 1000),
      //   complete: () => console.info('complete'),
      // })
    );
  }
  public saveChange() {
    this.btnDisabled = true;
    this.blockedPanel = true;
    if (this.entityId) {
      this.subscription.add(
        this.cityService
          .update(this.entityId, this.entityForm.getRawValue())
          // .subscribe(
          //   () => {
          //     this.savedEvent.emit(this.entityForm.value);
          //     this.notificationService.showSuccess(
          //       MessageConstants.UPDATED_OK_MSG
          //     );
          //     this.btnDisabled = false;
          //     setTimeout(() => {
          //       this.blockedPanel = false;
          //       this.btnDisabled = false;
          //     }, 1000);
          //   },
          //   (error) => {
          //     setTimeout(() => {
          //       this.blockedPanel = false;
          //       this.btnDisabled = false;
          //     }, 1000);
          //   }
          // )
          .subscribe({
            next: () => {
              this.savedEvent.emit(this.entityForm.value);
              this.notificationService.showSuccess(
                MessageConstants.UPDATED_OK_MSG
              );
              this.btnDisabled = false;
              setTimeout(() => {
                this.blockedPanel = false;
                this.btnDisabled = false;
              }, 1000);
            },
            error: () => {
              setTimeout(() => {
                this.blockedPanel = false;
                this.btnDisabled = false;
              }, 1000)
            },
            complete: () => console.info('complete'),
          })
      );
    } else {
      this.subscription.add(
        this.cityService.add(this.entityForm.getRawValue()).subscribe(
          () => {
            this.savedEvent.emit(this.entityForm.value);
            this.notificationService.showSuccess(
              MessageConstants.CREATED_OK_MSG
            );
            this.btnDisabled = false;
            setTimeout(() => {
              this.blockedPanel = false;
              this.btnDisabled = false;
            }, 1000);
          },
          (error) => {
            setTimeout(() => {
              this.blockedPanel = false;
              this.btnDisabled = false;
            }, 1000);
          }
        )
      );
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
