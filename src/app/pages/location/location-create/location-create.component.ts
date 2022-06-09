import { AfterViewChecked, Component, ElementRef, OnInit } from '@angular/core';
import * as goongjs from 'src/assets/goong-js';
import * as GoongGeocoder from 'src/assets/goonggeo';
@Component({
  selector: 'app-location-create',
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.scss']
})
export class LocationCreateComponent implements OnInit, AfterViewChecked {

  constructor(private elementRef: ElementRef) {

  }
  ngAfterViewChecked() {
    // var s = document.createElement("script");
    // s.type = "text/javascript";
    // s.src = "src/assets/goong-js";
    // this.elementRef.nativeElement.appendChild(s);

    
  }
  ngOnInit(): void {
    goongjs.accessToken = 'LnOytBI19Yitg3XO9SXpl998VuETKd1dvW33CLH6';

    var map = new goongjs.Map({
      container: 'map',
      style: 'https://tiles.goong.io/assets/goong_map_web.json', // stylesheet location
      center: [108.212, 16.068], // starting position [lng, lat]
      zoom: 5 // starting zoom
    });
    // var marker = new goongjs.Marker()
    //         .setLngLat([105.85258524102564, 21.0287601])// position add marker [lng, lat]
    //         .addTo(map);

    var zoom = new goongjs.NavigationControl(
      {
        showCompass: false,
      });

    var getLocal = new goongjs.GeolocateControl(
      {
        positionOptions: {
          enableHighAccuracy: false,
          timeout: 6000
        },
        trackUserLocation: false,
        showUserLocation: true
      })

    map.addControl(getLocal, 'bottom-right');
    map.addControl(zoom, 'bottom-right');

    var geoCoder = new GoongGeocoder({
      accessToken: 'tp8LQTrbuMGjoMI0ijUDJ7ClVqO3hAZSCJOngtu7',
      goongjs: goongjs
    })

    // Add the control to the map.
    map.addControl(geoCoder);

    map.on('load', function () {
      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      map.addSource('earthquakes', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: 'https://data.opendevelopmentmekong.net/dataset/594f31c3-edb4-4799-9c5f-919793e3a29d/resource/10453931-345b-40fb-adc0-35eca5831381/download/station_test_covid19_en.geojson',
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle', //circle, point, custom
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.goong.io/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10, '#f1f075',
            50, '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10, 30,
            50, 40
          ]
        }
      });

      map.addLayer({
        id: 'cluster-count', // Create id
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Roboto Regular'],
          'text-size': 12
        }
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'earthquakes',
        filter: ['!', ['has', 'point_count']], // type express Decision
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      // inspect a cluster on click
      map.on('click', 'clusters', function (e:any) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('earthquakes').getClusterExpansionZoom(
          clusterId,
          function (err:any, zoom:any) {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      map.on('click', 'unclustered-point', function (e:any) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var local = e.features[0].properties.Location;
        var area = e.features[0].properties.Area;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new goongjs.Popup()
          .setLngLat(coordinates)
          .setHTML(
            'Local: ' + local + '<br>Area: ' + area
          )
          .addTo(map);
      });

      map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
      });
    });
  }

}
