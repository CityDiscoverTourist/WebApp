import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Quest, QuestListItem } from 'src/app/models';
import { QuestService } from 'src/app/services';
import { QuestDeleteModalComponent } from '../../share/quest-delete-modal/quest-delete-modal.component';
import { QuestDetailState } from '../states/questdetail.state';

@Component({
  selector: 'app-quest-detail',
  templateUrl: './quest-detail.component.html',
  styleUrls: ['./quest-detail.component.scss'],
})
export class QuestDetailComponent implements OnInit {
  private id: string;
  public questListItem: QuestListItem;
  constructor(
    private route: ActivatedRoute,
    private questService: QuestService,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questDetailState: RxState<QuestDetailState>
  ) {}

  ngOnInit(): void {
    // // this.id = this.route.snapshot.paramMap.get('id');
    // this.id = this.route.snapshot.params['id'];
    // // console.log(this.id);
    // this.questService.getQuestById(this.id).subscribe((data) => {
    //  this.questListItem=data;
    // });
    this.search$.next({ id: this.route.snapshot.params['id'] });
    this.questDetailState.connect(
      this.search$
        .pipe(
          tap((_) => this.questDetailState.set({ loading: true })),
          switchMap((s) => this.questService.getQuestById(s.id))
        )
        .pipe(tap((data) => (this.id = data.id.toString()))),
      (_, result) => ({
        quest: result,
        loading: false,
      })
    );
  }

  showDeleteQuest() {
    const bsModalRef = this.modalService.show(QuestDeleteModalComponent, {
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

  editQuest() {
    // this.router.navigate(['admin/quest/edit'],{queryParams:{id:this.id}});
    this.router.navigate(
      ['admin/quest/edit', this.id]
      //  {
      //   relativeTo: this.activatedRoute,
      // }
    );
  }

  search$ = new BehaviorSubject<{ id: string }>({ id: '' });
  get quest$(): Observable<Quest> {
    return this.questDetailState.select('quest');
  }

  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
}
