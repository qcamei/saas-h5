import {Component, Input, Output, Inject} from "@angular/core";
import {ProductData} from "../../../addAppointWraper/AddAppointDataWraper";

import {AppUtils, ZmMap} from "../../../../../comModule/AppUtils";
import {ClerkInfo} from "../../../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {BUser} from "../../../../../bsModule/buser/apiData/BUser";
import {ServicePersonCompViewData} from "../servicePersonComp";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 选择服务人员组件
 */
@Component({
  selector: 'select-servicePerson-comp',
  template: ` 
    <div>
        <h2 mat-dialog-title>
           选择服务人员
        </h2>
        <mat-dialog-content fusePerfectScrollbar>
                <div fxLayout="row wrap"  fxLayoutGap="20px" >
                      <zm-search-box [label]=" ''" [placeholder]="'请输入员工姓名'" [(zmValue)]="viewData.queryParam" (callBack)="findStaff()"></zm-search-box>  
                        <!--<div class="form-group">-->
                          <!--<label class="mg-b-0 mg-l-20 mg-r-10 font-bold fz-14">分类</label>-->
                          <!--<select class="form-control  cur-hand  set-bg c-hued" [(ngModel)]="data.productTypeId" (change)="findProduct()">-->
                              <!--<option [value]="0">全部</option>-->
                              <!--<option [value]="item.id" *ngFor="let item of data.productTypeList">{{item.name}}</option>-->
                          <!--</select>-->
                      <!--</div>-->
                      
                </div>
                <div  fxLayout="row wrap" fxLayoutAlign="space-between center" fxLayoutGap="20px" class="zmFullWidth">
                               
                                <div fxFlex="1 1 45%" fxFlexAlign="start">
                                      <table class="scrollTable table table-bordered zmFullWidth">
                                          <thead>
                                            <th style="width:15%;">序号</th>
                                            <th style="width:20%;">员工姓名</th>
                                            <th style="width:50%;">岗位</th>
                                          </thead>
                                          <tbody style="height:370px;overflow-x:hidden;overflow-y:auto;">
                                                  <tr *ngFor="let item of data.staffDataListShow;let i=index;" (click)="selectStaff(item)"  (mouseover)="itemActiveHover(i)"  [class.itemActiveClass]="itemActiveIndex===i?'itemActive':''">
                                                    <td style="width:15%;">
                                                      <span *ngIf="itemActiveIndex!==i">{{i+1}}</span>
                                                      <img src="assets/images/selectItem.png" *ngIf="itemActiveIndex===i">
                                                    </td>
                                                    <td style="width:20%;">{{item.name}}</td>
                                                    <td style="width:50%;">{{item.roleName}}</td>
                                                  </tr>
                                          </tbody>
                                     </table>
                                </div>
                                <div fxFlex="1 1 auto" style="text-align: center"><img src="assets/images/direction.png" alt=""/></div>
                                <div fxFlex="1 1 45%"  fxFlexAlign="start">
                                    <table class="scrollTable table table-bordered zmFullWidth">
                                      <thead>
                                        <th style="width:10%;">序号</th>
                                        <th style="width:15%;">员工姓名</th>
                                        <th style="width:10%;">操作</th>
                                      </thead>
                                      <tbody style="height:370px;overflow-x:hidden;overflow-y:auto;">
                                        <tr *ngFor="let item of data.selectStaffListTmp;let i=index;">
                                            <td style="width:10%;">{{i+1}}</td>
                                            <td style="width:15%;">{{item.name}}</td>
                                            <td style="width:10%;color:#4678fa;cursor:pointer;"(click)="deleteItem(i)">删除</td>
                                          </tr>
                                          <div *ngIf="data.selectStaffListTmp.length == 0" style="margin: 175px 0;"><p class="font-c2 mg-b-0">请在左边选择服务人员添加</p></div>
                                      </tbody>
                                    </table>
                                </div>
                </div>
            
        
        </mat-dialog-content>
        <mat-dialog-actions>
          <div  fxLayout="row wrap" fxLayoutAlign="end" fxLayoutGap="20px" class="zmFullWidth">
                <div class="pd-r-10" (click)="closeModal()">
                  <button class="cancel-btn">取消</button>
                </div>
                <div class="pd-l-10">
                  <button class="confirm-btn" (click)="confirmSelected()">确定</button>
                </div>
          </div>
        </mat-dialog-actions>
    </div>
 
 
 
    <!--<div animation-modal>-->
      <!--<div class="modal-header pd-lr-15 pd-tb-10">-->
        <!--<h4 class="modal-title fz-16 font-bold">服务人员</h4>-->
        <!--<button type="button" class="close" aria-label="Close" (click)="closeModal()">-->
          <!--<span aria-hidden="true">&times;</span>-->
        <!--</button>-->
      <!--</div>-->
      <!--<div class="modal-body">-->
        <!--<div class="row">-->
        <!--<img src="assets/images/direction.png" alt="" class="icon-dir"/>-->
                <!--<div class="col-md-4">-->
                <!--&lt;!&ndash;<div class="disFlex" style="white-space:nowrap;">&ndash;&gt;-->
                        <!--&lt;!&ndash;&lt;!&ndash;<input type="text" class="search-input" placeholder="请输入员工姓名" style="width:100%;" [(ngModel)]="viewData.queryParam">&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;&lt;!&ndash;<button class="com-btn" style="border-top-left-radius: 0;border-bottom-left-radius: 0;width:70px;" (click)="findStaff()">查询</button>&ndash;&gt;&ndash;&gt;-->
                  <!--&lt;!&ndash;</div>&ndash;&gt;-->
                  <!--<zm-search-box [label]=" ''" [placeholder]="'请输入员工姓名'" [(zmValue)]="viewData.queryParam" (callBack)="findStaff()"></zm-search-box>-->
                  <!---->
                  <!--<table class="table table-bordered text-center mg-t-20 fz-14 mg-b-0">-->
                    <!--<thead>-->
                      <!--<th style="width:30%;">序号</th>-->
                      <!--<th style="width:40%;">员工姓名</th>-->
                      <!--<th style="width:30%;">岗位</th>-->
                    <!--</thead>-->
                  <!--</table>-->
                  <!--<div style="overflow-x:hidden;overflow-y:auto;height:340px;border-top:none; ">-->
                    <!--<table class="table table-bordered text-center fz-14 mg-b-0 scroll-table" style="margin-top:-1px;">-->
                        <!--<tr *ngFor="let item of data.staffDataListShow;let i=index;" (click)="selectStaff(item)"  (mouseover)="itemActiveHover(i)"  [class.itemActiveClass]="itemActiveIndex===i?'itemActive':''">-->
                          <!--<td>-->
                            <!--<span *ngIf="itemActiveIndex!==i">{{i+1}}</span>-->
                            <!--<img src="assets/images/selectItem.png" *ngIf="itemActiveIndex===i">-->
                          <!--</td>-->
                          <!--<td>{{item.name}}</td>-->
                          <!--<td>{{item.roleName}}</td>-->
                        <!--</tr>-->
                     <!--</table>-->
                  <!--</div>      -->
                <!--</div>-->
                <!--<div class="col-md-8" style="margin-top:50px;">-->
                  <!--<table class="scrollTable table table-bordered">-->
                    <!--<thead>-->
                      <!--<th style="width:10%;">序号</th>-->
                      <!--<th style="width:15%;">员工姓名</th>-->
                      <!--<th style="width:10%;">操作</th>-->
                    <!--</thead>-->
                    <!--<tbody style="height:370px;overflow-x:hidden;overflow-y:auto;">-->
                      <!--<tr *ngFor="let item of data.selectStaffListTmp;let i=index;">-->
                          <!--<td style="width:10%;">{{i+1}}</td>-->
                          <!--<td style="width:15%;">{{item.name}}</td>-->
                          <!--<td style="width:10%;color:#4678fa;cursor:pointer;"(click)="deleteItem(i)">删除</td>-->
                        <!--</tr>-->
                        <!--<div *ngIf="data.selectStaffListTmp.length == 0" style="margin: 175px 0;"><p class="font-c2 mg-b-0">请在左边选择服务人员添加</p></div>-->
                    <!--</tbody>-->
                  <!--</table>-->
                <!--</div>-->
              <!--</div>-->
      <!--</div>-->
      <!--<div class="modal-footer pd text-right">-->
      <!--<div class="pd-r-10" (click)="closeModal()">-->
        <!--<button class="cancel-btn">取消</button>-->
      <!--</div>-->
      <!--<div class="pd-l-10">-->
        <!--<button class="confirm-btn" (click)="confirmSelected()">确定</button>-->
      <!--</div>-->
    <!--</div>-->
    <!--</div>-->
  `,
  styles: [`
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
  .table {
    font-size: 12px;
    text-align: center;
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
    border: 1px solid #e9ecef;
    border-top: none;
  }
  .scrollTable tbody tr{
    border: 1px solid #e9ecef;
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
      top: 250px;
      width: 7px;
    }
    .modal-title{
      font-size: 18px;
      font-weight: bold !important;
      color: #333 !important;
    } 
    .pd-lr-15{
      padding-left: 15px;
      padding-right: 15px;
    } 
    .pd-tb-10{
      padding-top:10px;
      padding-bottom: 10px;
    } 
    .fz-16{
      font-size: 16px;
    } 
    .font-bold{
      font-weight: bold;
    }
    .text-center{
      text-align: center;
    } 
    .mg-t-20{
      margin-top:20px;
    } 
    .fz-14{
      font-size:14px;
    } 
    .mg-b-0{
      margin-bottom: 0;
    } 
    .font-c2{
      color: #bcc2c8;
    }
    .text-right{
      text-align: right;
    } 
    .pd-r-10{
      padding-right: 10px;
    } 
    .pd-l-10{
      padding-left: 10px;
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
      &:focus {
        outline: none;
      }
    } 
    .confirm-btn{
      border: 2px solid#03a9f4;
      width: 168px;
      line-height: 48px;
      -moz-border-radius: 8px;
           border-radius: 8px;
      cursor: pointer;
      &:focus {
        outline: none;
      }
      background:#03a9f4;
      color:#fff;
    }
  `]
})

export class ServicePersonPopup {
  private service: ServicePersonPopupCompService;
  public viewData: ServicePersonPopupCompViewData = new ServicePersonPopupCompViewData();
  private itemActiveIndex: number;

  data: ServicePersonPopupCompViewData;
  product: ProductData;
  callBack: (staffDataList) => Array<StaffData>;
  activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.service = new ServicePersonPopupCompService();

    this.activeModal = dataInput.modalCtrl;
    this.data = dataInput.modalData;
    this.product = dataInput.modalData.product;
    this.callBack = dataInput.callBack ;

  }

  ngOnInit(): void {

    this.data.selectStaffList.forEach((item) => {
      if (!AppUtils.isNullObj(this.product.buserId)) {
        if (AppUtils.arrayContains(this.product.buserId, item.id)) {
          this.data.selectStaffListTmp.push(item);
        }
      }
    });
  }

  closeModal() {
    this.activeModal.close();
    this.data.selectStaffListTmp.splice(0, this.data.selectStaffListTmp.length);
  }

  /**确定*/
  confirmSelected(): void {
    this.data.selectStaffListTmp.forEach((item) => {
      if (!AppUtils.arrayContains(this.data.selectStaffList, item)) {
        this.data.selectStaffList.push(item);
      }
    });

    this.callBack(this.data.selectStaffListTmp);
    this.closeModal();
  }

  /**
   * 页面点击事件 根据名称过滤服务人员
   */
  findStaff() {
    let queryParam = AppUtils.trimBlank(this.viewData.queryParam);
    this.data.staffDataListShow = this.data.staffDataList.filter((item) => {
      if (item.name.indexOf(queryParam) > -1) {
        return true;
      } else {
        return false;
      }
    })
  }

  /**
   * 页面hover选择服务人员
   * @param item
   */
  itemActiveHover(index) {
    this.itemActiveIndex = index;
  }
  /**
   * 选择服务人员
   * @param item
   */
  selectStaff(item: StaffData) {
    if (AppUtils.arrayContains(this.data.selectStaffListTmp, item)) {
      AppUtils.showWarn("提示", "已选择该服务人员");
    } else {
      this.data.selectStaffListTmp.push(item);
    }

  }

  /**
   * 删除选中的服务人员
   * @param index
   */
  deleteItem(index) {
    this.data.selectStaffListTmp.splice(index, 1);
  }

}

export class ServicePersonPopupCompService {

  constructor() {
  }

}

export class ServicePersonPopupCompViewData {
  public clerkMap: ZmMap<ClerkInfo>;
  public roleMap: ZmMap<StoreAdminRole>;
  public buserMap: ZmMap<BUser>;

  //服务人员列表项
  public staffDataList: Array<StaffData> = new Array();//原始组装数据
  public staffDataListShow: Array<StaffData> = new Array();//显示组装数据

  //选中的服务人员列表
  public selectStaffList: Array<StaffData> = new Array();
  public selectStaffListTmp: Array<StaffData> = new Array();
  public selectStaffMap: ZmMap<StaffData> = new ZmMap<StaffData>();//原始

  //查询参数
  public queryParam: string;

  public static fromParentComp(viewData: ServicePersonCompViewData) {
    let servicePersonPopupViewData = new ServicePersonPopupCompViewData();
    servicePersonPopupViewData.staffDataList = viewData.staffDataList;
    servicePersonPopupViewData.selectStaffListTmp = viewData.selectStaffListTmp;
    servicePersonPopupViewData.staffDataListShow = viewData.staffDataListShow;
    servicePersonPopupViewData.selectStaffList = viewData.selectStaffList;
    servicePersonPopupViewData.selectStaffMap = viewData.selectStaffMap;
    return servicePersonPopupViewData;
  }


}

export class StaffData {
  id: string;//员工id
  name: string;//员工姓名
  roleName: string;//员工岗位
}
