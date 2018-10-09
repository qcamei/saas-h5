import {Component, OnInit, OnDestroy, Input} from "@angular/core";

import {WFDataWraper, BonusWFCompData, StaffData, BonusItemData} from "../wfComp/WFDataWraper";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BonusTypeEnum} from "../../../bsModule/bonusRecord/data/BonusTypeEnum";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {UserBonus} from "../../../bsModule/workFlow/data/UserBonus";
import {BonusInfoAddForm} from "../../../bsModule/workFlow/apiData/BonusInfoAddForm";
import {BonusInfoUpdateForm} from "../../../bsModule/workFlow/apiData/BonusInfoUpdateForm";
import {BonusInfo} from "../../../bsModule/workFlow/data/BonusInfo";
import {BonusPopupViewData, BonusPopupComp} from "./bonusPopup/bonusPopup";
import {WFDataWraperMgr} from "../wfComp/WFDataWraperMgr";
import {BonusWFMgr} from "../../../bsModule/workFlow/BonusWFMgr";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {WorkFlowMgr} from "../../../bsModule/workFlow/WorkFlowMgr";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**
 * 提成设置 选择服务人员公共组件
 */
@Component({
  selector:'bonus-comp',
  template:`
           <zm-card-box [withCollapse]="true" [expanded]="contentExpanded">
             <header>
                   <label fxLayoutAlign="center center" style="font-weight: bold;font-size: 18px;">服务提成</label>
             </header>
             <content>
                <zm-table-detail *ngIf="bonusWFCompData.bonusList.length>0"  [borderNone]="true">
                    <thead>
                      <th style="width:50px">序号</th>
                      <th style="width:20%;">类型</th>
                      <th style="width:20%;">名称</th>
                      <th style="width:20%;">结算方式</th>
                      <th>服务人员</th>
                    </thead>
                    <tbody style="text-align: center">
                      <tr *ngFor="let item of bonusWFCompData.bonusList;let i=index;">
                        <td style="width:50px;">{{i+1}}</td>
                        <td style="width:20%;">{{item.type | orderItemTypePipeComp}}</td>
                        <td style="width:20%;">{{item.name}}</td>
                        <td style="width:20%;">{{item.payType | prdCardPayPipe}}</td>
                        <td style="line-height:2.5;padding-left:30px;" class="zmCurHand" (click)="selectStaff(i)">
                        <div fxLayout="row"  fxLayoutAlign="space-between center">
                              <span>{{item.staffName}}</span>
                              <img style="padding-top:5px" src="assets/images/icon/icon_Add.png" alt="">
                        </div>
                        </td>
                      </tr>
                    </tbody>
                  </zm-table-detail>
             </content>
           </zm-card-box>
  `,
  styles:[
    `
  `
  ]
})
export class BonusComp implements OnInit,OnDestroy{

  private service: BonusCompService;
  public viewData: BonusCompViewData;
  contentExpanded = false;
  //输入参数
  @Input() wFDataWraper:WFDataWraper;//临时添加 外部输入参数

  public bonusWFCompData:BonusWFCompData;//提成

  constructor(private wfDataWraperMgr:WFDataWraperMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private bonusWFMgr:BonusWFMgr,
              private workFlowMgr:WorkFlowMgr,
              private matDialog: MatDialog,
              ){
    ZmModalMgr.getInstance().reset(this.matDialog);
    this.service = new BonusCompService(this.storeClerkInfoSynDataHolder,this.buserMgr,this.bonusWFMgr,this.workFlowMgr);
  }

  ngOnInit(): void {
    this.bonusWFCompData = this.wFDataWraper.getBonusWFCompData();
    this.service.initViewData((viewData:BonusCompViewData) => {
      if(viewData){
        this.viewData = viewData;
      }
    });
  }

  ngOnDestroy(): void {

  }

  /**
   * 弹出设置服务人员提成窗口
   */
  selectStaff(index):void{
    this.bonusWFCompData = this.wFDataWraper.getBonusWFCompData();
    const activeModal = ZmModalMgr.getInstance().newLgModal(BonusPopupComp,null,null);
    //数据传递 回调执行
    this.viewData.choosedBonusItemData = this.bonusWFCompData.bonusList[index];
    activeModal.componentInstance.data = BonusPopupViewData.fromComp(this.viewData);
    activeModal.componentInstance.action = this.selectStaffCallback.bind(this,index);
  }

  /**
   * 选择服务人员回调 添加到工作流
   */
  selectStaffCallback(index):void{
    let bonusItemDataTmp = new BonusItemData();
    AppUtils.copy(bonusItemDataTmp,this.viewData.choosedBonusItemData);
    let nameArr = [];
    bonusItemDataTmp.staffBonusList = [];
    this.viewData.choosedStaffListTmp.forEach((item) =>{
      if(!AppUtils.arrayContains(bonusItemDataTmp.staffBonusList,item)){
        bonusItemDataTmp.staffBonusList.push(item);
        nameArr.push(item.name);
      }
    })
    bonusItemDataTmp.staffName = nameArr.join("、");
    this.viewData.choosedStaffListTmp.splice(0,this.viewData.choosedStaffListTmp.length);
    this.bonusWFCompData.bonusList[index] = bonusItemDataTmp;
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

}

export class BonusCompService{

  constructor(private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,private buserMgr:BUserMgr,private bonusWFMgr:BonusWFMgr,private workFlowMgr:WorkFlowMgr){}

  public async initViewData(callback:(viewDataP:BonusCompViewData) => void){
    let viewDataTmp = new BonusCompViewData();

    //请求storeClerkInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.clerkMap = storeClerkInfo.getValidClerkMap();
    viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

    //请求所有员工信息
    let clerkIdArray = viewDataTmp.clerkMap.keys();
    let buserList = await this.buserMgr.findByMultitId(clerkIdArray);
    viewDataTmp.buserMap = this.buildBuserMap(buserList);

    //组装显示数据
    let keys = viewDataTmp.clerkMap.keys();
    let staffList = this.getStaffList(keys, viewDataTmp.buserMap,viewDataTmp.clerkMap,viewDataTmp.roleMap);
    viewDataTmp.staffDataList = staffList;
    viewDataTmp.staffList = staffList;
    callback(viewDataTmp);
  }

  /**
   * 组装staffList
   * @param keys
   * @param buserMap
   * @param clerkMap
   * @param roleMap
   * @returns {StaffData[]}
   */
  private getStaffList(keys: Array<string>,buserMap:ZmMap<BUser>,clerkMap:ZmMap<ClerkInfo>,roleMap:ZmMap<StoreAdminRole>) {
    let staffList = new Array<StaffData>();
    for (let i = 0; i < keys.length; i++) {
      let staffData = new StaffData();
      staffData.id = keys[i];
      let user = buserMap.get(keys[i]);
      if(user){
        staffData.name = user.name;
      }
      staffData.amount = 0;
      staffData.bonusType = BonusTypeEnum.FixedBonus;
      staffData.percentage = 0;
      staffData.cost = 0;

      let clerkInfo = clerkMap.get(keys[i]);
      let roleSet = clerkInfo.roleSet;
      if (roleSet) {
        let roleNameArr = [];
        for (let i = 0; i < roleSet.length; i++) {
          let storeAdminRole = roleMap.get(roleSet[i]);
          if (storeAdminRole) {
            roleNameArr.push(storeAdminRole.name);
          }
        }
        staffData.roleName = roleNameArr.join("、");
      } else {
        staffData.roleName = "-";
      }
      staffList.push(staffData);
    }
    return staffList;
  }

  /**
   * 组装员工详情
   * @param buserList
   * @param viewDataTmp
   */
  private buildBuserMap(buserList: Array<BUser>):ZmMap<BUser> {
    let buserMap = new ZmMap<BUser>();
    for (let i = 0; i < buserList.length; i++) {
      buserMap.put(buserList[i].id, buserList[i]);
    }
    return buserMap;
  }

}

export class BonusCompViewData{
  //员工map
  public clerkMap: ZmMap<ClerkInfo>;
  //角色map
  public roleMap: ZmMap<StoreAdminRole>;
  //店铺所有员工详情map
  public buserMap: ZmMap<BUser>;
  //服务人员列表项
  public staffDataList:Array<StaffData> = new Array();
  public staffList:Array<StaffData> = new Array();
  //选中的服务人员列表
  public choosedStaffListTmp:Array<StaffData> = new Array();

  //选中的设置项
  public choosedBonusItemData:BonusItemData;
}

