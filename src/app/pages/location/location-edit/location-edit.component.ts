import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  DoCheck,
  Inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import {
  BehaviorSubject,
  Observable,
  partition,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { IdValue, LocationCreate } from 'src/app/models';
import { LocationService } from 'src/app/services';
import { LocationDetailState } from '../states';
import { LocationState, LOCATION_STATE } from '../states/location.state';
import * as goongjs from 'src/assets/goong-js';
import * as GoongGeocoder from 'src/assets/goonggeo';
import { HotToastService } from '@ngneat/hot-toast';

interface LocationEditState {
  showLocationDescription: boolean;
  submitting: boolean;
}

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss'],
})
export class LocationEditComponent
  implements OnInit, AfterViewChecked, AfterContentInit
{
  geoCoder: any;
  map: any;
  id = '';
  constructor(
    private locationDetailState: RxState<LocationDetailState>,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private fb: FormBuilder,
    @Inject(LOCATION_STATE) private locationState: RxState<LocationState>,
    private state: RxState<LocationEditState>,
    private toast: HotToastService
  ) {
    this.state.set({
      showLocationDescription: false,
    });
  }
  ngAfterContentInit() {
    // let myRow = document.getElementsByClassName('mapboxgl-ctrl-geocoder--input');
    // if(myRow!=null){
    //   (myRow.querySelector('.mapboxgl-ctrl-geocoder--input') as HTMLInputElement).value = "2 Công Xã Paris, Quận 1, Hồ Chí Minh";
    // }
  }
  ngAfterViewChecked(): void {
    if (
      this.geoCoder?._map?._easeOptions?.center[0] !== '' &&
      this.geoCoder?._map?._easeOptions?.center[0] != undefined
    ) {
      // console.log(this.geoCoder);
      // console.log(this.geoCoder?._typeahead?.selected?.description);
      this.form.controls['address'].setValue(
        `${this.geoCoder?._typeahead?.selected?.description}` == 'undefined'
          ? ''
          : `${this.geoCoder?._typeahead?.selected?.description}`
      );
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.state.connect(this.toggleDescription$, (prev, _) => ({
      showLocationDescription: !prev.showLocationDescription,
    }));
    this.search$.next({ id: this.route.snapshot.params['id'] });
    this.locationDetailState.connect(
      this.search$
        .pipe(
          tap((_) => this.locationDetailState.set({ loading: true })),
          switchMap((s) => this.locationService.getLocationById(s.id))
        )
        .pipe(
          tap((data) => {
            this.id = data.id.toString();
            this.form.patchValue(data);
          })
        ),
      (_, result) => ({
        location: result,
        loading: false,
      })
    );

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

    const [valid$, invalid$] = partition(this.submit$, (f) => f.value);

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        switchMap((f) =>
          this.locationService.updateLocationById(f.value as LocationCreate)
        ),
        tap((result) => {
          if (result.id) {
            this.toast.success('Cập nhật vị trí thành công');
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
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });
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
  get vm$(): Observable<LocationEditState> {
    return this.state.select();
  }

  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<FormGroup>();

  // submitForm() {
  //   const valid = this.form.valid;
  //   // this.formSubmit$.next(this.form);
  //   console.log(`form state =${valid}`, this.form.value);

  //   if (valid) {
  //     this.formSubmit$.next(this.form);
  //   } else {
  //     this.form.revalidateControls([]);
  //   }
  // }
}
