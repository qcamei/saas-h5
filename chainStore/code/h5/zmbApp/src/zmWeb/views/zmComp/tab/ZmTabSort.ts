import {Component, OnInit, Input,  Output, EventEmitter} from "@angular/core";
import {SortEnum} from "../../../comModule/enum/SortEnum";

/**
 <zm-tab-sort [tabList]="viewData.sortTabList" [(zmValue)]="viewData.selectedSortType" (onChange)="switchSortTab()"></zm-tab-sort>
 */
@Component({
  selector:'zm-tab-sort',
  template: `

        <div  fxLayout="row" fxLayoutAlign="start center" style="background:#f4f4f4;padding:6px 10px 7px 10px;">
              <div overflow-hidden-1 text-center  fxLayout="row" fxLayoutGap="3px" fxLayoutAlign="center center" fxFlex="1 1" style="height: 25px;line-height: 25px;" *ngFor="let tabItem of tabList;" [class.active]="zmValue.value == tabItem.value" 
               (click)="switchTab(tabItem)">
               <span>{{tabItem.name}}</span>
               <zm-btn-updown *ngIf="zmValue.value == tabItem.value" [active]="tabItem.sort"></zm-btn-updown>
              </div>
        </div>
                    
            `,
  styles:[`
            .active{
                color:#4678FA;
            }
            `]
})


export class ZmTabSort implements OnInit {
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
    this.zmValueChange.emit(this.zmValueTmp);
  }

  constructor(){ }

  ngOnInit():void {

  }

  switchTab(tabItem){
    if(this.zmValue == tabItem){
      this.toogleSort(tabItem);
    }
    this.zmValue = tabItem;
    this.onChange.emit();
  }

  toogleSort(tabItem){
    if(tabItem.sort == SortEnum.ASE){
      tabItem.sort = SortEnum.DESC;
    }else{
      tabItem.sort = SortEnum.ASE;
    }
  }

}



