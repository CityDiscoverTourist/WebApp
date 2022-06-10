import { Component, Inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { AreaService } from 'src/app/services';
import { LocationtypeService } from 'src/app/services/locationtype.service';
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
    private readonly areaService: AreaService
  ) {
    locationState.connect(locationTypeService.getLocationType(), (_, curr) => ({
      locationTypeIds: curr,
    }));
    locationState.connect(areaService.getAreaType(), (_, curr) => ({
      areaIds: curr,
    }));
  }
}
