import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  filter,
  Observable,
  partition,
  Subject,
  switchMap,
  tap,
  take,
} from 'rxjs';
import { IdValue, LocationCreate } from 'src/app/models';
import { LocationService } from 'src/app/services';
import * as goongjs from 'src/assets/goong-js';
import * as GoongGeocoder from 'src/assets/goonggeo';
import { AreaModalComponent, LocationTypeModalComponent } from '../../share';
import { LocationDetailState } from '../states';
import { LocationState, LOCATION_STATE } from '../states/location.state';

interface LocationEditState {
  showLocationDescription: boolean;
  submitting: boolean;
}

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss'],
})
export class LocationEditComponent implements OnInit, AfterViewChecked {
  geoCoder: any;
  map: any;
  id = '';
 status: { id: string; value: string }[] = [];
  constructor(
    private locationDetailState: RxState<LocationDetailState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService,
    private fb: FormBuilder,
    @Inject(LOCATION_STATE) private locationState: RxState<LocationState>,
    private modalService: BsModalService,
    private state: RxState<LocationEditState>,
    private toast: HotToastService
  ) {
    this.state.set({
      showLocationDescription: false,
    });
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
    this.status = this.locationService.status;
    this.state.connect(this.toggleDescription$, (prev, _) => ({
      showLocationDescription: !prev.showLocationDescription,
    }));
    this.search$.next({ id: this.activatedRoute.snapshot.params['id'] });
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

    const [valid$, invalid$] = partition(
      this.submit$,
      ({ form, redirect }) => form.valid
    );

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        switchMap(({ form, redirect }) =>
          this.locationService.updateLocationById(form.value as LocationCreate)
        ),
        tap((result) => {
          if (result.data?.id) {
            this.toast.success(`Tạo ${result.data.name} thành công`);
            this.router.navigate(['../'], {
              relativeTo: this.activatedRoute,
            });
          } else {
            return;
          }
        })
      ),
      (_prev, curr) => ({
        error: undefined,
        submitting: false,
      })
    );
    // hay
    this.state.hold(invalid$.pipe(), ({ form, redirect }) => {
      this.toast.error('Giá trị nhập không hợp lệ! Hãy kiểm tra lại');
      form.revalidateControls([]);
    });
    this.locationState.connect(
      this.locationTypeAdded$.pipe(
        tap((locationType) => {
          this.form.get('locationTypeId')?.setValue(locationType.id);
        })
      ),
      (prev, curr) => ({
        locationTypeIds: [
          ...prev.locationTypeIds,
          { id: curr.id, value: curr.name },
        ],
      })
    );
    this.locationState.connect(
      this.areaAdded$.pipe(
        tap((area) => {
          this.form.get('areaId')?.setValue(area.id);
        })
      ),
      (prev, curr) => ({
        areaIds: [...prev.areaIds, { id: curr.id, value: curr.name }],
      })
    );
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
      address: ['', [Validators.required]],
      status: ['', [Validators.required]],
      areaId: [null, [Validators.required]],
      locationTypeId: [null, [Validators.required]],
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
  // submit$ = new Subject<FormGroup>();
  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();

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
  showAddLocationType() {
    const bsModalRef = this.modalService.show(LocationTypeModalComponent, {
      initialState: {
        simpleForm: false,
        title: 'loại địa điểm',
        type: 'Thêm',
      },
    });
    bsModalRef.onHide
      ?.pipe(
        take(1),
        filter((s) => (s as any).success)
      )
      .subscribe({
        next: (result) => {
          const data = result as { id: number; name: string };
          const locationTypeAdded = result as { id: number; name: string };
          this.locationTypeAdded$.next({
            id: locationTypeAdded.id,
            name: locationTypeAdded.name,
          });
          if (data.id > 0 && data.name.length > 0) {
            this.toast.success('Tạo loại địa điểm thành công!');
          }
        },
      });
  }
  showAddArea() {
    const bsModalRef = this.modalService.show(AreaModalComponent, {
      initialState: {
        simpleForm: false,
        title: 'khu vực',
        type: 'Thêm',
      },
    });
    bsModalRef.onHide
      ?.pipe(
        take(1),
        filter((s) => (s as any).success)
      )
      .subscribe({
        next: (result) => {
          const data = result as { id: number; name: string };
          const areaAdded = result as { id: number; name: string };
          this.areaAdded$.next({
            id: areaAdded.id,
            name: areaAdded.name,
          });
          if (data.id > 0 && data.name.length > 0) {
            this.toast.success('Tạo khu vực thành công!');
          }
        },
      });
  }
  locationTypeAdded$ = new Subject<{ id: number; name: string }>();
  areaAdded$ = new Subject<{ id: number; name: string }>();
  public get submitting$(): Observable<boolean> {
    return this.state.select('submitting');
  }
}
