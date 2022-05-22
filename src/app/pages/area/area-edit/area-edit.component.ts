import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable, pipe, Subject, tap } from 'rxjs';

interface ProductEditState {
  showProductDescription: boolean;
  files: File[];
}

@Component({
  selector: 'app-area-edit',
  templateUrl: './area-edit.component.html',
  styleUrls: ['./area-edit.component.scss'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaEditComponent implements OnInit {
  constructor(private state: RxState<ProductEditState>,private cd:ChangeDetectorRef) {
    this.state.set({
      showProductDescription: false,
      files: [],
    });
  }

  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, curr) => ({
      showProductDescription: !prev.showProductDescription,
    }));
    // this.state.connect(this.selectedFile$,(prev,files)=>({
    //   files:[...prev.files,...files]
    // }))

    // this.state.connect(
    //   this.selectedFile$.pipe(tap((x) => console.log(x))),
    //   (prev, files) => ({
    //     files: [...prev.files, ...files],
    //   })
    // );

    // this.state.hold(
    //   this.selectedFile$,
    //     files=>{
    //       this.state.set({
    //         files:[...this.state.get("files"),...files]
    //       });
    //       setTimeout(()=>this.cd.detectChanges(),100);
    //   }
    // )

    this.state.connect(
      this.selectedFile$.pipe(tap(() => setTimeout(()=>this.cd.detectChanges(),100))),
      (prev, files) => ({
        files: [...prev.files, ...files],
      })
    );

    // this.state.connect(
    //   this.removedFiles$.pipe(tap((x) => console.log(`remove file ,`, x))),
    //   (prev, curr) => {
    //     const files=prev.files.splice(prev.files.indexOf(curr), 1);
    //     return {
    //       // files: prev.files,
    //       files: files
    //     };
    //   }
    // );

    this.state.connect(
      this.removedFiles$.pipe(tap(()=>setTimeout(()=>this.cd.markForCheck(),100))),
      (prev, curr) => {
       prev.files.splice(prev.files.indexOf(curr), 1);
        return {
          // files: prev.files,
          files: prev.files
        };
      }
    );

  }
  toggleDescription$ = new Subject<void>();
  get vm$(): Observable<ProductEditState> {
    return this.state.select();
  }

  // files: File[] = [];

  // onSelect(event:any) {
  // 	console.log(event);
  // 	this.files.push(...event.addedFiles);
  // }

  onRemove(event: any) {
    console.log(event);
    // this.files.splice(this.files.indexOf(event), 1);
  }
  selectedFile$ = new Subject<File[]>();
  removedFiles$ = new Subject<File>();
}
