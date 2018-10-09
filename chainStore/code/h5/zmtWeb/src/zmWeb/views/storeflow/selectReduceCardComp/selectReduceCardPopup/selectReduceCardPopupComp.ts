import {Component, OnInit, OnDestroy, Input, Output, Inject} from "@angular/core";

import {SelectReduceCardViewData, ReduceCardItem} from "../selectReduceCardComp";
import {AppUtils} from "../../../../comModule/AppUtils";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 选择划卡组件
 */
@Component({
    selector:'select-reduce-card-popup',
    template:`
      <div animation-modal>
        <div mat-dialog-title>
          <h4 class="modal-title fz-16 font-bold">选择划卡</h4>
        </div>
    <mat-dialog-content>
        <div class="disFlex align-center" style="white-space:nowrap;">
          <zm-search-box [label]="'查询'" [placeholder]="'请输入编号/名称查询'" [(zmValue)]="queryParam" (callBack)="findReduce()"></zm-search-box>
          <div class="form-group">
           <label class="mg-b-0 mg-r-10 mg-l-20 fz-14 font-bold">分类</label>
            <select class="form-control set-bg cur-hand  c-hued" [(ngModel)]="itemType" (change)="findReduce()">
                <option [value]="-1">全部</option>
                <option [value]="0">项目</option>
                <option [value]="1">商品</option>
                <option [value]="2">套餐</option>
            </select>
          </div>
        </div>
        <table class="scrollTable table table-bordered mg-t-20">
            <thead>
                <th style="width:10%;">序号</th>
                <th style="width:15%;">编号</th>
                <th style="width:15%;">所属次卡</th>
                <th style="width:10%;">类型</th>
                <th style="width:30%;">名称</th>
                <th style="width:20%;">剩余数量</th>
            </thead>
            <tbody>
                <tr class="pos-r" *ngFor="let item of data.reduceCardListTmp;let i=index;" (click)="selectReduce(item)"  [class.itemActiveClass]="itemActiveIndex===i?'itemActive':''">
                <td style="border-left: none;width:10%;">
                    <span *ngIf="itemActiveIndex!==i">{{i+1}}</span>
                    <img src="assets/images/selectItem.png" *ngIf="itemActiveIndex===i">
                    <div class="maskHover pos-a" style="width: 100%;height: 80%;left: 0;top: 10%;" (mouseover)="itemActiveHover(i)" >&nbsp;</div>
                </td> 
                    <td style="width:15%; ">{{item.number}}</td> 
                    <td style="width:15%; ">{{item.cardName}}</td> 
                    <td style="width:10%; ">{{item.itemType | reduceCardItemTypePipe}}</td> 
                    <td style="width:30%; ">{{item.name}}</td> 
                    <td style="width:20%;"> <span>{{item.restCount==-1?'无限':item.restCount}}/{{item.totalCount==-1?'无限':item.totalCount}}</span></td>
                </tr>
            </tbody>
        </table>   
    </mat-dialog-content>
    </div>
    `,
    styles:[` 
  .scrollTable{
    border:none;
  }
  .scrollTable tbody {
    display: block;
    height: 400px;
    overflow-y: auto;
  }
  .scrollTable thead {
    display: table;
    width: -moz-calc(100% - 10px);
    width: calc(100% - 10px);
    width: 100%;
    table-layout: fixed;
  }
  .scrollTable tr{
    display: table;
    width: 100%;
  }
  
  .scrollTable thead th{
    border-bottom: none;
  }
  .scrollTable tbody{
    height:340px;
    overflow-x:hidden;
    overflow-y:auto;
    border:1px solid #e9ecef;
  }
  .scrollTable tbody tr:last-child{
    border-bottom:none ;
  }
  .scrollTable tbody tr td{
    word-break: break-all;
    word-wrap:break-word;
  }
  .scrollTable tr td:first-child{
    border-left: none;
  }
  .scrollTable tr td:last-child{
    border-right: none;
  }
  

  tbody::-webkit-scrollbar{
    display: none;
  } 
  tbody{
      -ms-overflow-style: none;
  }
  .table {
    font-size: 14px;
    text-align: center;
    margin-bottom: 0 !important;
  }
  .table thead th {
    font-weight: bold;
    background-color: #f4f6fa !important;
  }
  .table tbody tr{
    margin-top: -1px;
  }
  .table tbody tr:nth-of-type(odd){
    background-color: #ffffff;
  }
  .table tbody tr:nth-of-type(even),tbody tr:nth-of-type(even) input,tbody tr:nth-of-type(even) select{
    background-color:#f9fafc;
  }
  .table tbody .c-tr:hover{
    background-color: #e7f3fd;
  }
  .table a{cursor:pointer;}
  .table a:hover{text-decoration: none;color:#03a9f4 !important;}
  
  .table th, .table td{
    vertical-align: middle !important;
    font-size: 14px;
    word-wrap:break-word;
    word-break: break-all;
  }
  .table-bordered thead th{
    border-bottom-width: 1px !important;
  }
  select.form-control:not([size]):not([multiple]){
    -moz-appearance: none;
    -webkit-appearance: none;
    background-image:url(./assets/images/arrow.png);
    background-repeat: no-repeat;
    background-position:95% 50%;
    font-size: 14px;
    padding-right: 25px;
  }
  select.c-form-select:not([size]):not([multiple]){
    -moz-appearance: none;
    -webkit-appearance: none;
    background-image:url(./assets/images/arrow.png);
    background-repeat: no-repeat;
    background-position:95% 50%;
    font-size: 14px;
    padding-right: 25px;
  }
  select::-ms-expand { display: none; }

   
.pd-lr-15{
  padding-left:15px;
  padding-right:15px;
} 
.pd-tb-10{
  padding-top:10px;
  padding-bottom: 10px;
} 
.mg-b-0{
  margin-bottom:0;
} 
.mg-r-10{
  margin-right:10px;
} 
.mg-l-20{
  margin-left: 20px;
} 
.mg-t-20{
  margin-top:20px;
}
.mg-b-0 {
  margin-bottom:0;
}
.pd-r-10{
  padding-right: 10px;
}
.pd-l-10{
  padding-left:10px;
}
.fz-14{
  font-size: 14px;
} 
.font-bold{
  font-weight: bold;
} 
.set-bg{
  background-color:#F4F6FA !important;
}  
.c-hued{
  width: 100px;
} 
.modal-title{
  font-size: 18px;
  font-weight: bold !important;
  color: #333 !important;
} 
.fz-16{
  font-size: 16px;
} 
.font-bold{
  font-weight: bold;
} 
.disFlex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: -moz-box;
  display: flex;
}
.flex {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  -webkit-flex: 1;
     -moz-box-flex: 1;
          flex: 1;
}
.align-center {
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -moz-box-align: center;
  align-items: center;
}
.pos-r{
  position: relative;
} 
.pos-a{
  position: absolute;
} 
.fz-12{
  font-size: 12px;
} 
.font-c2{
  color: #bcc2c8;
} 
.text-right{
  text-align: right;
} 

.cancel-btn{
  background: #fff;
  border: 2px solid#03a9f4;
  color:#03a9f4;
  width: 168px;
  line-height: 48px;
  -moz-border-radius: 8px;
       border-radius: 8px;
  cursor: pointer;
}
.cancel-btn:focus {
    outline: none;
}

.confirm-btn {
  background:#03a9f4;
  border: 2px solid#03a9f4;
  color: #fff;
  width: 168px;
  line-height: 48px;
  -moz-border-radius: 8px;
       border-radius: 8px;
  cursor: pointer;
}
.confirm-btn:focus {
    outline: none;
}

.form-control {
  padding: 0 10px;
  height: 30px !important;
  display: inline-block;
  border-width: 1px;
}
.form-control:focus{border-width: 1px !important;}
.c-trou{
  border-width: 1px;
  width:80px;
}
.c-trou:focus{ border-width: 1px !important;}
.table {
    font-size: 14px;
  }
  .table thead th {
    white-space: nowrap;
    padding:5px 2px;
    box-sizing:border-box;
  }
  .table tbody tr td{
    padding:8px;
    font-size: 14px;
    box-sizing:border-box;
  }
  .scroll-table tr td:nth-child(1){
      width: 30%;
  }
  .scroll-table tr td:nth-child(2){
      width: 40%;
  }
 
  .close {
    outline: none;
  }
.scrollTable thead th{
  border-bottom: none;
}
.scrollTable tbody tr td{
  word-break: break-all;
  word-wrap:break-word;
}
.scrollTable tbody{
  height:340px;
  overflow-x:hidden;
  overflow-y:auto;
  border:1px solid #e9ecef;
}
.scrollTable tbody tr:last-child{
  border-bottom:none ;
}
.scrollTable tr td:first-child{
  border-left: none;
}
.scrollTable tr td:last-child{
  border-right: none;
}
.itemActiveClass{
  background:#03a9f4 !important;
  color:#fff;
  cursor: pointer;
}
.itemActiveClass td{
  border:none;
}
.icon-dir{
  position: absolute;
  right: 330px;
  top: 250px;
  width: 7px;
}
tbody::-webkit-scrollbar{
  display: none;
}

`]
})
export class SelectReduceCardPopup implements OnInit,OnDestroy{

  @Input() data:SelectReduceCardPopupViewData;
  @Output() action:any;

  public queryParam:string;
  public itemType:number = -1;
  public itemActiveIndex:number;

  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataInput:any,) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit(){

  }

  ngOnDestroy(){

  }

  /**
   * 页面hover事件
   * @param item
   */
  itemActiveHover(index) {
    this.itemActiveIndex = index;
  }

  closeModal() {
    this.activeModal.close();
  }

  /**
   * 选择划卡项
   * @param itemP
   */
  selectReduce(itemP:ReduceCardItem){
    if(!AppUtils.arrayContains(this.data.choosedReduceCardList,itemP)){
      this.action(itemP);
      this.closeModal();
    }else{
      AppUtils.showWarn("提示","已选择该划卡项");
    }
  }

  /**
   * 根据编号、名称过滤划卡项
   */
  findReduce(){
    this.data.reduceCardListTmp = this.data.reduceCardList;
    if(!AppUtils.isNullObj(this.queryParam)){
      this.queryParam = AppUtils.isNullOrWhiteSpace(this.queryParam)?"":AppUtils.trimBlank(this.queryParam);
      this.data.reduceCardListTmp = this.data.reduceCardList.filter((item:ReduceCardItem)=>{
        if((item.number && (item.number.indexOf(this.queryParam) > -1)) || (item.name && (item.name.indexOf(this.queryParam) > -1))){
          return true;
        }else{
          return false;
        }
      })
    }

    if(this.itemType != -1){
      this.data.reduceCardListTmp = this.data.reduceCardListTmp.filter((item:ReduceCardItem) => {
        if(item.itemType == this.itemType){
          return true;
        }else{
          return false;
        }
      })
    }
  }

}

export class SelectReduceCardPopupViewData{
  public reduceCardList: Array<ReduceCardItem> = new Array();//所有划卡项列表
  public reduceCardListTmp: Array<ReduceCardItem> = new Array();//条件过滤后列表
  public choosedReduceCardList: Array<ReduceCardItem> = new Array();//已选择的划卡项列表

  public static fromComp(selectReduceCardViewData:SelectReduceCardViewData):SelectReduceCardPopupViewData{
    let selectReduceCardPopupViewData = new SelectReduceCardPopupViewData();
    selectReduceCardPopupViewData.reduceCardList = selectReduceCardViewData.reduceCardList;
    selectReduceCardPopupViewData.reduceCardListTmp = AppUtils.addAll(selectReduceCardPopupViewData.reduceCardListTmp,selectReduceCardViewData.reduceCardList);
    selectReduceCardPopupViewData.choosedReduceCardList = selectReduceCardViewData.choosedReduceCardList;
    return selectReduceCardPopupViewData;
  }
}
