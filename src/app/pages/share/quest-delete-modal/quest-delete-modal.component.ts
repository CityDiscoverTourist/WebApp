import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { tap } from 'rxjs';
import { QuestService } from 'src/app/services';

@Component({
  selector: 'app-quest-delete-modal',
  templateUrl: './quest-delete-modal.component.html',
  styleUrls: ['./quest-delete-modal.component.scss'],
})
export class QuestDeleteModalComponent implements OnInit {
  constructor(
    public bsModalRef: BsModalRef,
    private questService: QuestService,
    private router: Router,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {}
  deleteQuest(id: string) {
    this.bsModalRef.hide();
    this.questService.deleteQuestById(id).subscribe((data) => {
      this.bsModalRef.onHide?.emit({
        status: data,
      });
      this.bsModalRef.hide();
      this.toast.success('Xóa quest thành công');
      this.router.navigate(['admin/quest']);
    });
  }
  id = '';
}
