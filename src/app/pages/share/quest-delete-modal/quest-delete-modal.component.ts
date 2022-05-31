import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}
  // submit$ = new Subject<void>();

  deleteQuest(id: string) {
    console.log('tesssst');
    console.log(id);
    this.bsModalRef.hide();
    this.questService.deleteQuestById(id).subscribe((data) => {
      this.bsModalRef.onHide?.emit({
        status: data,
      });
      this.bsModalRef.hide();
      // this.router.navigate(['admin/quest'], {
      //   relativeTo: this.activatedRoute,
      // });
      
      this.router.navigate(['admin/quest']);
    });
  }

  id = '';
}
