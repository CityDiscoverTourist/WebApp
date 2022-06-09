import { AfterViewChecked, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as goongjs from 'src/assets/goong-js';
import * as GoongGeocoder from 'src/assets/goonggeo';
@Component({
  selector: 'app-location-create',
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.scss'],
})
export class LocationCreateComponent implements OnInit, AfterViewChecked {
  geoCoder: any;
  map: any;
  constructor(private fb: FormBuilder) {}

  ngAfterViewChecked() {
    // console.log(this.geoCoder);
    // //get latlong
    console.log(this.geoCoder?._map?._easeOptions?.center);
    this.form.controls['longitude'].setValue(this.geoCoder?._map?._easeOptions?.center[0]);
    this.form.controls['latitude'].setValue(this.geoCoder?._map?._easeOptions?.center[1]);
    // //get place id
    // console.log(this.geoCoder?._typeahead?.selected?.place_id);
  }
  ngOnInit(): void {
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
  }

  form!: FormGroup;
  simpleForm = false;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      name: [null, [Validators.required]],
      description: [],
      longitude: [],
      latitude: [],
      address: [],
      status: [],
      areaId: [],
      locationTypeId: [],
    });
  }

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
