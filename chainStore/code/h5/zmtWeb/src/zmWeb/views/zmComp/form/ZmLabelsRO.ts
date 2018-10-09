import {OnInit, Component, Input} from "@angular/core";


@Component({
  selector:"zm-labels-ro",
  template:`
    
        <mat-label>{{label}}</mat-label>
        <mat-chip-list >
          <mat-chip *ngFor="let valueTmp of zmValue" [selectable]="false" [removable]="false">
            {{valueTmp}}
          </mat-chip>
        </mat-chip-list>

  `,
  styles:[`
  `]
})
export class ZmLabelsRO implements OnInit{

  visible: boolean = true;

  @Input() label:string="标签";
  @Input() zmValue = [];

  constructor() {}
  ngOnInit(){
  }

}


