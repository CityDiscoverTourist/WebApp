import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  filter,
  Observable,
  partition,
  Subject,
  switchMap,
  tap,
  take,
  pipe,
  catchError,
  map,
  of,
} from 'rxjs';
import { QuestItemType } from 'src/app/common/enums';
import { IdValue, QuestItemCreate } from 'src/app/models';
import { LocationModalComponent } from 'src/app/pages/share';
import { QuestItemService } from 'src/app/services';
import { QuestItemState, QUEST_ITEM_STATE } from '../states';

interface QuestItemCreateState {
  showQuestDescription: boolean;
  files: File[];
  error?: string;
  submitting: boolean;
}

@Component({
  selector: 'app-quest-item-create',
  templateUrl: './quest-item-create.component.html',
  styleUrls: ['./quest-item-create.component.scss'],
})
export class QuestItemCreateComponent implements OnInit {
  private id: string;
  public href: string = '';
  status: { id: number; value: string }[] = [];
  constructor(
    @Inject(QUEST_ITEM_STATE) private questItemState: RxState<QuestItemState>,
    private fb: FormBuilder,
    private state: RxState<QuestItemCreateState>,
    private questItemService: QuestItemService,
    private toast: HotToastService,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.state.set({
      showQuestDescription: false,
      files: [],
    });
  }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, curr) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));
    this.initForm();
    this.status = this.questItemService.status;
    this.href = this.router.url;
    var questId = this.href.match(/([\d]+)/g)?.[0];
    this.form.controls['questId'].setValue(questId);

    const [valid$, invalid$] = partition(
      this.submit$,
      ({ form }) => form.valid
    );

    this.state.connect(
      valid$.pipe(
        tap(() => this.state.set({ submitting: true })),
        pipe(
          tap(({ form }) => {
            var content = form.controls['content'].value + ' ';
            var arrName = content.split('|');
            if (arrName.length == 1) {
              content = arrName[0] + '()' + arrName[0];
            } else {
              content = arrName[0] + '()' + arrName[1];
            }
            form.value['content'] = content;
            var description = form.controls['description'].value + '';
            var arrDescription = description.split('|');
            if (arrDescription.length == 1 && description != null) {
              description = arrDescription[0] + '()' + arrDescription[0];
            } else {
              description = arrDescription[0] + '()' + arrDescription[1];
            }
            form.value['description'] = description;
            return form;
          })
        ),
        switchMap(({ form, redirect }) =>
          this.questItemService
            .addQuestItem(form.value as QuestItemCreate)
            .pipe(
              catchError(() => of({ status: 'data not modified', data: null })),
              map((r) => ({ ...r, redirect }))
            )
        ),
        tap((result) => {
          if (!result.data?.id) {
            return;
          }
          this.toast.success(`Tạo quest item thành công`);
          if (result.redirect) {
            this.router.navigate(['../../'], {
              relativeTo: this.activatedRoute,
            });
          } else {
            this.form.reset();
            this.initForm();
          }
        })
      ),
      (_prev, curr) => ({
        error: undefined,
        submitting: false,
      })
    );

    this.state.hold(invalid$.pipe(), ({ form }) => {
      this.toast.error('Giá trị bạn nhập không hợp lệ');
      form.revalidateControls([]);
    });
    this.state.connect(
      this.selectedFile$
        .pipe(tap(() => setTimeout(() => this.cd.detectChanges(), 100)))
        .pipe(tap((file) => this.form.patchValue({ image: file[0] }))),
      (_prev, files) => ({ files: [...files] })
    );

    this.state.connect(
      this.removedFiles$.pipe(
        tap(() => setTimeout(() => this.cd.markForCheck(), 100))
      ),
      (prev, curr) => {
        prev.files.splice(prev.files.indexOf(curr), 1);
        return {
          files: prev.files,
        };
      }
    );
  }

  get locationIds(): Observable<IdValue[]> {
    return this.questItemState.select('locationIds');
  }
  get questItemTypeIds(): Observable<IdValue[]> {
    return this.questItemState.select('questItemTypeIds');
  }
  form!: FormGroup;

  initForm() {
    this.form = this.fb.group({
      id: [0],
      content: ['', Validators.required],
      description: [''],
      duration: [0],
      createdDate: [],
      updatedDate: [],
      qrCode: [''],
      triggerMode: [0],
      rightAnswer: ['', Validators.required],
      answerImageUrl: [],
      status: [false],
      questItemTypeId: [QuestItemType.QuestionandAnswer],
      locationId: ['', Validators.required],
      questId: [],
      itemId: [0],
    });
  }
  toggleDescription$ = new Subject<void>();
  get vm$(): Observable<QuestItemCreateState> {
    return this.state.select();
  }
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();

  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();

  // showAddLocation() {
  //   const bsModalRef = this.modalService.show(LocationModalComponent, {
  //     initialState: {
  //       simpleForm: false,
  //       title: 'địa điêmr',
  //       type: 'Thêm',
  //     },
  //   });
  //   bsModalRef.onHide
  //     ?.pipe(
  //       take(1),
  //       filter((s) => (s as any).success)
  //     )
  //     .subscribe({
  //       next: (result) => {
  //         const data = result as { id: number; name: string };
  //         const areaAdded = result as { id: number; name: string };
  // this.areaAdded$.next({
  //   id: areaAdded.id,
  //   name: areaAdded.name,
  // });
  // if (data.id > 0 && data.name.length > 0) {
  //   this.toast.success('Tạo khu vực thành công!');
  // }
  //       },
  //     });
  // }
}
