import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { MessageConstants } from 'src/app/contants/messages.constant';
import { City, Pagination } from 'src/app/models';
import { NotificationService } from 'src/app/services';
import { CityService } from 'src/app/services/city.service';
import { CityDetailComponent } from '../city-detail/city-detail.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
})
export class CityListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  // Default
  public bsModalRef: BsModalRef;
  public blockedPanel = false;
  /**
   * Paging
   */
   public pageIndex = 1;
  public pageSize = 10;
  public pageDisplay = 10;
  public totalRecords: number;
  public keyword = '';
  // Role
  public items: City[];
  public selectedItems: City[];
  constructor(
    private cityService: CityService,
    private notificationService: NotificationService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(selectedId = null) {
    this.blockedPanel = true;
    this.subscription.add(
    this.cityService.getAllPaging('', 1, 10, 'name').subscribe({
      next: (response:  Pagination<City>) => {
        this.processLoadData(selectedId, response);
        setTimeout(() => {
          this.blockedPanel = false;
        }, 1000);
      },
      error: () =>
        setTimeout(() => {
          this.blockedPanel = false;
        }, 1000),
      complete: () => console.info('complete'),
    })
    );
  }

  private processLoadData(selectedId = null, response: Pagination<City>) {
    this.items = response.data;
    this.pageIndex = this.pageIndex;
    this.pageSize = this.pageSize;
    // console.log("faaa ",response.paginations[0] +"ddddddddd" );
    
    this.totalRecords = 2;
    if (this.selectedItems?.length === 0 && this.items.length > 0) {
      this.selectedItems.push(this.items[0]);
    }
    if (selectedId != null && this.items.length > 0) {
      this.selectedItems = this.items.filter((x) => x.id === selectedId);
    }
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }

  showAddModal() {
    this.bsModalRef = this.modalService.show(CityDetailComponent, {
      class: 'modal-lg',
      backdrop: 'static',
    });
    this.bsModalRef.content.savedEvent.subscribe((response: any) => {
      this.bsModalRef.hide();
      this.loadData();
      this.selectedItems = [];
    });
  }
  showEditModal() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(
        MessageConstants.NOT_CHOOSE_ANY_RECORD
      );
      return;
    }
    const initialState = {
      entityId: this.selectedItems[0].id,
    };
    this.bsModalRef = this.modalService.show(CityDetailComponent, {
      initialState: initialState,
      class: 'modal-lg',
      backdrop: 'static',
    });

    this.subscription.add(
      this.bsModalRef.content.savedEvent.subscribe(
        (response: { id: null | undefined }) => {
          this.bsModalRef.hide();
          this.loadData(response.id);
        }
      )
    );
  }

  deleteItems() {
    const id = this.selectedItems[0].id;
    this.notificationService.showConfirmation(
      MessageConstants.CONFIRM_DELETE_MSG,
      () => this.deleteItemsConfirm(id)
    );
  }
  deleteItemsConfirm(id: string) {
    this.blockedPanel = true;
    this.subscription.add(
      this.cityService.delete(id).subscribe(
        () => {
          this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
          this.loadData();
          this.selectedItems = [];
          setTimeout(() => {
            this.blockedPanel = false;
          }, 1000);
        },
        (error) => {
          setTimeout(() => {
            this.blockedPanel = false;
          }, 1000);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
