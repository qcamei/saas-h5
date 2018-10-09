 import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
 import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
 import {UserCenterViewDataMgr} from "../userCenterViewDataMgr";
 import {AppUtils} from "../../../comModule/AppUtils";
 import {SessionUtil} from "../../../comModule/session/SessionUtil";
 import {BUser} from "../../../bsModule/buser/apiData/BUser";
 import {UpdateInfoData} from "../../../bsModule/buser/apiData/UpdateInfoData";
 import {RadioItem} from "../../zmComp/form/ZmInputRadio";
 import {AppCfg} from "../../../comModule/AppCfg";
 import {MainViewDataMgr} from "../../main/MainViewDataMgr";
 import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
 import {PermService} from "../../permService";
 import {AppRouter} from "../../../comModule/AppRouter";

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

  constructor(private buserMgr:BUserMgr,
              private buserSynDataHolder:BUserSynDataHolder,
              private permService:PermService,
              private userCenterViewDataMgr:UserCenterViewDataMgr,
              private cdRef:ChangeDetectorRef){
    this.service = new UserDetailService(this.buserMgr,this.buserSynDataHolder,this.userCenterViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.userCenterViewDataMgr.subscribeUserDetailVD((viewDataP:UserDetailViewData) =>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 续费升级
   */
  goCharge(){
    AppRouter.goVipCharge();
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
   * 上传图片回调
   * @param imgArr
   */
  setImgUrl(imgArr: Array<string>) {
    if (imgArr && imgArr.length > 0){
      this.viewData.imgUrl = AppCfg.getInstance().getImgPreUrl() + imgArr[0];
      //设置上传图片url
      this.viewData.user.headImg = imgArr[0];
    }
  }

  /**
   * 页面点击事件 保存
   */
  async updateUser(){
    let buser = this.viewData.user;
    let updateInfoData = new UpdateInfoData();
    updateInfoData.buserId = buser.id;
    updateInfoData.name = AppUtils.trimBlank(buser.name);
    updateInfoData.headImg = buser.headImg;
    updateInfoData.gender = this.viewData.genderValue.value;
    updateInfoData.age = buser.age;
    updateInfoData.roleSet = buser.roleSet;
    if(AppUtils.isNullOrWhiteSpace(updateInfoData.name)){
      AppUtils.showWarn("提示","姓名不能为空");
    }else{
      AppUtils.showMask("加载中");
      let success = await this.service.updateUser(updateInfoData);
      if(success){
        this.service.initViewData();
        // await this.permService.refreshPermData();
        AppUtils.closeMask();
        AppUtils.showSuccess("提示","修改成功");
        MainViewDataMgr.getInstance().notifyDataChanged();
      }else{
        AppUtils.closeMask();
        AppUtils.showError("提示","修改失败");
      }
    }
  }
}

export class UserDetailService{
  constructor(private buserMgr:BUserMgr,
              private buserSynDataHolder:BUserSynDataHolder,
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
    let buser:BUser = await this.buserSynDataHolder.getData(userId);
    viewDataTmp.user = buser;
    if(buser && buser.headImg){
      viewDataTmp.imgUrl = AppCfg.getInstance().getImgPreUrl()+buser.headImg;
    }

    if(buser && buser.gender){//性别
      viewDataTmp.genderRadioList.forEach((item)=>{
        if(item.value == buser.gender){
          viewDataTmp.genderValue = item;
        }
      })
    }

    if(buser && buser.roleSet && AppUtils.arrayContains(buser.roleSet,"0")){
      viewDataTmp.isBoss = true;
    }

    //设置上传图片接口
    let storeId = SessionUtil.getInstance().getStoreId();
    let serviceAddress = AppCfg.getInstance().getServiceAddress();
    viewDataTmp.requestUrl = serviceAddress + "/img/saveImgs/img/buser/" + storeId;
    callback(viewDataTmp);
  }

  /**
   * 修改用户信息
   * @param updateInfoData
   */
  public updateUser(updateInfoData:UpdateInfoData):Promise<boolean>{
    return this.buserMgr.updateInfo(updateInfoData.buserId,updateInfoData);
  }

}

export class UserDetailViewData{
  public genderRadioList = [new RadioItem("男",1),new RadioItem("女",2)];
  public genderValue:RadioItem;

  public user: BUser = new BUser();
  public userSex: number = 0;
  public requestUrl: string;//上传图片请求url
  public imgUrl:string = "assets/images/head.png";

  public isBoss:boolean = false;

  public isEdit:boolean = false;//是否编辑状态
}
