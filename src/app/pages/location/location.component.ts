import { Component, Inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { AreaService, CityService } from 'src/app/services';
import { LocationtypeService } from 'src/app/services/locationtype.service';
import { AreaState, AREA_STATE } from '../area/states/area.state';
import { LocationState, LOCATION_STATE } from './states/location.state';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [RxState],
})
export class LocationComponent implements OnInit {
  ngOnInit(): void {}

  constructor(
    @Inject(LOCATION_STATE) locationState: RxState<LocationState>,
    private readonly locationTypeService: LocationtypeService,
    private readonly areaService: AreaService,
    private readonly cityService: CityService,
    @Inject(AREA_STATE) areaState: RxState<AreaState>
  ) {
    locationState.connect(locationTypeService.getLocationType(), (_, curr) => ({
      locationTypeIds: curr,
    }));
    locationState.connect(areaService.getAreaType(), (_, curr) => ({
      areaIds: curr,
    }));
    areaState.connect(cityService.getCityIdValue(), (_, curr) => ({
      cityIds: curr,
    }));
  }
}
