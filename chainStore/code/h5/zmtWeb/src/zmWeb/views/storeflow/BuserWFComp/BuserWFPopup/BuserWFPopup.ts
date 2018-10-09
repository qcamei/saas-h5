import {Component, Input, Output, Inject} from "@angular/core";
import {ZmMap, AppUtils} from "../../../../comModule/AppUtils";
import {FollowClerk, BuserWFCompViewData} from "../BuserWFComp";

import {ClerkInfo} from "../../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 选择跟进人员 模态框
 */
@Component({
  selector:'select-followClerk',
  template:`
    <div  animation-modal>
      <div mat-dialog-title>
        <h4 class="modal-title fz-16 font-bold">选择跟进人员</h4>
      </div>
      <mat-dialog-content>
        <div class="disFlex">
            <div class="flex">
              <zm-search-box [label]=" '跟进人员查询'" [placeholder]="'请输入姓名/手机号'" [(zmValue)]="viewData.queryParam" (callBack)="queryFollowClerk()"></zm-search-box>
            </div>
        </div>
        
        <ng-template #theadTemplate>
           <th style="width:30%">姓名</th>
           <th style="width:50%">手机号</th>
        </ng-template>
           
        <ng-template #tbodyTemplate let-item="item" >
           <td style="width:30%;" >{{item.name}}</td>
           <td style="width:50%" >{{item.phone}}</td>
        </ng-template>
        <zm-table-select-single [itemList]="data.clerkListShow" (onSelected) = "onItemSelected($event)" 
        [tbodyTemplate]="tbodyTemplate" [theadTemplate]="theadTemplate" fusePerfectScrollbar>
        </zm-table-select-single>
      </mat-dialog-content>
    </div>
  `,
  styles:[`
`]
})
export class BuserWFPopup{

  private service: BuserWFPopupService;
  public viewData: BuserWFPopupViewData = new BuserWFPopupViewData();
  itemActiveIndex:number;
  @Input() data:BuserWFPopupViewData;
  @Output() callBack:(clerk)=>FollowClerk;

  private activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataInput:any,) {
    this.activeModal = dataInput.modalCtrl;
    this.service = new BuserWFPopupService();
  }


  closeModal(){
    this.activeModal.close();
  }

  /**
   * 查询跟进人员 页面点击事件
   */
  queryFollowClerk(){
    let queryParam = AppUtils.trimBlank(this.viewData.queryParam);
    this.service.queryClerk(this.data,queryParam);
  }

  /**
   * 表格组件选中的跟进人员
   * @param clerk
   */
  onItemSelected(clerk:ClerkInfo){
    this.closeModal();
    this.callBack(clerk);
  }

  /**
   * 选择跟进人员 点击事件
   * @param clerkId
   */
  selectFollowClerk(clerkId){
    this.closeModal();
    let selectClerk = this.data.clerkMap.get(clerkId);
    // this.viewData.queryParam = selectClerk.name;
    //输出选中的会员
    this.callBack(selectClerk);
  }
  /*
    * 鼠标hover事件
    */
  itemActiveHover(index):void{
    this.itemActiveIndex = index;
  }


}

export class BuserWFPopupService{
  constructor(){}

  /**
   * 过滤跟进人员
   * @param viewData
   * @param queryParam
   */
  public queryClerk(data,queryParam){
    if(!AppUtils.isNullOrWhiteSpace(queryParam)){
      let clerks = data.clerkMap.values();
      data.clerkListShow = this.filterClerk(clerks,queryParam);
    }else{
      data.clerkListShow = data.clerkMap.values();
    }
  }

  private filterClerk(clerks:Array<FollowClerk>,queryParam){
    let clerkList:Array<FollowClerk> = new Array<FollowClerk>();
    clerkList = clerks.filter((item) =>{
      if((item.name.indexOf(queryParam) > -1) || (item.phone.indexOf(queryParam) > -1)){
        return true;
      }else{
        return false;
      }
    });
    return clerkList;
  }
}

export class BuserWFPopupViewData{
  public clerkMap:ZmMap<FollowClerk>;
  //查询参数
  public queryParam = "";
  //页面显示数据
  public clerkListShow:Array<FollowClerk> = new Array<FollowClerk>();

  constructor(){
  }

  public static fromParentComp(viewData:BuserWFCompViewData){
    let selectClerkPopupViewData = new BuserWFPopupViewData();
    selectClerkPopupViewData.clerkMap = viewData.followClerkMap;
    selectClerkPopupViewData.clerkListShow = viewData.clerkList;

    return selectClerkPopupViewData;
  }
}

