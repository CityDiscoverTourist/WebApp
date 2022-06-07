import { Component, Inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { CityService } from 'src/app/services';
import { AreaService } from 'src/app/services/area.service';
import { AreaListPageState, AREA_PAGE_STATE } from './area-list/states';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  providers: [RxState],
})
export class AreaComponent implements OnInit {
  constructor(
    private readonly cityService: CityService,
    private readonly areaService: AreaService,
    @Inject(AREA_PAGE_STATE) areaListPageState: RxState<AreaListPageState>
  ) {
    areaListPageState.connect(cityService.getCityIdValue(), (_, curr) => ({
      cityIds: curr,
    }));
  }
  ngOnInit(): void {}
}
