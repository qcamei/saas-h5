import {
  Component, OnInit, OnDestroy, Input, TemplateRef, EventEmitter, Output, ViewEncapsulation,
} from "@angular/core";

/**
 <ng-template #theadTemplate>
     <th style="width:30%">姓名</th>
     <th style="width:50%">手机号</th>
 </ng-template>

 <ng-template #tbodyTemplate let-item="item">
     <td style="width:30%">{{item.name}}</td>
     <td style="width:50%">{{item.phone}}</td>
 </ng-template>

 <zm_table_detail_select_single [itemList]="data.leaguerListShow" (onSelected) = "selectLeaguer($event)"  [tbodyTemplate]="tbodyTemplate"  [theadTemplate]="theadTemplate" >
 </zm_table_detail_select_single>

 *
 */


@Component({
  selector:'zm_table_detail_select_single',
  template: `
      
                <table class="zmTable">
                    <thead>
                    <tr>
                        <th style="width:50px;">序号</th>
                        <ng-container *ngTemplateOutlet="theadTemplate;"></ng-container>
                    </tr>
                    </thead>
                    <tbody fusePerfectScrollbar>
                        <tr class="pos-r" *ngFor="let item of viewData.itemWraperList;" (click)="onClick(item)" [class.itemActiveClass]="item.hover || item.selected">
                            <div class="maskHover pos-a" (mouseenter)="onHover(item)"></div>
                            <td style="width:50px;"><span *ngIf="! item.selected">{{item.index+1}}</span><img src="assets/images/selectItem.png" *ngIf="item.selected" ></td>
                            <ng-container *ngTemplateOutlet="tbodyTemplate;context:item"></ng-container>
                        </tr>
                        
                    <div *ngIf="viewData.itemWraperList.length==0" style=" height:50px;text-align: center">没有数据</div>
                    </tbody>
                </table>
            `,
  styleUrls:['./table.scss'],
  encapsulation: ViewEncapsulation.Native,
})
export class ZmTableSelectSingle implements OnInit,OnDestroy {

  @Input() checkAttr:string = "checked";
  @Output() onSelected:EventEmitter<any> = new EventEmitter();

  @Input() tbodyTemplate: TemplateRef<any>;
  @Input() theadTemplate: TemplateRef<any>;

  public viewData:ZmTableSelectSingleViewData;

  @Input()
  get itemList() {
    return this.viewData.itemList;
  }
  set itemList(val:Array<any>) {
    this.viewData = ZmTableSelectSingleViewData.newInstance(val,this.checkAttr);
  }

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }

  onClick(item:any){
    this.viewData.onSelect(item);
    let itemTmp = this.viewData.getSelected();
    this.onSelected.emit(itemTmp);

  }


  onHover(item:any){
      this.viewData.onHover(item);

  }

}


class ItemWraper{

  public static newInstance(item:any,index:number,checkAttr:string):ItemWraper{
    let target:ItemWraper = new ItemWraper();
    target.item = item;
    target.index = index;
    target.checkAttr = checkAttr;
    target._selected = item[checkAttr];
    return target;
  }
  index:number = 0;
  item:any = null;
  hover:boolean = false;

  checkAttr:string = "checked";
  private _selected:boolean = false;

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
    this.item[this.checkAttr] = value;
  }
}

class ZmTableSelectSingleViewData{

  constructor(){
  }

  public static newInstance(itemList:Array<any>,checkAttr:string):ZmTableSelectSingleViewData{
    let target:ZmTableSelectSingleViewData = new ZmTableSelectSingleViewData();
    let itemListTmp:Array<ItemWraper> = new Array<ItemWraper>();

    let index=0;
    for (let itemTmp of itemList) {
      itemListTmp.push(ItemWraper.newInstance(itemTmp,index,checkAttr));
      index++;
    }
    target.itemWraperList = itemListTmp;
    target.itemList = itemList;
    return target;
  }

  itemWraperList:Array<ItemWraper>;

  itemList:Array<any>;

  public onHover(item){
    for (let itemTmp of this.itemWraperList) {
        itemTmp.hover =(itemTmp == item);
    }
  }

  public onSelect(item){
    for (let itemTmp of this.itemWraperList) {
      itemTmp.selected =(itemTmp == item);
    }
  }

  public getSelected():any{
    let target:ItemWraper = null;
    for (let itemTmp of this.itemWraperList) {
      if(itemTmp.selected ){
        target = itemTmp;
        break;
      }
    }
    return target!=null?target.item:null;
  }
}


