import { Component, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable, Subject } from 'rxjs';


interface ProductEditState{
  showProductDescription:boolean;
}

@Component({
  selector: 'app-area-edit',
  templateUrl: './area-edit.component.html',
  styleUrls: ['./area-edit.component.scss'],
  providers:[RxState],
})
export class AreaEditComponent implements OnInit {


  constructor(
    private state:RxState<ProductEditState>,
  ) { 
    this.state.set({
      showProductDescription:false
    })
  }

  ngOnInit(): void {
    this.state.connect(
      this.toggleDescription$,(prev,curr)=>({
        showProductDescription:!prev.showProductDescription
      })
    )
  }
  toggleDescription$=new Subject<void>();
  get vm$():Observable<ProductEditState>{
    return this.state.select();
  }
  https://www.youtube.com/watch?v=k7aQ2q_v2F8
  24
}
