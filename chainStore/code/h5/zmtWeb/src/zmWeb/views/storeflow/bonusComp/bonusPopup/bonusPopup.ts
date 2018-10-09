import {Component, OnInit, OnDestroy, Input, Output, Inject} from "@angular/core";

import {StaffData, BonusItemData} from "../../wfComp/WFDataWraper";
import {BonusCompViewData} from "../../bonusComp/bonusComp";
import {AppUtils} from "../../../../comModule/AppUtils";
import {BonusTypeEnum} from "../../../../bsModule/workFlow/data/BonusTypeEnum";
import {MAT_DIALOG_DATA} from "@angular/material";
/**
 * 选择服务人员组件
 */
@Component({
  selector:'bonus-popup',
  template:
    `    
    <div animation-modal>
        <div mat-dialog-title>
          <h4 class="modal-title fz-16 font-bold">服务人员</h4>
          <zm-search-box [label]=" '查询'" [placeholder]="'请输入员工姓名'" [(zmValue)]="data.queryParam" (callBack)="findStaff()"></zm-search-box>
        </div>
        <mat-dialog-content>
          <div class="row" fxLayout="row" fxLayoutAlign="start">
              <!--<img src="assets/images/direction.png" alt="" class="icon-dir" style="right: 410px;"/>-->
              <div class="col-md-4">
              
              <zm-table>
                  <thead>
                    <th style="width:30%;">序号</th>
                    <th style="width:40%;">员工姓名</th>
                    <th style="width:30%;">岗位</th>
                  </thead>
                   <tbody style="height:340px;" fusePerfectScrollbar>
                    <tr *ngFor="let item of data.staffList;let i=index;" (click)="selectStaff(item)"  (mouseover)="itemActiveHover(i)" [ngClass]="{'itemActiveClass':itemActiveIndex==i}">
                      <td style="width:30%;">
                      <span *ngIf="itemActiveIndex!==i">{{i+1}}</span>
                         <img src="assets/images/selectItem.png" *ngIf="itemActiveIndex===i"></td>
                      <td style="width:40%;">{{item.name}}</td>
                      <td style="width:30%;">{{item.roleName}}</td>
                    </tr>          
                    <div *ngIf="data.staffList.length == 0" class="pos-a" style="top:50%;width:100%;"><p class="font-c2 mg-b-0">没有数据</p></div>
                  </tbody>
                </zm-table>
              </div>
              <div class="col-md-8">
                    <zm-table>
                      <thead>
                        <th style="width:10%;">序号</th>
                        <th style="width:15%;">员工姓名</th>
                        <th style="width:20%;">业绩金额</th>
                        <th style="width:15%;">提成类型</th>
                        <th style="width:15%;">提成比例</th>
                        <th style="width:15%;">提成金额</th>
                        <th style="width:10%;">操作</th>
                      </thead>
                       <tbody style="height:340px;" fusePerfectScrollbar>
                        <tr *ngFor="let item of data.choosedStaffListTmp;let i=index;" >
                          <td style="width:10%;">{{i+1}}</td>
                          <td style="width:15%;">{{item.name}}</td>
                          <td style="width:20%;" style="word-wrap:normal;word-break: normal;">
                            <div class="pos-r align-center disFlex" style="width:103px;">
                            <i class="fa fa-pencil pos-a" style="color:#4678fa;left:5px;"></i>
                            <input type="number" oninput="if(value.length>8)value=value.slice(0,8)" style="width:100%;border:none;" class="pd-l-20 pd-r-20 text-center" [(ngModel)]="item.amount" (change)="changeAmount($event,item)">
                            </div>
                          </td>
                          <td style="width:15%;position: relative;">
                            <select class="c-modal-se"  style="padding:0;"  [(ngModel)]="item.bonusType" (ngModelChange)="changeBonuseType($event,item)">
                              <option [value]="0">固定提成</option>
                              <option [value]="1">比例提成</option>
                            </select>
                           <span class="c-trigon" style="top:50%; margin-top:-2px;"></span>
                          </td>
                          <td style="width:15%;">
                            <div fxLayout="row" fxLayoutAlign="center center" style="width:70px;" *ngIf="item.bonusType ==1">
                              <i class="fa fa-pencil" style="color:#4678fa;padding-top: 5px;"></i>
                              <input type="number"  autofocus  oninput="if(value<0 || value>100){value=null} else {value=value.slice(0,4)}" style="width:100%;border:none;" class="pd-l-20 pd-r-20 text-center" [(ngModel)]="item.percentage" (change)="changePercente($event,item)">
                              <span>%</span>
                            </div>
                              <span *ngIf="item.bonusType == 0" class="pd-r-20 pd-l-20" style="width: 100%;">-</span>
                          </td>
                          <td style="width:15%;">
                            <div class="pos-r align-center disFlex" *ngIf="item.bonusType == 0"  style="width:70px;">
                              <i class="fa fa-pencil pos-a" style="color:#4678fa;left:5px;"></i>
                              <input type="number" oninput="if(value.length>8)value=value.slice(0,8)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.cost" (change)="changeCost($event,item)">
                            </div>
                            <span *ngIf="item.bonusType == 1" style="width: 100%;">{{item.cost}}</span>
                           </td>
                          <td style="width:10%;color:#4678fa;"><a (click)="deleteItem(i)">删除</a></td>
                        </tr>
                        <div *ngIf="data.choosedStaffListTmp.length == 0" class="pos-a" style="top:175px;width:100%;"><p class="font-c2 mg-b-0" style="font-size: 14px;">请在左边选择服务人员添加</p></div>
                      </tbody>
                    </zm-table>
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


  thead th {
    font-size: 14px;
    text-align: center;
    font-weight: bold;
    background-color: #f4f6fa !important;
  }
  tbody tr{
    margin-top: -1px;
  }
  tbody tr:nth-of-type(odd){
    background-color: #ffffff;
  }
  tbody tr:nth-of-type(even),tbody tr:nth-of-type(even) input,tbody tr:nth-of-type(even) select{
    background-color:#f9fafc;
  }
  tbody .c-tr:hover{
    background-color: #e7f3fd;
  }
  tbody a{cursor:pointer;}
  tbody a:hover{text-decoration: none;color:#03a9f4 !important;}
  
  th, td{
    vertical-align: middle !important;
    font-size: 14px;
    word-wrap:break-word;
    word-break: break-all;
  }
  thead th{
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
 
  input[type=number] {
    -moz-appearance: textfield;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
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
  
  

  .pd-lr-15{
    padding-left:15px;
    padding-right:15px;
  } 
  .pd-tb-10{
    padding-top:10px;
    padding-bottom:10px;
  }  
  .pd-l-20{
    padding-left:20px;
  } 
  .pd-r-20{
    padding-right:20px;
  }
  .pd-r-10{
    padding-right:10px;
  }
  .pd-l-10{
    padding-left:10px;
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

  .mg-b-15{
    margin-bottom:15px;
  } 
  .mg-b-0 {
    margin-bottom:0;
  }
  .com-btn {
    color: #fff;
    background:#03a9f4;
    border: none;
    height: 30px;
    width: 60px;
    font-size: 14px;
    margin-left: -5px;
    cursor: pointer;
    outline: none;
    -moz-border-radius: 6px;
         border-radius: 6px;
  } 
  .pos-a{
    position: absolute;
  }
  .pos-r{
    position: relative;
  }
  .font-c2{
    color: #bcc2c8;
  } 
  .text-center{
    text-align: center;
  } 
  .text-right{
    text-align: right;
  }
  
 
  .c-trigon{
  position: absolute;
  border-width: 5px;
  border-style: solid;
  border-color:#03a9f4 transparent transparent transparent;
  right:8px;
  top: 15px;
}
.c-modal-se{
  border: none;
  width: 100%;
  padding: 0 13px;
  outline: none;
  background: none;
  appearance:none;
  moz-appearance:none;/*?Firefox?*/
  -webkit-appearance:none;/*?Safari?和?Chrome?*/
}
.table {
  font-size: 12px;
}
.table thead th {
  white-space: nowrap;
  padding:5px 2px;
  box-sizing:border-box;
}
.table tbody tr td{
  padding:8px;
  font-size: 12px;
  box-sizing:border-box;
}
.scroll-table tr td:nth-child(1){
  width: 30%;
}
.scroll-table tr td:nth-child(2){
  width: 40%;
}
.search-input{
  outline: none;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background: #F4F6FA;
  height: 30px;
  border: 1px solid #ECEFF3;
  padding: 0 10px;
  font-size: 14px;
}
.close{
  outline:none;
}
.fa-pencil{
  top:2px;
}
.scrollTable tbody{
  height:340px;
  overflow-x:hidden;
  overflow-y:auto;
  border:1px solid #e9ecef;
  border-top:none;
}
.scrollTable tbody tr td{
  word-wrap:break-word;
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
  left: 330px;
  top: 50%;
  width: 7px;
}
  `],
})
export class BonusPopupComp implements OnInit,OnDestroy{

  public viewData: BonusPopupViewData;
  private itemActiveIndex:number;
  editPercent:boolean = false;

  @Input() data:BonusPopupViewData;
  @Output() action:any;

  private activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit(): void {
    this.data.choosedBonusItemData.staffBonusList.forEach((item) =>{
      if(!AppUtils.arrayContains(this.data.choosedStaffListTmp,item)){
        this.data.choosedStaffListTmp.push(item);
      }
    })
  }

  ngOnDestroy(): void {

  }

  /**
   * 页面点击事件 根据名称过滤服务人员
   */
  findStaff(){
    if(!AppUtils.isNullObj(this.data.queryParam)){
      this.data.queryParam = AppUtils.trimBlank(this.data.queryParam);
      this.data.staffList = this.data.staffDataList.filter((item) => {
        if(item.name && item.name.indexOf(this.data.queryParam) > -1){
          return true;
        }else{
          return false;
        }
      })
    }
  }
  /**
   * 选择服务人员hover
   * @param item
   */
  itemActiveHover(index) {
    this.itemActiveIndex = index;
  }
  /**
   * 选择服务人员
   * @param item
   */
  selectStaff(itemP:StaffData){
    let price = this.data.choosedBonusItemData.price;
    let staffData = new StaffData();
    staffData.id = itemP.id;
    staffData.name = itemP.name;
    staffData.roleName = itemP.roleName;
    staffData.amount = price;
    staffData.bonusType = itemP.bonusType;
    staffData.percentage = itemP.percentage;
    staffData.cost = itemP.cost;
    let has = false;
    this.data.choosedStaffListTmp.forEach((item)=>{
      if(item.id == staffData.id){
        has = true;
        return;
      }
    })
    if(has){
      AppUtils.showWarn("提示","已选择该服务人员");
    }else{
      this.data.choosedStaffListTmp.push(staffData);
    }
  }

  /**
   * 删除选中的服务人员
   * @param index
   */
  deleteItem(index){
    this.data.choosedStaffListTmp.splice(index,1);
  }

  /**
   * 页面点击事件 取消关闭弹窗
   */
  closeModal() {
    this.activeModal.close();
    this.data.choosedStaffListTmp.splice(0,this.data.choosedStaffListTmp.length);
  }

  /**
   * 页面点击事件 确定
   */
  confirm(){
    this.action();
    this.activeModal.close();
  }

  /**
   * 业绩金额
   * @param e
   * @param staffData
   */
  changeAmount(e,staffData:StaffData){
    let price = parseFloat(e.target.value);
    if(price < 0){
      price = 0;
    }
    staffData.amount = AppUtils.roundPoint(price,2);
    if(staffData.bonusType == BonusTypeEnum.PercentBonus){
      if(staffData.percentage){
        let percentage:number = parseFloat((staffData.percentage/100).toFixed(2));
        staffData.cost = parseFloat((price*percentage).toFixed(2));
      }
    }
  }

  /**
   * 提成比例
   * @param e
   * @param staffData
   */
  changePercente(e,staffData:StaffData){
    let percentage = e.target.value;
    if(percentage > 100){
      staffData.percentage = 100;
    }
    if(percentage < 0){
      staffData.percentage = 0;
    }
    if(staffData.bonusType == BonusTypeEnum.PercentBonus){
      if(staffData.amount && percentage){
        let percentage1:number = AppUtils.roundPoint(percentage/100,3);
        staffData.percentage = percentage;
        staffData.cost = AppUtils.roundPoint(staffData.amount*percentage1,2);
      }
    }
  }

  /**
   * 选择提成类型
   */
  changeBonuseType(e,staffData:StaffData){
    let value = e;
    staffData.cost = 0;//切换提成类型 提成金额需重新设置
    if(value == BonusTypeEnum.FixedBonus){
      staffData.percentage = 0;
      this.editPercent = true;
    }else{
      this.editPercent = false;
      if(staffData.amount && staffData.percentage){
        let percentage:number = parseFloat((staffData.percentage/100).toFixed(2));
        staffData.cost = parseFloat((staffData.amount*percentage).toFixed(2));
      }
    }
  }

  /**
   * 修改cost
   * @param e
   * @param staffData
   */
  changeCost(e,staffData:StaffData) {
    let cost = parseFloat(e.target.value);
    cost = cost<0?0:cost;
    if(cost>staffData.amount){
      AppUtils.showWarn("提示","提成金额不能大于业绩金额");
      cost = staffData.amount;
    }
    staffData.cost = AppUtils.roundPoint(cost,2);
  }

}

export class BonusPopupViewData{

  //服务人员列表项
  public staffDataList:Array<StaffData> = new Array();
  public staffList:Array<StaffData> = new Array();
  //选中的服务人员列表
  public choosedStaffListTmp:Array<StaffData> = new Array();

  //选中的设置项
  public choosedBonusItemData:BonusItemData;

  //查询参数
  public queryParam: string = "";

  public static fromComp(bonusCompViewData:BonusCompViewData):BonusPopupViewData{
    let bonusPopupViewData = new BonusPopupViewData();
    bonusPopupViewData.staffDataList = bonusCompViewData.staffDataList;
    bonusPopupViewData.staffList = bonusCompViewData.staffList;
    bonusPopupViewData.choosedStaffListTmp = bonusCompViewData.choosedStaffListTmp;
    bonusPopupViewData.choosedBonusItemData = bonusCompViewData.choosedBonusItemData;

    return bonusPopupViewData;
  }

}
