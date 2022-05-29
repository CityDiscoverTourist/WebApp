import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, Observable, partition, Subject, switchMap, tap } from 'rxjs';
import { AreaData } from 'src/app/models';
import { AreaService } from 'src/app/services/area.service';


interface AreaEditState {
  showAreaDescription: boolean;
  files: File[];
  error?: string;
  submitting: boolean;
}

@Component({
  selector: 'app-area-edit',
  templateUrl: './area-edit.component.html',
  styleUrls: ['./area-edit.component.scss'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaEditComponent implements OnInit {
  constructor(
    private state: RxState<AreaEditState>,
    private cd:ChangeDetectorRef,
    private fb:FormBuilder, private toast:HotToastService,
    private areaService:AreaService,
    private modalService:BsModalService,
    ) {
    this.state.set({
      showAreaDescription: false,
      files: [],
    });
  }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, curr) => ({
      showAreaDescription: !prev.showAreaDescription,
    }));
    this.state.connect(
      this.selectedFile$.pipe(tap(() => setTimeout(()=>this.cd.detectChanges(),100))),
      (prev, files) => ({
        files: [...prev.files, ...files],
      })
    );

    this.state.connect(
      this.removedFiles$.pipe(tap(()=>setTimeout(()=>this.cd.markForCheck(),100))),
      (prev, curr) => {
       prev.files.splice(prev.files.indexOf(curr), 1);
        return {
          files: prev.files
        };
      }
    );
      this.initForm();

      this.state.connect(
        this.formSubmit$.pipe(
          switchMap((f) =>
            this.areaService.addArea(f.value as AreaData)
          )
        ),
        (prev, curr) => ({
          error: undefined,
        })
      );

      const [valid$, invalid$] = partition(
        this.submit$,
        ({ form }) => form.valid
      );
      this.state.connect(
        valid$.pipe(
          tap(() => this.state.set({ submitting: true })),
          switchMap(({ form, redirect }) =>
            this.areaService.addArea(form.value as AreaData)
          ),
        
        ),
        (prev, curr) => ({
          // error: undefined,
          // error: curr.statusCode,
          submitting: false,
        })
      );
  
      // this.state.hold(invalid$.pipe(), (form) => {
      this.state.hold(invalid$.pipe(), ({form}) => {
        this.toast.error(`Invalid form. Please recheck and try again!`);
      });
    
  }
  toggleDescription$ = new Subject<void>();
  get vm$(): Observable<AreaEditState> {
    return this.state.select();
  }

  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();

  form!:FormGroup;

  submitForm(){
    const valid=this.form.valid;
    console.log(`form valid state =${valid}`,this.form.value,this.form.errors);
    
    if(valid){
      this.areaSaved$.next(this.form.value);
    }else{
      this.toast.error(`Invalid form`);
    }
  }
  initForm(){
    this.form=this.fb.group({
      name:['',[Validators.required]],
      status:[],
      city:[],
    });
  }
  areaSaved$=new Subject<AreaData>();

  showAddCity(){
    
  }
  formSubmit$ = new Subject<FormGroup>();
  submit$ = new Subject<{ form: FormGroup; redirect: boolean }>();
}
