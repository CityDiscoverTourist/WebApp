import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { CityListItem, PagingMetadata, SearchInfo } from 'src/app/models';
import { CityService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { CityModalComponent } from '../../share/city-modal/city-modal.component';
import { DeleteModalComponent } from '../../share/delete-modal/delete-modal.component';
import { CityListState } from '../states';
@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
  providers: [RxState],
  encapsulation: ViewEncapsulation.None,
})
export class CityListComponent implements OnInit {
  records: CityListItem[] = [];
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  status: { id: string; value: string }[] = [];

  constructor(
    private cityListState: RxState<CityListState>,
    private cityService: CityService,
    private modalService: BsModalService,
    private toast: HotToastService
  ) {}
  ngOnInit(): void {
    this.initTable();
    this.cityListState.connect(
      this.search$.pipe(
        tap(() => this.cityListState.set({ loading: true })),
        switchMap((s) => this.cityService.getCities(s))
      ),
      (_, result) => ({
        cities: result.data.map(
          (x, i) =>
            ({
              index: ++i,
              id: x.id,
              name: x.name,
              status: x.status,
            } as CityListItem)
        ),
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.status = this.cityService.status;

    this.cityListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.cityListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.cityListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.search$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }
  @ViewChild('actionTemplate', { static: true })  public actionTemplate: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true })  public statusTemplate: TemplateRef<any>;
  initTable() {
    this.columns = [
      {
        prop: 'name',
        name: 'Tên thành phố',
        sortable: true,
        minWidth: 300,
      },
      {
        prop: 'status',
        maxWidth: 350,
        minWidth: 200,
        name: 'Trạng thái',
        sortable: true,
        canAutoResize: true,
        cellTemplate:this.statusTemplate
      },
      {
        prop: 'action',
        minWidth: 180,
        name: 'Thao tác',
        maxWidth: 150,
        canAutoResize: true,
        cellTemplate: this.actionTemplate,
      },
    ];
  }

  get cities$(): Observable<CityListItem[]> {
    return this.cityListState.select('cities');
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.cityListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.cityListState.select('loading');
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

  showAddCity() {
    const bsModalRef = this.modalService.show(CityModalComponent, {
      initialState: {
        simpleForm: false,
        title: 'thành phố',
        type: 'Thêm',
        id:'0',
      },
    });
    bsModalRef.onHide
      ?.pipe(
        take(1),
        filter((s) => (s as any).success)
      )
      .subscribe({
        next: (result) => {
          const data = result as { id: string; name: string };
          console.log(data);
          
          if (Number(data.id) > 0 && data.name.length > 0) {
            this.toast.success('Tạo thành phố thành công!', {
              duration: 5000,
              dismissible: true,
            });
          }
          this.search$.next({
            ...this.search$.getValue(),
          });
        }
      });
  }
  onUpdateStatus(id: string, status:string) {
    const bsModalRef = this.modalService.show(DeleteModalComponent, {
      initialState: {
        id: id,
        title: 'thành phố',
        status: status
      },
    });
    bsModalRef.onHide?.pipe(take(1),filter((s)=>(s as any).data)).subscribe({
      next: (result) => {
        this.search$.next({
          ...this.search$.getValue(),
        });
      },
    });
  }

  onUpdate(id: string) {
    const bsModalRef = this.modalService.show(CityModalComponent, {
      initialState: {
        id: id,
        title: 'thành phố',
        type: 'Cập nhật',
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
            this.toast.success('Cập nhật thành phố thành công!');
            this.search$.next({
              ...this.search$.getValue(),
            });
          }
        },
      });
  }
}
