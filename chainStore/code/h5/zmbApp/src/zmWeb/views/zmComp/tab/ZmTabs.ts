
import {Component, OnInit, Input,  Output, EventEmitter} from "@angular/core";

/**
 <zm-tabs [tabList]="[{name:'待接单',value:0},{name:'待服务',value:1},{name:'已取消',value:2},{name:'已完成',value:3}]" [(zmValue)]="viewData.selectedTab" (onChange)="switchTab()"></zm-tabs>
 */
@Component({
  selector:'zm-tabs',
  template: `
        <div style="background:#fff;">
        <ion-segment ion-text [(ngModel)]="zmValue" mb-2 color="primary" tabindex="default">
              <ion-segment-button style="height: 35px;line-height: 35px;" [value]="tabItem" *ngFor="let tabItem of tabList" (ionSelect)="switchTab(tabItem)">
                {{tabItem.name}}
              </ion-segment-button>
        </ion-segment>
        </div>            
            `
})


export class ZmTabs implements OnInit {

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

  ngOnInit():void{
    // if(!this.zmValue && this.tabList){
    //   this.zmValue = this.tabList[0];
    // }
  }

  switchTab(item){
    this.zmValue = item;
    this.onChange.emit();
  }

}



