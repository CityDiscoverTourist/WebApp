import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { LocationService } from 'src/app/services';
import { LocationDetailState } from '../states';

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss'],
})
export class LocationEditComponent implements OnInit {
  id = '';
  constructor(
    private locationDetailState: RxState<LocationDetailState>,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.search$.next({ id: this.route.snapshot.params['id'] });
    this.locationDetailState.connect(
      this.search$
        .pipe(
          tap((_) => this.locationDetailState.set({ loading: true })),
          switchMap((s) => this.locationService.getLocationById(s.id))
        )
        .pipe(tap((data) => (this.id = data.id.toString()))),
      (_, result) => ({
        location: result,
        loading: false,
      })
    );
    
  }
  search$ = new BehaviorSubject<{ id: string }>({ id: '' });
}
