import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { Observable, partition, Subject, switchMap, tap } from 'rxjs';
import { IdValue, LocationCreate } from 'src/app/models';
import { LocationService } from 'src/app/services';
import * as goongjs from 'src/assets/goong-js';
import * as GoongGeocoder from 'src/assets/goonggeo';
import { LocationState, LOCATION_STATE } from '../states/location.state';

interface LocationCreateState {
  showLocationDescription: boolean;
  submitting: boolean;
}

@Component({
  selector: 'app-location-create',
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class LocationCreateComponent implements OnInit, AfterViewChecked {
  geoCoder: any;
  map: any;
  constructor(
    @Inject(LOCATION_STATE) private locationState: RxState<LocationState>,
    private fb: FormBuilder,
    private state: RxState<LocationCreateState>,
    private locationService: LocationService,
    private toast: HotToastService
  ) {
    this.state.set({
      showLocationDescription: false,
    });
  }

  ngAfterViewChecked() {
    this.form.controls['longitude'].setValue(
      `${this.geoCoder?._map?._easeOptions?.center[1]}`
    );
    this.form.controls['latitude'].setValue(
      `${this.geoCoder?._map?._easeOptions?.center[0]}`
    );
    // //get place id
    var s: keyof typeof this.geoCoder.lastSelected = 'description';
    var data = JSON.parse(this.geoCoder?.lastSelected);
    this.form.controls['address'].setValue(Object(data)['description']);
  }
  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, _) => ({
      showLocationDescription: !prev.showLocationDescription,
    }));
    this.initForm();
    goongjs.accessToken = 'LnOytBI19Yitg3XO9SXpl998VuETKd1dvW33CLH6';
    this.map = new goongjs.Map({
      container: 'map',
      style: 'https://tiles.goong.io/assets/goong_map_web.json', // stylesheet location
      center: [106.81028, 10.84086], // starting position [lng, lat]
      zoom: 7,
    });
    var marker = new goongjs.Marker()
      .setLngLat([106.81028, 10.84086]) // position add marker [lng, lat]
      .addTo(this.map);

    var zoom = new goongjs.NavigationControl({
      showCompass: true,
    });

    var getLocal = new goongjs.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 6000,
      },
      trackUserLocation: false,
      showUserLocation: true,
    });

    this.map.addControl(getLocal, 'bottom-right');
    this.map.addControl(zoom, 'bottom-right');

    this.geoCoder = new GoongGeocoder({
      accessToken: 'tp8LQTrbuMGjoMI0ijUDJ7ClVqO3hAZSCJOngtu7',
      goongjs: goongjs,
    });

    // Add the control to the map.
    this.map.addControl(this.geoCoder);

    const [valid$, invalid$] = partition(this.submit$, (f) => f.valid);

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        switchMap((f) =>
          this.locationService.addLocation(f.value as LocationCreate)
        ),
        tap((result) => {
          if (result.id) {
            this.toast.success('Tạo quest thành công');
          }
        })
      ),
      (_prev, curr) => ({
        error: undefined,
        submitting: false,
      })
    );
    // hay
    this.state.hold(invalid$.pipe(), (f) => {
      this.toast.error('Giá trị bạn nhập không đúng');
      // this.form.revalidateControls([]);
      f.revalidateControls([]);
    });
  }

  form!: FormGroup;
  simpleForm = false;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      name: [null, [Validators.required]],
      description: [''],
      longitude: [''],
      latitude: [''],
      address: [''],
      status: [''],
      areaId: [],
      locationTypeId: [],
    });
  }

  get locationTypeIds$(): Observable<IdValue[]> {
    return this.locationState.select('locationTypeIds');
  }
  get areaIds$(): Observable<IdValue[]> {
    return this.locationState.select('areaIds');
  }

  toggleDescription$ = new Subject<void>();
  get vm$(): Observable<LocationCreateState> {
    return this.state.select();
  }

  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<FormGroup>();

  submitForm() {
    const valid = this.form.valid;
    // this.formSubmit$.next(this.form);
    console.log(`form state =${valid}`, this.form.value);

    if (valid) {
      // this.formSubmit$.next(this.form);
    } else {
      this.form.revalidateControls([]);
    }
  }
}
