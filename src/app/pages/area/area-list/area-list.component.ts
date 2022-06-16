import {
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  Observable,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';

import {
  AreaListItem,
  AreaListSearch,
  IdValue,
  PagingMetadata,
} from 'src/app/models';
import { AreaService } from 'src/app/services/area.service';
import { PageInfo, SortInfo } from 'src/app/types';
import { AreaModalComponent, DeleteModalComponent } from '../../share';
import { AreaListState } from '../states';
import { AreaState, AREA_STATE } from '../states/area.state';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
})
export class AreaListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  citys = new Map<number, string>();
  constructor(
    @Inject(AREA_STATE) private areaState: RxState<AreaState>,
    private areaSerice: AreaService,
    private areaListState: RxState<AreaListState>,
    private modalService: BsModalService,
    private toast: HotToastService
  ) {}
  ngOnInit(): void {
    this.initTable();
    this.areaListState.connect(
      this.search$.pipe(
        tap(() => this.areaListState.set({ loading: true })),
        switchMap((s) => this.areaSerice.getAreas(s))
      ),
      (_, result) => ({
        areas: result.data.map(
          (x, i) =>
            ({
              index: ++i,
              id: x.id,
              name: x.name,
              status: x.status,
              // cityId: x.cityId,
              cityId: this.citys.get(x.cityId),
            } as AreaListItem)
        ),
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.areaListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.areaListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.areaListState.hold(this.resetSearch$, () => {
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
        maxWidth: 300,
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'name',
        name: 'Tên khu vực',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'status',
        // canAutoResize: true,
        maxWidth: 300,
        name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'cityId',
        maxWidth: 350,
        name: 'Thành phố',
        sortable: false,
      },

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

  get areas$(): Observable<AreaListItem[]> {
    return this.areaListState.select('areas');
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.areaListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.areaListState.select('loading');
  }
  get cityIds$(): Observable<IdValue[]> {
    return this.areaState
      .select('cityIds')
      .pipe(tap((x) => x.forEach((x) => this.citys.set(x.id, x.value))));
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

  searchForm = new FormGroup({
    keyword: new FormControl(),
    cityIds: new FormControl(),
  });
  submitSearch$ = new Subject<Partial<FromType>>();
  search$ = new BehaviorSubject<AreaListSearch>({});
  resetSearch$ = new Subject<void>();

  showAddArea() {
    const bsModalRef = this.modalService.show(AreaModalComponent, {
      initialState: {
        simpleForm: false,
        title: 'khu vực',
        type: 'Thêm',
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        const data = result as { id: number; name: string };
        if (data.id > 0 && data.name.length > 0) {
          this.toast.success('Tạo khu vực thành công!', {
            position: 'top-center',
            duration: 5000,
            style: {
              border: '1px solid #0a0',
              padding: '16px',
            },
            iconTheme: {
              primary: '#0a0',
              secondary: '#fff',
            },
            role: 'status',
            ariaLive: 'polite',
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
        title: 'khu vực',
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
    const bsModalRef = this.modalService.show(AreaModalComponent, {
      initialState: {
        id: id,
        title: 'khu vực',
        type: 'Cập nhật',
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        const data = result as { id: number; name: string };
        if (data.id > 0 && data.name !== undefined) {
          this.toast.success('Cập nhật khu vực thành công!', {
            position: 'top-center',
            duration: 2000,
            style: {
              border: '1px solid #0a0',
              padding: '16px',
            },
            iconTheme: {
              primary: '#0a0',
              secondary: '#fff',
            },
            role: 'status',
            ariaLive: 'polite',
          });
          this.search$.next({
            ...this.search$.getValue(),
          });
        }
      },
    });
  }
}

declare type FromType = {
  keyword: string;
  cityIds: number[];
};
