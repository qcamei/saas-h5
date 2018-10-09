import {Component, OnInit, OnDestroy, Input, Output, Inject} from "@angular/core";

import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SelectConsumeViewData} from "../selectConsumeComp/selectConsumeComp";
import {MAT_DIALOG_DATA} from "@angular/material";
/**
 * 选择套餐弹框组件
 */
@Component({
    selector:'select-package-popup',
    template:`
    <div>
        <div mat-dialog-title>
          <h4 class="modal-title fz-16 font-bold">选择套餐</h4>
          <div class="disFlex align-center" style="white-space:nowrap;">
              <zm-search-box [label]=" '套餐查询'" [placeholder]="'请输入编号/名称查询'" [(zmValue)]="data.queryParam" (callBack)="findPackage()"></zm-search-box>
              <div class="form-group">  
                  <label class="mg-b-0 mg-r-10 mg-l-20 fz-14 font-bold">分类</label>
                    <select class="form-control set-bg cur-hand  c-hued" [(ngModel)]="data.typeId" (change)="findPackage()">
                        <option [value]="0">全部</option>
                        <option [value]="item.id" *ngFor="let item of data.packageTypeList">{{item.name}}</option>
                    </select>
              </div>
          </div>
        </div>
        <mat-dialog-content fusePerfectScrollbar>
          <div class="row" fxLayout="row" fxLayoutAlign="start">
            <!--<img src="assets/images/direction.png" alt="" class="icon-dir"/>-->
            <div class="col-md-8">
                
                <table class="scrollTable table table-bordered">
                    <thead>
                        <th style="width:10%;">序号</th>
                        <th style="width:25%;">编号</th>
                        <th style="width:25%;">名称</th>
                        <th style="width:25%;">分类</th>
                        <th style="width:15%;">售价</th>
                    </thead>
                     <tbody style="height:340px;" fusePerfectScrollbar>
                        <tr class="pos-r" *ngFor="let item of data.packageList;let i=index;" (click)="selectItem(item)"  [class.itemActiveClass]="itemActiveIndex===i?'itemActive':''">
                        <div class="maskHover pos-a" style="width: 100%;height: 80%;left: 0;top: 10%;" (mouseover)="itemActiveHover(i)" >&nbsp;</div>
                        <td style="border-left: none;">
                            <span *ngIf="itemActiveIndex!==i">{{i+1}}</span>
                            <img src="assets/images/selectItem.png" *ngIf="itemActiveIndex===i">
                        </td> 
                            <td style="width:25%; ">{{item.number}}</td> 
                            <td style="width:25%; ">{{item.name}}</td> 
                            <td style="width:25%; ">{{item.typeId|packageTypePipe:data.packageTypeMap}}</td> 
                            <td style="width:15%; ">{{item.sellPrice | number:'1.2-2'}}</td> 
                        </tr>
                    </tbody>
                </table>      
            </div>
            <div class="col-md-4">
                    <table class="scrollTable table table-bordered fz-12">
                        <thead>
                            <th style="width:30%;">编号</th>
                            <th style="width:50%;">名称</th>
                            <th style="width:20%;">操作</th>
                        </thead>
                        <tbody style="height:340px;" fusePerfectScrollbar>
                            <tr *ngFor="let item of data.choosedPackageListTmp;let i=index;">
                                <td style="width:30%;">{{item.number}}</td> 
                                <td style="width:50%;">{{item.name}}</td> 
                                <td style="width:20%;"><a (click)="deleteItem(i)">删除</a></td> 
                            </tr>
                            <div *ngIf="data.choosedPackageListTmp.length == 0" style="margin: 150px 0;"><p class="font-c2 mg-b-0">请在左边选择套餐添加</p></div>
                        </tbody>
                    </table>               
                </div>
          </div>
        </mat-dialog-content>
        <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
          <button class="cancel-btn" (click)="closeModal()">取消</button>
          <button class="confirm-btn" (click)="confirm()">确定</button>
        </mat-dialog-actions>
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
export class SelectPackagePopupComp implements OnInit,OnDestroy{

  private itemActiveIndex:number;
  @Input() data:SelectPackagePopupViewData;
  @Output() action:any;

  private activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit(): void {
    this.data.choosedPackageListTmp.splice(0,this.data.choosedPackageListTmp.length);
    this.data.choosedPackageList.forEach((item) =>{
      if(!AppUtils.arrayContains(this.data.choosedPackageListTmp,item)){
        this.data.choosedPackageListTmp.push(item);
      }
    })
  }

  ngOnDestroy(): void {

  }

  /**
   * 页面点击事件 根据编号名称过滤
   */
  findPackage(){
    let packageList = this.data.packageMap.values();
    if(!AppUtils.isNullObj(this.data.queryParam)){
      this.data.queryParam = AppUtils.isNullOrWhiteSpace(this.data.queryParam)?"":AppUtils.trimBlank(this.data.queryParam);
      packageList = packageList.filter((item) => {
        if((item.number && (item.number.indexOf(this.data.queryParam) > -1)) || (item.name && (item.name.indexOf(this.data.queryParam) > -1))){
          return true;
        }else{
          return false;
        }
      })
    }
    if(this.data.typeId != "0"){
      packageList = packageList.filter((item) => {
        if(item.typeId == this.data.typeId){
          return true;
        }else{
          return false;
        }
      })
    }
    this.data.packageList = packageList;
  }

  /**
   * 页面hover事件 选择商品添加到选中列表
   * @param item
   */
  itemActiveHover(index) {
    this.itemActiveIndex = index;
  }
  /**
   * 页面点击事件 选择添加到选中列表
   * @param item
   */
  selectItem(item){
    if(!AppUtils.arrayContains(this.data.choosedPackageListTmp,item)){
      this.data.choosedPackageListTmp.push(item);
    }else{
      AppUtils.showWarn("提示","已选择该套餐");
    }
  }

  /**
   * 删除选中商品
   * @param index
   */
  deleteItem(index){
    this.data.choosedPackageListTmp.splice(index,1);
  }

  /**
   * 页面点击事件 取消关闭弹窗
   */
  closeModal() {
    this.data.choosedPackageList.splice(0,this.data.choosedPackageList.length);
    this.activeModal.close();
  }

  /**
   * 页面点击事件 确定
   */
  confirm(){
    this.data.choosedPackageList.splice(0,this.data.choosedPackageList.length);
    this.data.choosedPackageListTmp.forEach((item) =>{
      this.data.choosedPackageList.push(item);
    })
    if(this.data.choosedPackageList.length>0){
      this.action();
    }
    this.activeModal.close();
  }

}

export class SelectPackagePopupViewData{
  public packageMap:ZmMap<PackageProject>;
  public packageList:Array<PackageProject>;
  public packageTypeMap:ZmMap<PackageProjectType>;
  public packageTypeList:Array<PackageProjectType>;
  //选中的套餐列表
  public choosedPackageList:Array<PackageProject>;
  public choosedPackageListTmp:Array<PackageProject>;

  //查询参数
  public queryParam: string = "";
  public typeId:string = "0";

  public static fromConsume(selectConsumeViewData:SelectConsumeViewData):SelectPackagePopupViewData{
    let selectPackagePopupViewData = new SelectPackagePopupViewData();
    selectPackagePopupViewData.packageMap= selectConsumeViewData.packageMap;
    selectPackagePopupViewData.packageList = selectConsumeViewData.packageList;
    selectPackagePopupViewData.packageTypeMap = selectConsumeViewData.packageTypeMap;
    selectPackagePopupViewData.packageTypeList = selectConsumeViewData.packageTypeList;
    selectPackagePopupViewData.choosedPackageList = selectConsumeViewData.choosedPackageList;
    selectPackagePopupViewData.choosedPackageListTmp = selectConsumeViewData.choosedPackageListTmp;
    return selectPackagePopupViewData;
  }
}
