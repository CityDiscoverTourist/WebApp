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
  tap
} from 'rxjs';
import { IdValue, QuestItemCreate, QuestItemType } from 'src/app/models';
import { LocationService, QuestItemService } from 'src/app/services';
import { QuestItemState, QUEST_ITEM_STATE } from '../states';

interface QuestItemCreateState {
  showQuestDescription: boolean;
  showStory: boolean;
  showTypeQuestsion: boolean;
  image: File[];
  error?: string;
  submitting: boolean;
  files: File[];
}

@Component({
  selector: 'app-quest-item-create',
  templateUrl: './quest-item-create.component.html',
  styleUrls: ['./quest-item-create.component.scss'],
})
export class QuestItemCreateComponent implements OnInit {
  public href: string = '';
 status: { id: string; value: string }[] = [];
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
      image: [],
      showTypeQuestsion: false,
      showStory: false,
      files: [],
    });
  }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, curr) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));
    this.state.connect(this.toggleStory$, (prev, curr) => ({
      showStory: !prev.showStory,
    }));

    this.state.connect(
      this.selectedFileImageDescription$
        .pipe(tap(() => setTimeout(() => this.cd.detectChanges(), 100)))
        .pipe(tap((file) => this.form.patchValue({ imageDescription: file[0] }))),
      (_prev, files) => ({ files: [...files] })
    );

    this.state.connect(
      this.removedImageDescription$.pipe(
        tap(() => setTimeout(() => this.cd.markForCheck(), 100))
      ),
      (prev, curr) => {
        prev.files.splice(prev.files.indexOf(curr), 1);
        return {
          files: prev.files,
        };
      }
    );

    this.state.connect(this.toggleIsType$, (prev, curr) => {
      var check = false;
      if (curr == 2 && !prev.showTypeQuestsion) {
        check = true;
      } else {
        check = false;
      }
      return {
        showTypeQuestsion: check,
      };
    });

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
            
            var story = form.controls['story'].value + ' ';
            var arrStory = story.split('|');
            if (arrStory.length == 1) {
              story = arrStory[0] + '()' + arrStory[0];
            } else {
              story = arrStory[0] + '()' + arrStory[1];
            }
            form.value['story'] = story;

            var description = form.controls['description'].value + ' ';
            var arrDescription = description.split('|');
            if (arrDescription.length == 1) {
              description = arrDescription[0] + '()' + arrDescription[0];
            } else {
              description = arrDescription[0] + '()' + arrDescription[1];
            }
            form.value['description'] = description;

            var checkTypeAnswerImageText=form.controls['questItemTypeId'].value + ' ';

            if(Number(checkTypeAnswerImageText)==2){
              form.value['rightAnswer'] = '';
            }else{
              var rightAnswer = form.controls['rightAnswer'].value + ' ';
            var arrRightAnswer = rightAnswer.split('|');
            if (arrRightAnswer.length == 1) {
              rightAnswer = arrRightAnswer[0] + '()' + arrRightAnswer[0];
            } else {
              rightAnswer = arrRightAnswer[0] + '()' + arrRightAnswer[1];
            }
            form.value['rightAnswer'] = rightAnswer;
            form.value['answerImageUrl'] = '';  
            }
            return form;
          })
        ),
        switchMap(({ form, redirect }) =>
          this.questItemService
            .addQuestItem(form.value as QuestItemCreate)
            .pipe(
              catchError(() => {
                this.toast.error('Có lỗi hãy kiểm tra lại!');
                return of({ status: 'data not modified', data: null });
              }),
              map((r) => ({ ...r, redirect }))
            )
        ),
        tap((result) => {
          if (!result.data?.id) {
            return;
          }
          this.toast.success(`Thêm câu hỏi thành công!`);
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
      this.toast.error('Giá trị nhập không hợp lệ!');
      form.revalidateControls([]);
    });
    this.state.connect(
      this.selectedFile$
        .pipe(tap(() => setTimeout(() => this.cd.detectChanges(), 100)))
        .pipe(tap((file) => this.form.patchValue({ image: file }))),
      (prev, curr) => ({
        image: [...prev.image, ...curr],
      })
    );

    this.state.connect(
      this.removedFiles$.pipe(
        tap(() => setTimeout(() => this.cd.markForCheck(), 100))
      ),
      (prev, curr) => {
        prev.image.splice(prev.image.indexOf(curr), 1);
        return {
          image: prev.image,
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
      story:[''],
      duration: [0],
      createdDate: [],
      updatedDate: [],
      qrCode: [''],
      triggerMode: [0],
      rightAnswer: [''],
      answerImageUrl: [],
      status: ['', Validators.required],
      questItemTypeId: [1, Validators.required],
      locationId: ['', Validators.required],
      questId: [],
      itemId: [0],
      image: [],
      imageDescription:[]
    });
  }
  toggleDescription$ = new Subject<void>();
  toggleStory$ = new Subject<void>();
  toggleIsType$ = new Subject<number>();
  get vm$(): Observable<QuestItemCreateState> {
    return this.state.select();
  }
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();

  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();

  selectedFileImageDescription$ = new Subject<File[]>();
  removedImageDescription$ = new Subject<File>();

  showAddLocation() {
    this.router.navigate(['../../../../location/create', 'redirect'], {
      relativeTo: this.activatedRoute,
    });
  }

  contentTooltip: string = '';
  changeTooltip(id: number) {
    if(id==1){
      this.contentTooltip="Tạo câu hỏi";
    }else if(id==2){
      this.contentTooltip="Tạo câu hỏi so sánh hình ảnh";
    }else if(id==3){
      this.contentTooltip="Tạo câu hỏi nghịch đảo";
    }
  }
  
  public get submitting$(): Observable<boolean> {
    return this.state.select('submitting');
  }
}
