import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { QuestListItem } from 'src/app/models';
import { QuestService } from 'src/app/services';
import { QuestDeleteModalComponent } from '../../share/quest-delete-modal/quest-delete-modal.component';

@Component({
  selector: 'app-quest-detail',
  templateUrl: './quest-detail.component.html',
  styleUrls: ['./quest-detail.component.scss'],
})
export class QuestDetailComponent implements OnInit {
  private id: string;
  public questListItem:QuestListItem;
  constructor(
    private route: ActivatedRoute,
    private questService: QuestService,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get('id');
    this.id = this.route.snapshot.params['id'];
    // console.log(this.id);
    this.questService.getQuestById(this.id).subscribe((data) => {
     this.questListItem=data;
     console.log(data);
    });
  }

  showDeleteQuest() {
    const bsModalRef = this.modalService.show(QuestDeleteModalComponent,{
      initialState: {
        id: this.id,
      },
    });

    // bsModalRef.onHide?.pipe(take(1)).subscribe({
    //   next: (result) => {
    //     const questypeIds = result as { id: number; name: string };
    //     this.questypeIds$.next({ id: questypeIds.id, name: questypeIds.name });
    //   },
    // });
  }

  editQuest(){
    this.router.navigate(['admin/quest/edit'],{queryParams:{id:this.id}});
  }
}
