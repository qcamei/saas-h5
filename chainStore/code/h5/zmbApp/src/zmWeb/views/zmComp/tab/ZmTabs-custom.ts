
import {Component, OnInit, Input,  Output, EventEmitter} from "@angular/core";

/**
 <zm-tabs-custom [tabList]="[{name:'待接单',value:0},{name:'待服务',value:1},{name:'已取消',value:2},{name:'已完成',value:3}]" [(zmValue)]="viewData.selectedTab" (onChange)="switchTab()"></zm-tabs-custom>
 */
@Component({
  selector:'zm-tabs-custom',
  template: `

    <div  fxLayout="row" fxLayoutAlign="start center" style="background:#fff;padding:10px 10px 2px 10px;">
      <div overflow-hidden-1 text-center fxFlex="1 1" style="height: 35px;line-height: 35px;" *ngFor="let tabItem of tabList;" [class.active]="isActive == tabItem.value"
           (click)="switchTab(tabItem)">{{tabItem.name}}
      </div>
    </div>

  `,
  styles:[`
    .active{
      border-bottom:1px solid #4678FA;
      color:#4678FA;
    }
  `]
})


export class ZmTabsCustom implements OnInit {

  isActive:number = 0;
  @Input() tabList:Array<any>;
  @Output() zmValueChange = new EventEmitter();
  @Output() onChange = new EventEmitter();
  private zmValueTmp:any;

  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }

  set zmValue(val) {
    this.zmValueTmp = val;
    this.isActive = this.zmValueTmp.value;
    this.zmValueChange.emit(this.zmValueTmp);
  }

  constructor(){ }

  ngOnInit():void {

  }

  switchTab(tabItem){
    this.zmValue = tabItem;
    this.onChange.emit();
  }

}




