import { Location } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
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
  catchError,
  filter,
  map,
  Observable,
  of,
  partition,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { isExistedNameValidatorLocation } from 'src/app/common/validations';
import { IdValue, LocationCreate } from 'src/app/models';
import { LocationService } from 'src/app/services';
import * as goongjs from 'src/assets/goong-js';
import * as GoongGeocoder from 'src/assets/goonggeo';
import { AreaModalComponent } from '../../share';
import { LocationTypeModalComponent } from '../../share/location-type-modal/location-type-modal.component';
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
 status: { id: string; value: string }[] = [];
  constructor(
    @Inject(LOCATION_STATE) private locationState: RxState<LocationState>,
    private fb: FormBuilder,
    private state: RxState<LocationCreateState>,
    private locationService: LocationService,
    private toast: HotToastService,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
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
    var s: keyof typeof this.geoCoder.lastSelected = 'description';
    var data = JSON.parse(this.geoCoder?.lastSelected);
    this.form.controls['address'].setValue(Object(data)['description']);
  }
  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, _) => ({
      showLocationDescription: !prev.showLocationDescription,
    }));
    this.initForm();
    this.status = this.locationService.status;
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
      ({ form }) => form.valid
    );

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        switchMap(({ form, redirect }) =>
          this.locationService.addLocation(form.value as LocationCreate).pipe(
            catchError(() => of({ status: 'data not modified', data: null })),
            map((r) => ({ ...r, redirect }))
          )
        ),
        tap((result) => {
          if (result.data?.id) {
            this.toast.success(`Tạo địa điểm ${result.data.name} thành công`);
            if (this.router.url.endsWith('redirect')) {
              this.locationService.locationAdded$.next({
                id: result.data.id,
                name: result.data!.name!,
              });
              this.location.back();
            } else {
              this.router.navigate(['../'], {
                relativeTo: this.activatedRoute,
              });
            }
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

    this.state.hold(invalid$.pipe(), ({ form, redirect }) => {
      this.toast.error('Giá trị nhập không hợp lệ! Hãy kiểm tra lại');
      form.revalidateControls([]);
    });

    //add locationTypeAdded
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

  form!: FormGroup;
  simpleForm = false;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      name: [
        null,
        [Validators.required],
        [isExistedNameValidatorLocation(this.locationService, 'Thêm')],
      ],
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
  get vm$(): Observable<LocationCreateState> {
    return this.state.select();
  }

  formSubmit$ = new Subject<FormGroup>();
  // submit$ = new Subject<FormGroup>();
  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();

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

  get name() {
    return this.form.get('name');
  }

  public get submitting$(): Observable<boolean> {
    return this.state.select('submitting');
  }
}
