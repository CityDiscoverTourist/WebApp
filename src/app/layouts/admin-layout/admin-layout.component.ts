import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  ngOnInit(): void {}

  status = false;
  AddFunction() {
    if (!this.status) {
      this.status = true;
    } else {
      this.status = false;
    }
  }
}
