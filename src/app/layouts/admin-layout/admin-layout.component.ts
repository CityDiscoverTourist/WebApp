import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  typeSelected: string;
  constructor(private spinnerService: NgxSpinnerService) {
    this.typeSelected = 'ball-fussion';
  }
  ngOnInit(): void {

    this.spinnerService.show();

    setTimeout(() => {
      this.spinnerService.hide();
    }, 5000); 
  }

  status = false;
  AddFunction() {
    if (!this.status) {
      this.status = true;
    } else {
      this.status = false;
    }
  }

  

}
