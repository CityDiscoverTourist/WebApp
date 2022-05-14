import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quest-type',
  templateUrl: './quest-type.component.html',
  styleUrls: ['./quest-type.component.scss']
})
export class QuestTypeComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart:any;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  ngOnInit() {
  }
}
