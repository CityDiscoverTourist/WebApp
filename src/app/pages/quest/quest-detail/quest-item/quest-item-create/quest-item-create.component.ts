import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  catchError,
  map,
  Observable,
  of,
  partition,
  pipe,
  Subject,
  switchMap,
  tap,
  take,
  filter,
} from 'rxjs';
import { IdValue, QuestItemCreate, QuestItemType } from 'src/app/models';
import { LocationCreateComponent } from 'src/app/pages/location/location-create/location-create.component';
import { LocationService, QuestItemService } from 'src/app/services';
import { QuestItemState, QUEST_ITEM_STATE } from '../states';

interface QuestItemCreateState {
  showQuestDescription: boolean;
  files: File[];
  error?: string;
  submitting: boolean;
  value: number;
}

@Component({
  selector: 'app-quest-item-create',
  templateUrl: './quest-item-create.component.html',
  styleUrls: ['./quest-item-create.component.scss'],
})
export class QuestItemCreateComponent implements OnInit {
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
    private modalService: BsModalService,
    private locationService: LocationService
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
    this.state.connect(this.toggleGuide$, (prev, curr) => {
      console.log(prev);
      console.log(curr);

      return {
        value: curr,
      };
    });
    // this.state.connect(this.toggleGuide$, (prev, curr) => ({
    //   value: curr,
    // }));
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

    this.questItemState.connect(
      this.locationService.locationAdded$.pipe(
        tap((location) => {
          this.form.get('locationId')?.setValue(location.id);
        })
      ),
      (prev, curr) => ({
        locationIds: [...prev.locationIds, { id: curr.id, value: curr.name }],
      })
    );
  }

  get locationIds(): Observable<IdValue[]> {
    return this.questItemState.select('locationIds');
  }
  get questItemTypeIds(): Observable<QuestItemType[]> {
    return this.questItemState
      .select('questItemTypeIds')
      .pipe(map((data) => data.filter((x) => x.status == 'Active')));
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
      status: [],
      questItemTypeId: [1, Validators.required],
      locationId: ['', Validators.required],
      questId: [],
      itemId: [0],
    });
  }
  toggleDescription$ = new Subject<void>();
  toggleGuide$ = new Subject<number>();
  get vm$(): Observable<QuestItemCreateState> {
    return this.state.select();
  }
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();

  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();

  showAddLocation() {
    this.router.navigate(['../../../../location/create', 'redirect'], {
      relativeTo: this.activatedRoute,
    });
  }
}
