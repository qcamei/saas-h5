import {Component, ElementRef, ViewChild, Input, Output, EventEmitter, OnInit, OnChanges} from "@angular/core";
import {MatSlideToggleChange} from "@angular/material";

@Component({
  selector:'switch-button-comp',
  template:
    ` 

    <div fxLayout="row" >
       <mat-label style="color: #bcbcbc;margin-right: 20px; font-size: 16px;font-weight: 400;"> {{label}}</mat-label>
       <mat-slide-toggle color="primary"
               [checked]="state"
              [disabled]="disabled"
               (change) = "onChange($event)">
          </mat-slide-toggle>
    </div>
	
   `,
  styles:[
    `
  
   `
  ]
})
export class SwitchButton{

  @Input() label:string;
  @Input() disabled:boolean = false;
  @Output() stateChange = new EventEmitter();

  private stateTmp:boolean = true;
  @Input()
  get state(): boolean {
    return this.stateTmp;
  }

  set state(value: boolean) {
    this.stateTmp = value;
    this.stateChange.emit(value);
  }

  onChange(event:MatSlideToggleChange){
    this.state = event.checked;
  }

}
