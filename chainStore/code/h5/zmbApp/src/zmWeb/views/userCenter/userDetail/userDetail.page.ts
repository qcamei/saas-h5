import {Component, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {IonicPage, NavParams, ViewController} from "ionic-angular";
import {AppUtils} from "../../../comModule/AppUtils";
import {AlertUtils} from "../../zmComUtils/AlertUtils";
import {AppCfg} from "../../../comModule/AppCfg";
import {WxMediaUtil} from "../../zmComUtils/WxMediaUtil";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {UserDetailViewData} from "./userDetailViewData";
import {UserDetailService} from "./userDetailService";
import {UserDetailViewDataMgr} from "./userDetailViewDataMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {UpdateInfoData} from "../../../bsModule/buser/apiData/UpdateInfoData";

@IonicPage({
  name: "userDetail",
  segment: 'userDetail'
})

@Component({
  template: `
    <!--<zm-modal-header title="个人信息" [cancel]="modalCtrl.cancelFunc(viewData)"></zm-modal-header>-->
    <zm-page-header title="个人信息"></zm-page-header>
    <zm-page-content [noRefresh]="true">
      <zm-info-list-picture [imgeTitle]=" '头像' " [path]="viewData.imgUrl" (click)="setHeadImg()" detail-push></zm-info-list-picture>
      <zmb-user-detail-item [title]=" '手机号码' " [value]="viewData.buser.phone"></zmb-user-detail-item>
      <zmb-user-detail-item [title]=" '姓名' " [value]="viewData.buser.name" (onItemClick)="setName()" detail-push></zmb-user-detail-item>
      <zmb-user-detail-item [title]=" '年龄' " [value]="viewData.buser.age" (onItemClick)="setAge()"></zmb-user-detail-item>
      <zmb-gender-select-item  zmk-item-sm [title]=" '性别' " [(genderVD)]="viewData.buser.gender" (onModelChange)="setGander($event)"></zmb-gender-select-item>
      <zmb-user-detail-item [title]=" '修改密码' " (onItemClick)="goChangePasswordPage()"></zmb-user-detail-item>
      <!--<zm-btn-sub [name]=" '修改密码' " (zmbtnClick)="goChangePasswordPage()"></zm-btn-sub>-->
    </zm-page-content>
  `
})
export class UserDetailPage implements OnDestroy {

  private service: UserDetailService;
  private viewDataSub: any;
  public viewData: UserDetailViewData = new UserDetailViewData();
  public modalCtrl:ModalCtrl;

  constructor(private cdRef: ChangeDetectorRef,
              public navParams: NavParams,
              private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    this.service = new UserDetailService();
    let initData = new UserDetailViewData();
    this.viewDataSub = UserDetailViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: UserDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    WxMediaUtil.getInstance().init();
  }

  ionViewDidEnter() {
    this.service.initViewData();
  }

  ngOnDestroy() {

  }

  goChangePasswordPage(){
    // this.modalCtrl.dismiss(null);
    AppRouter.getInstance().goChangePasswordPage(this.viewData.buser);
  }

  setHeadImg() {
    WxMediaUtil.getInstance().uploadImg(this.updateHeadImg.bind(this));
  }

  /**
   * 上传图片回调
   * @param imgArr
   */
  private updateHeadImg(imgArr: Array<string>) {
    if (imgArr && imgArr.length > 0) {
      this.viewData.imgUrl = AppCfg.getInstance().getImgPreUrl() + imgArr[0];
      //设置上传图片url
      this.viewData.buser.headImg = imgArr[0];
      this.updateBuserInfo(this.viewData);
    }
  }

  setName() {
    AlertUtils.getInstance().showInputConfirm(
      '设置名字',
      this.viewData.buser.name,
      '请输入新的名字',
      this.updateName.bind(this),
      null);
  }

  private updateName(value) {
    this.viewData.buser.name = value;
    this.updateBuserInfo(this.viewData);
  }

  setAge(){
    AlertUtils.getInstance().showInputConfirm(
      '设置年龄',
      this.viewData.buser.age.toString(),
      '请输入新的年龄',
      this.updateAge.bind(this),
      null);
  }

  private updateAge(value) {
    if(!AppUtils.isPositiveInt(value)){
      AppUtils.showWarn("","年龄只能为大于0的整数");
      return;
    }
    this.viewData.buser.age = value;
    this.updateBuserInfo(this.viewData);
  }

  setGander(gender){
    this.viewData.buser.gender = gender;
    this.updateBuserInfo(this.viewData);
  }

  private updateBuserInfo(viewDataP: UserDetailViewData){
    let buserUpdateInfoData: UpdateInfoData = new UpdateInfoData();
    AppUtils.copy(buserUpdateInfoData, viewDataP.buser);
    buserUpdateInfoData.buserId = viewDataP.buser.id;
    this.service.updateBUser(buserUpdateInfoData).then((success) => {
      if (success) {
        AppUtils.showSuccess("提示", "修改成功");
        this.service.initViewData();
      } else {
        AppUtils.showError("提示", "修改失败");
      }
    });
  }

}




