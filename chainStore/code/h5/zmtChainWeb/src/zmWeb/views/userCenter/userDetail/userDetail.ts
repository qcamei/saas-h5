import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {UserCenterViewDataMgr} from "../userCenterViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {RadioItem} from "../../zmComp/form/ZmInputRadio";
import {MainViewDataMgr} from "../../main/MainViewDataMgr";
import {PermService} from "../../permService";
import {ChainUser} from "../../../bsModule/chainUser/data/ChainUser";
import {ChainUserMgr} from "../../../bsModule/chainUser/ChainUserMgr";
import {ChainUserSynDataHolder} from "../../../bsModule/chainUser/ChainUserSynDataHolder";
import {ChainUserUpdateInfoForm} from "../../../bsModule/chainUser/apiData/ChainUserUpdateInfoForm";

@Component({
  selector:'user-detail',
  templateUrl: 'userDetail.html',
  styleUrls: ['userDetail.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class UserDetailPage implements OnInit,OnDestroy{

  private viewDataSub:any;
  public viewData:UserDetailViewData;
  private service:UserDetailService;

  constructor(private chainUserMgr:ChainUserMgr,
              private chainUserSynDataHolder:ChainUserSynDataHolder,
              private userCenterViewDataMgr:UserCenterViewDataMgr,
              private permService:PermService,
              private cdRef:ChangeDetectorRef){
    this.service = new UserDetailService(this.chainUserMgr,this.chainUserSynDataHolder,this.userCenterViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.userCenterViewDataMgr.subscribeUserDetailVD((viewDataP:UserDetailViewData) =>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 页面点击事件 编辑
   */
  editUser(){
    this.viewData.isEdit = true;
  }

  /**
   * 页面点击事件 取消编辑
   */
  cancelEdit(){
    this.viewData.isEdit = false;
    this.service.initViewData();
  }

  /**
   * 页面点击事件 保存
   */
  public async updateUser(){
    let updateInfoData = this.getUpdateForm();

    if(AppUtils.isNullOrWhiteSpace(updateInfoData.name)){
      AppUtils.showWarn("提示","姓名不能为空");
    }else{
      AppUtils.showMask("加载中");
      let success = await this.service.updateUser(updateInfoData);
      if(success){
        this.service.initViewData();
        await this.permService.refreshPermData();
        AppUtils.closeMask();
        AppUtils.showSuccess("提示","修改成功");
        MainViewDataMgr.getInstance().notifyDataChanged();
      }else{
        AppUtils.closeMask();
        AppUtils.showError("提示","修改失败");
      }
    }
  }

  private getUpdateForm(){
    let updateInfoData = new ChainUserUpdateInfoForm();
    let buser = this.viewData.user;
    updateInfoData.id = buser.id;
    updateInfoData.name = AppUtils.trimBlank(buser.name);
    updateInfoData.headImg = buser.headImg;
    if(this.viewData.genderValue){
      updateInfoData.gender = this.viewData.genderValue.value;
    }
    return updateInfoData;
  }
}

export class UserDetailService{
  constructor(private chainUserMgr:ChainUserMgr,
              private chainUserSynDataHolder:ChainUserSynDataHolder,
              private userCenterViewDataMgr:UserCenterViewDataMgr){}

  public initViewData(){
    let viewDataTmp = new UserDetailViewData();
    this.userCenterViewDataMgr.setUserDetailViewData(viewDataTmp);

    this.buildViewData((viewData:UserDetailViewData) =>{
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:UserDetailViewData){
    this.userCenterViewDataMgr.setUserDetailViewData(viewDataP);
  }

  public async buildViewData(callback:(viewDataP:UserDetailViewData) =>void){
    let viewDataTmp = new UserDetailViewData();
    let userId = SessionUtil.getInstance().getUserId();
    let user:ChainUser = await this.chainUserSynDataHolder.getData(userId);
    viewDataTmp.user = user;
    if(user && user.gender){//性别
      viewDataTmp.genderRadioList.forEach((item)=>{
        if(item.value == user.gender){
          viewDataTmp.genderValue = item;
        }
      })
    }
    if(AppUtils.isNullObj(viewDataTmp.genderValue)){
      viewDataTmp.genderValue = new RadioItem("女",2);
    }
    callback(viewDataTmp);
  }

  /**
   * 修改用户信息
   * @param updateInfoData
   */
  public updateUser(updateInfoData:ChainUserUpdateInfoForm):Promise<boolean>{
    return this.chainUserMgr.updateInfo(updateInfoData.id,updateInfoData);
  }

}

export class UserDetailViewData{
  public genderRadioList = [new RadioItem("男",1),new RadioItem("女",2)];
  public genderValue:RadioItem;

  public user: ChainUser = new ChainUser();
  public isEdit:boolean = false;//是否编辑状态
}
