import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  filter,
  Observable,
  Subject,
  switchMap,
  take,
  tap
} from 'rxjs';
import {
  LocationTypeListItem,
  PagingMetadata,
  SearchInfo
} from 'src/app/models';
import { LocationtypeService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { DeleteModalComponent } from '../../share';
import { LocationTypeModalComponent } from '../../share/location-type-modal/location-type-modal.component';
import { LocationTypeListState } from '../states';

@Component({
  selector: 'app-location-type-list',
  templateUrl: './location-type-list.component.html',
  styleUrls: ['./location-type-list.component.scss'],
  providers: [RxState],
})
export class LocationTypeListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  status: { id: number; value: string }[] = [];
  constructor(
    private locationTypeListState: RxState<LocationTypeListState>,
    private locationTypeService: LocationtypeService,
    private modalService: BsModalService,
    private toast: HotToastService
  ) {}
  ngOnInit(): void {
    this.initTable();
    this.locationTypeListState.connect(
      this.search$
        .pipe(
          tap(() => this.locationTypeListState.set({ loading: true })),
          switchMap((s) => this.locationTypeService.getLocationTypes(s))
        )
        .pipe(tap((data) => console.log(data))),
      (_, result) => ({
        locationtypes: result.data.map(
          (x, i) =>
            ({
              index: ++i,
              id: x.id,
              name: x.name,
              status: x.status,
            } as LocationTypeListItem)
        ),
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.status = this.locationTypeService.status;

    this.locationTypeListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.locationTypeListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.locationTypeListState.hold(this.resetSearch$, () => {
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
        prop: 'index',
        name: 'STT',
        sortable: false,
        width: 50,
      },
      {
        prop: 'name',
        name: 'T??n lo???i ?????a ??i???m',
        sortable: true,
        minWidth: 300,
      },
      {
        prop: 'status',
        maxWidth: 350,
        minWidth: 200,
        name: 'Tr???ng th??i',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'action',
        minWidth: 180,
        name: 'H??nh ?????ng',
        sortable: false,
        maxWidth: 200,
        canAutoResize: true,
        cellTemplate: this.actionTemplate,
        cellClass: 'align-items-center d-flex',
      },
    ];
  }

  get locationtypes$(): Observable<LocationTypeListItem[]> {
    return this.locationTypeListState.select('locationtypes');
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.locationTypeListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.locationTypeListState.select('loading');
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

  search$ = new BehaviorSubject<SearchInfo>({});
  searchForm = new FormGroup({
    keyword: new FormControl(),
    status: new FormControl(),
  });

  submitSearch$ = new Subject<Partial<{ keyword: string; status: string }>>();
  resetSearch$ = new Subject<void>();

  showAddLocationType() {
    const bsModalRef = this.modalService.show(LocationTypeModalComponent, {
      initialState: {
        simpleForm: false,
        title: 'lo???i ?????a ??i???m',
        type: 'Th??m',
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
          if (data.id > 0 && data.name.length > 0) {
            this.toast.success('T???o lo???i ?????a ??i???m th??nh c??ng!', {
              position: 'top-center',
              duration: 5000,
            });
          }
          this.search$.next({
            ...this.search$.getValue(),
          });
        },
      });
  }
  onDelete(id: string) {
    const bsModalRef = this.modalService.show(DeleteModalComponent, {
      initialState: {
        id: id,
        title: 'lo???i ?????a ??i???m',
      },
    });
    bsModalRef.onHide
      ?.pipe(
        take(1),
        filter((s) => (s as any).data)
      )
      .subscribe({
        next: (result) => {
          this.search$.next({
            ...this.search$.getValue(),
          });
        },
      });
  }

  onUpdate(id: string) {
    const bsModalRef = this.modalService.show(LocationTypeModalComponent, {
      initialState: {
        id: id,
        title: 'lo???i v??? tr??',
        type: 'C???p nh???t',
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
          if (data.id > 0 && data.name !== undefined) {
            this.toast.success('C???p nh???t lo???i v??? tr?? th??nh c??ng!');
            this.search$.next({
              ...this.search$.getValue(),
            });
          }
        },
      });
  }
}
