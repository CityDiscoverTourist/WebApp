import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  INJECTOR,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import {
  BehaviorSubject,
  mergeMap,
  Observable,
  of,
  retry,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  IdValue,
  LocationListItem,
  PagingMetadata,
  SearchInfo,
} from 'src/app/models';
import { LocationService } from 'src/app/services/location.service';
import { PageInfo, SortInfo } from 'src/app/types';

import { LocationListSearch } from 'src/app/models';
import { LocationState, LOCATION_STATE } from '../states/location.state';
import { LocationListState } from '../states/locationlist.state';
import { DeleteModalComponent } from '../../share';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class LocationListComponent implements OnInit {
  columns: TableColumn[];
  constructor(
    @Inject(LOCATION_STATE) private locationState: RxState<LocationState>,
    private locationSerice: LocationService,
    private locationListState: RxState<LocationListState>,
    private modalService: BsModalService,
    private toast: HotToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initTable();

    this.locationListState.connect(
      this.search$.pipe(
        tap((_) => this.locationListState.set({ loading: true })),
        switchMap((s) => this.locationSerice.getLocations(s))
      ),
      (_, result) => ({
        locations: result.data.map(
          (x, index) =>
            ({
              index: ++index,
              id: x.id,
              name: x.name,
              description: x.description,
              longitude: x.longitude,
              latitude: x.latitude,
              address: x.address,
              status: x.status,
              areaId: x.areaId,
              locationTypeId: x.locationTypeId,
            } as LocationListItem)
        ),
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.locationListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.locationListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.locationListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.search$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }
  @ViewChild('actionTemplate', { static: true })
  public actionTemplate: TemplateRef<any>;
  initTable() {
    this.columns = [
      {
        prop: 'name',
        maxWidth: 250,
        name: 'Tên khu vực',
        sortable: true,
      },
      // {
      //   prop: 'description',
      //   canAutoResize: true,
      //   name: 'Mô tả',
      // },
      // {
      //   prop: 'longitude',
      //   maxWidth: 120,
      //   name: 'Kinh độ',
      //   sortable: false,
      // },
      // {
      //   prop: 'latitude',
      //   maxWidth: 120,
      //   name: 'Vĩ độ',
      //   sortable: false,
      // },
      {
        prop: 'address',
        canAutoResize: true,
        name: 'Địa chỉ',
        sortable: true,
        cellClass: 'text-overflow: ellipsis;',
      },
      {
        prop: 'status',
        maxWidth: 100,
        minWidth: 150,
        name: 'Trạng thái',
        sortable: true,
      },
      // {
      //   prop: 'areaId',
      //   maxWidth: 100,
      //   name: 'Khu vực',
      //   sortable: true,
      // },
      // {
      //   prop: 'locationTypeId',
      //   maxWidth: 100,
      //   name: 'Loại vị trí',
      //   sortable: true,
      // },
      {
        prop: 'action',
        minWidth: 180,
        name: 'Hành động',
        sortable: false,
        maxWidth: 200,
        canAutoResize: true,
        cellTemplate: this.actionTemplate,
        cellClass: 'align-items-center d-flex',
      },
    ];
  }

  onPage(paging: PageInfo) {
    this.search$.next({
      ...this.search$.getValue(),
      currentPage: paging.offset,
    });
  }
  onSort(event: SortInfo) {
    this.table.offset - 1;
    this.search$.next({
      ...this.search$.getValue(),
      sort: { sortBy: event.column.prop, dir: event.newValue },
    });
  }

  submitSearch$ = new Subject<Partial<FromType>>();
  search$ = new BehaviorSubject<LocationListSearch>({});
  resetSearch$ = new Subject<void>();

  get locationTypeIds$(): Observable<IdValue[]> {
    return this.locationState.select('locationTypeIds');
  }
  get areaIds$(): Observable<IdValue[]> {
    return this.locationState.select('areaIds');
  }

  searchForm = new FormGroup({
    keyword: new FormControl(),
    locationTypeIds: new FormControl(),
    areaIds: new FormControl(),
  });

  get locations$(): Observable<LocationListItem[]> {
    return this.locationListState.select('locations');
  }
  get loading$(): Observable<boolean> {
    return this.locationListState.select('loading');
  }

  get metadata$(): Observable<PagingMetadata> {
    return this.locationListState.select('metadata');
  }

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  onDelete(id: string) {
    const bsModalRef = this.modalService.show(DeleteModalComponent, {
      initialState: {
        id: id,
        title: 'vị trí',
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        this.search$.next({
          ...this.search$.getValue(),
        });
      },
    });
  }

  onUpdate(id: string) {
    this.router.navigate([`./${id}/edit`], {
      relativeTo: this.activatedRoute,
    });
  }
}

declare type FromType = {
  keyword: string;
  locationTypeIds: number[];
  areaIds: number[];
};
