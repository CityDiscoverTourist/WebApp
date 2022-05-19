import { Component, Inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { CityService } from 'src/app/services';
import { AreaListPageState, AREA_PAGE_STATE } from './area-list/states';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  providers:[RxState]
})
export class AreaComponent implements OnInit {

  constructor(private readonly cityService:CityService,
    @Inject(AREA_PAGE_STATE) areaPageState:RxState<AreaListPageState>){
      areaPageState.connect(cityService.getCityType(),
      (_,curr)=>({
        citytypes:curr
      }));
  }
  ngOnInit(): void {
  }

}
