import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";

/**
 * 状态过滤tab
 * <zm-btn-tab [tabList]="[{name:'全部',value:''},{name:'待收款',value:'0'},{name:'已收款',value:'1'},{name:'退单',value:'3,4'}]" [activeValue]="'0'" (zmbtnClick)="switchTab($event)"></zm-btn-tab>
 */
@Component({
  selector:'zm-btn-tab',
  template: '<div><button *ngFor="let item of tabList" type="button" class="btn-Date" [class.itemActiveClass]="activeValue===item.value"  (click)="btn_Click(item)">{{item.name}}</button></div>',
  styles:[`    
    .btn-Date{
      display: inline-block;
      color: #999;
      background-color: #ddd;
      border: none;
      border-right: 1px solid #cccaca;
      height: 30px;
      padding: 0 10px;
      font-size: 14px;
      cursor: pointer;
      outline: none;;
      line-height:1.5;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      outline: none;
    }
    .btn-Date:first-child{
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
    .btn-Date:last-child{
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      border-right:none;
    }
    .itemActiveClass{
      color: #fff;
      background-color:#03a9f4;
    }
  `]
})
export class ZmBtnTab implements OnInit,OnDestroy {

  @Input() tabList:Array<any>;
  @Input() activeValue:any;
  @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  ngOnInit():void{
    if(!this.activeValue && this.tabList){
      this.activeValue = this.tabList[0].value;
    }
  }

  ngOnDestroy(): void {

  }

  btn_Click(item){
    this.activeValue = item.value;
    this.zmbtnClick.emit(item.value);
  }

}
