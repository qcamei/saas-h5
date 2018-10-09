import {Component, OnInit, Input} from '@angular/core';
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";

import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BuserWFPopup, BuserWFPopupViewData} from "./BuserWFPopup/BuserWFPopup";
import {BUserCacheMgr} from "../../../bsModule/buser/BUserCacheMgr";
import {WFDataWraper, BuserWFCompData} from "../wfComp/WFDataWraper";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {WFDataWraperMgr} from "../wfComp/WFDataWraperMgr";
import {LeaguerWFMgr} from "../../../bsModule/workFlow/LeaguerWFMgr";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**
 * 选择跟进人员公共组件
 */
@Component({
  selector:'select-follow-comp',
  template:`
    <!-- 选择跟进人员 start --> 
    <zm-card-box [withCollapse]="false" [expanded]="false">
         <header>
            <label style="color:#2a2a2a;" class="fz-18 mg-b-0 font-bold">跟进人员</label>
            <div class="nameDiv fz-14 cur-hand" (click)="selectClerk($event)">
              <span *ngIf="buserWFCompData.selectFollowClerk.name" style="color: rgba(0, 0, 0, 0.87)">{{buserWFCompData.selectFollowClerk.name}}</span>
              <span *ngIf="!buserWFCompData.selectFollowClerk.name" style="color: #777">选择跟进人员（非必填）</span>
              <i class="fa fa-plus color-theme pos-a" style="right:0px;top: 10px;"></i>
            </div>
         </header>
         <content>
         
         </content>
    </zm-card-box>
    <!-- 选择跟进人员 end -->
  `,
  styles:[`
    .mg-t-20{
      margin-top:20px;
    }  
    .disFlex {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: -moz-box;
      display: flex;
    }
    .align-center {
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      align-items: center;
    }
    .ov-h {
      overflow: hidden !important;
    }

    .fz-18{
      font-size: 18px;
    } 
    .fz-14{
      font-size: 14px;
    }
    .mg-b-0{
      margin-bottom:0;
    } 
    .font-bold{
      font-weight: bold;
    } 
    .cur-hand{
      cursor: pointer;
    } 
    .color-theme{
      color:#03a9f4;
    } 
    .pos-a{
      position: absolute;
    }
    .nameDiv {
      display: inline-block;
      width: 200px;
      border: 2px solid #03a9f4;
      border-radius: 6px;
      // padding: 8px 10px;
      padding-left:15px;
      height:35px;
      line-height: 32px;
      margin-left: 70px;
      position: relative;
    }
  `]
})


export class BuserWFComp implements OnInit{

  private service: BuserWFCompService;
  public viewData: BuserWFCompViewData;

  @Input() wFDataWraper:WFDataWraper;
  public buserWFCompData:BuserWFCompData;

  constructor(private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserCacheMgr:BUserCacheMgr,
              private leaguerWFMgr:LeaguerWFMgr,
              private wfDataWraperMgr:WFDataWraperMgr,
              private matDialog: MatDialog,
){
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new BuserWFCompService(this.storeClerkInfoSynDataHolder,this.buserCacheMgr,this.leaguerWFMgr);
  }

  ngOnInit(): void {
    this.viewData = new BuserWFCompViewData();
    this.service.initViewData((viewDataP:BuserWFCompViewData) =>{
      if(viewDataP){
        this.viewData = viewDataP;
      }else{
        AppUtils.showError("提示","加载数据失败");
      }
    });
  }

  async ngOnChanges(){
    if(this.wFDataWraper){
      this.buserWFCompData = this.wFDataWraper.getBuserWFCompData();
    }
  }



  /**选择跟进人员模态框*/
  selectClerk(event):void{
    event.stopPropagation();
    let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
    if(!AppUtils.isNullObj(selectLeaguer) && !AppUtils.isNullOrWhiteSpace(selectLeaguer.id)){
      const selectClerkModal = ZmModalMgr.getInstance().newModal(BuserWFPopup,null,null);
      let data:BuserWFPopupViewData = BuserWFPopupViewData.fromParentComp(this.viewData);
      selectClerkModal.componentInstance.data = data;
      selectClerkModal.componentInstance.callBack = this.selectFollowClerk.bind(this);
    }else{
      AppUtils.showWarn("提示","请选择会员");
    }
  }

  /**选择跟进人员回调*/
  selectFollowClerk(clerk:FollowClerk){
    this.wFDataWraper.getBuserWFCompData().selectFollowClerk = clerk;
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

  /**
   * 设置工作流会员信息
   */
  // updateLeaguerWF(){
  //   this.service.updateLeaguerWF(this.wFDataWraper,(success:boolean) =>{
  //     this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  //     if(success){
  //       AppUtils.showSuccess("提示","设置跟进人员成功");
  //     }else{
  //       AppUtils.showError("提示","设置跟进人员失败");
  //     }
  //   })
  // }


}

export class BuserWFCompService{

  constructor(private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserCacheMgr:BUserCacheMgr,
              private leaguerWFMgr:LeaguerWFMgr){}

  /**
   * 初始化页面数据
   * @param callback
   */
  public async initViewData(callback:(viewDataP:BuserWFCompViewData) => void){
      let viewDataTmp = new BuserWFCompViewData();
      //请求storeClerkInfo
      //请求所有员工信息
      let storeId = SessionUtil.getInstance().getStoreId();
      let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
      let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
      let clerkInfoMap = storeClerkInfo.getValidClerkMap();
      viewDataTmp.clerkMap = storeClerkInfo.getValidClerkMap();
      viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

      let clerkIdArray = clerkInfoMap.keys();
      let buserMap = await this.buserCacheMgr.getList(clerkIdArray);
      viewDataTmp.buserMap = buserMap;

      //组装跟进人员list
      viewDataTmp.followClerkMap = this.buildClerkMap(clerkIdArray,viewDataTmp);
      viewDataTmp.clerkList = viewDataTmp.followClerkMap.values();
      callback(viewDataTmp);
  }

  /**组装员工Map*/
  private buildClerkMap(clerkIdArray,viewDataTmp){
    let followClerkMap:ZmMap<FollowClerk> = new ZmMap<FollowClerk>();
    for(let i=0;i<clerkIdArray.length;i++){
      let followClerk = new FollowClerk();
      followClerk.id = clerkIdArray[i];
      let user = viewDataTmp.buserMap.get(clerkIdArray[i]);
      if(user){
        followClerk.name = user.name;
        followClerk.phone = user.phone;
      }
      followClerkMap.put(followClerk.id,followClerk);
    }
    return followClerkMap;
  }


  /**
   * 设置、修改会员信息
   */
  // public updateLeaguerWF(wFDataWraper,callback:(successP:boolean) => void){
  //   let updateForm = new LeaguerInfoForm();
  //   updateForm.leaguerId = wFDataWraper.getCuserWFCompData().selectLeaguer.id;
  //   updateForm.followUserId = wFDataWraper.getBuserWFCompData().selectFollowClerk.id;
  //   let leaguerId = wFDataWraper.getCuserWFCompData().selectLeaguer.id;
  //   if(wFDataWraper.getWorkFlowData()){
  //     let workFlowId = wFDataWraper.getWorkFlowData().id;
  //     this.leaguerWFMgr.updateLeaguerWF(workFlowId,leaguerId,updateForm).then((success) =>{
  //       callback(success);
  //     })
  //   }
  //
  // }


}

export class BuserWFCompViewData{
  public buserMap:ZmMap<BUser>;
  public clerkMap:ZmMap<ClerkInfo>;
  public roleMap:ZmMap<StoreAdminRole>;

  //选中的员工
  public followClerkMap:ZmMap<FollowClerk> = new ZmMap<FollowClerk>();
  public clerkList:Array<FollowClerk> = new Array<FollowClerk>();

}

//对应跟进人员bean
export class FollowClerk{
  public id:string;
  public name:string;
  public phone:string;
}


