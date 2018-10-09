import {Component, Input, Output, OnInit, Inject} from "@angular/core";
import {EditLeaguerViewData} from "../../editLeaguer/editLeaguer";
import {AppUtils} from "../../../../comModule/AppUtils";
import {MAT_DIALOG_DATA} from "@angular/material";
import {ClerkData} from "./clerkData";
import {AddLeaguerViewData} from "../../addLeaguer/addLeaguer";

@Component({
  selector:'staff-popup',
  template:`
                  <div animation-modal>
                        <h2 mat-dialog-title>
                          负责人
                        </h2>
                     <zm-search-box [label]="'>查询'" [placeholder]="'请输入员工姓名'" [(zmValue)]="viewData.queryParam" (callBack)="findServiceClerk()"></zm-search-box>
                    <mat-dialog-content>
                      <div fxLayout="row wrap"  fxLayoutAlign="space-between start">
                        <div fxFlex="1 1 49%" fxFlexAlign="start">
                          
                             <ng-template #theadTemplate>
                                <th style="width: 40%">员工姓名</th>
                                <th style="width: 40%">岗位</th>
                             </ng-template>
                            
                             <ng-template #tbodyTemplate let-item="item">
                                <td style="width:40%">{{item.name}}</td>
                                <td style="width:40%">{{item.roleSetName}}</td>
                             </ng-template>
                            
                             <zm-table-select-single [itemList]="viewData.clerkList" (onSelected) = "chooseClerk($event)"  [tbodyTemplate]="tbodyTemplate"  [theadTemplate]="theadTemplate" >
                             </zm-table-select-single>
                        </div>

                        <img fxFlexAlign="center" fxFlex="0 0 auto" src="assets/images/direction.png" alt=""/>
                        <div fxFlex="1 1 49%">
                          <zm-table>
                            <thead>
                            <th style="width: 25%">员工姓名</th>
                            <th style="width: 30%">岗位</th>
                            <th style="width: 20%">操作</th>
                            </thead>
                            <tbody style="height:320px;text-align: center" fusePerfectScrollbar>
                                <tr class="c-tr" *ngFor="let item of viewData.choosedClerkListTmp; let i=index;">
                                  <td style="width: 25%">{{item.name}}</td>
                                  <td style="width: 30%">{{item.roleSetName}}</td>
                                  <td style="width: 20%">
                                    <a (click)="delChoosedClerk(i)"style="color:#03a9f4;"class="zmCurHand">删除</a>
                                  </td>
                                </tr>
                                <div *ngIf="viewData.choosedClerkListTmp.length == 0" style="margin: 140px 0;"><p class="font-c2 text-center mg-b-0">请在左边选择负责人添加</p></div>
                            </tbody>
                          </zm-table>
                        </div>
                      </div>
                    </mat-dialog-content>
                    <mat-dialog-actions fxLayout="row wrap"  fxLayoutGap="20px" fxLayoutAlign="end">
                      <zm-btn-md name="取消" [stroked]="true" (zmbtnClick)="closeModal()">取消</zm-btn-md>
                      <zm-btn-md name="确定" [disabled]="" (zmbtnClick)="confirm()" >确定</zm-btn-md>
                    </mat-dialog-actions>
                  </div>
`,
  styles:[`

`]
})
export class StaffPopup implements OnInit{

  public viewData:StaffPopupViewData;
  public action:any;

  private activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit(): void {
    this.viewData.choosedClerkListTmp.splice(0,this.viewData.choosedClerkListTmp.length);
    if(this.viewData && this.viewData.choosedClerkList && (this.viewData.choosedClerkList.length>0)){
      this.viewData.choosedClerkList.forEach((item)=>{
        this.viewData.choosedClerkListTmp.push(item);
      })
    }
  }

  /**
   * 选择跟进人员
   * @param index
   */
  chooseClerk(item) {
    let choosedClerkListTmp = this.viewData.choosedClerkListTmp;
    if (!AppUtils.arrayContains(choosedClerkListTmp, item)) {
      choosedClerkListTmp.push(item);
    } else {
      AppUtils.showWarn("提示", "已选择改服务人员");
    }
  }

  /**
   * 删除选中的跟进人员
   * @param index
   */
  delChoosedClerk(index) {
    this.viewData.choosedClerkListTmp.splice(index, 1);
  }

  /**
   * 页面点击事件 查询员工
   */
  findServiceClerk(){
    this.viewData.clerkList = this.viewData.clerkDataList;
    if(!AppUtils.isNullObj(this.viewData.queryParam)){
      this.viewData.queryParam = AppUtils.isNullOrWhiteSpace(this.viewData.queryParam)?'':AppUtils.trimBlank(this.viewData.queryParam);
      this.viewData.clerkList = this.viewData.clerkDataList.filter((item) =>{
        if(item.name && item.name.indexOf(this.viewData.queryParam) > -1){
          return true;
        }else{
          return false;
        }
      })
    }
  }

  /**
   * 取消
   */
  closeModal(){
    this.activeModal.close();
  }

  /**
   * 确定
   */
  confirm(){
    this.viewData.choosedClerkList.splice(0,this.viewData.choosedClerkList.length);
    this.viewData.choosedClerkListTmp.forEach((item) =>{
      this.viewData.choosedClerkList.push(item);
    })
    this.action();
    this.closeModal();
  }

}

export class StaffPopupViewData{
  public clerkDataList: Array<ClerkData> = new Array<ClerkData>();
  public clerkList: Array<ClerkData> = new Array();

  //选中的服务人员列表
  public choosedClerkList: Array<ClerkData> = new Array();
  public choosedClerkListTmp: Array<ClerkData> = new Array();

  //查询参数
  public queryParam:string;

  public static fromEditLeaguer(editLeaguerViewData:EditLeaguerViewData):StaffPopupViewData{
    let staffPopupViewData = new StaffPopupViewData();
    staffPopupViewData.clerkDataList = editLeaguerViewData.clerkDataList;
    staffPopupViewData.clerkList = editLeaguerViewData.clerkList;
    staffPopupViewData.choosedClerkList = editLeaguerViewData.choosedClerkList;
    staffPopupViewData.choosedClerkListTmp = editLeaguerViewData.choosedClerkListTmp;
    return staffPopupViewData;
  }

  public static fromAddLeaguer(addLeaguerViewData:AddLeaguerViewData):StaffPopupViewData{
    let staffPopupViewData = new StaffPopupViewData();
    staffPopupViewData.clerkDataList = addLeaguerViewData.clerkDataList;
    staffPopupViewData.clerkList = addLeaguerViewData.clerkList;
    staffPopupViewData.choosedClerkList = addLeaguerViewData.choosedClerkList;
    staffPopupViewData.choosedClerkListTmp = addLeaguerViewData.choosedClerkListTmp;
    return staffPopupViewData;
  }

}
