import { Component, Inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { CityService } from 'src/app/services';
import { AreaState, AREA_STATE } from './states/area.state';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  providers: [RxState],
})
export class AreaComponent implements OnInit {
  constructor(
    private readonly cityService: CityService,
    @Inject(AREA_STATE) areaListPageState: RxState<AreaState>
  ) {
    areaListPageState.connect(cityService.getCityIdValue(), (_, curr) => ({
      cityIds: curr,
    }));
  }
  ngOnInit(): void {}
}
