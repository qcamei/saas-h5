import {Component, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MyInfoService} from "./MyInfoService";
import {MyInfoViewData} from "./MyInfoViewData";
import {IonicPage, ViewController} from "ionic-angular";
import {MyInfoViewDataMgr} from "./MyInfoViewDataMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {CUserUpdateInfoApiData} from "../../../bsModule/cuser/apiData/CUserUpdateInfoApiData";
import {AppUtils} from "../../../comModule/AppUtils";
import {AlertUtils} from "../../zmComUtils/AlertUtils";
import {AppCfg} from "../../../comModule/AppCfg";
import {WxMediaUtil} from "../../zmComUtils/WxMediaUtil";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";

@IonicPage({
  name: "myInfo",
  segment: 'myInfo'
})

@Component({
  template: `
    <zm-modal-header title="个人信息" [cancel]="modalCtrl.cancelFunc(viewData)"></zm-modal-header>
    <zm-page-content [noRefresh]="true">
      <zm-info-list-picture [imgeTitle]=" '头像' " [path]="viewData.imgUrl" (click)="setHeadImg()"></zm-info-list-picture>
      <zm-list-item [listTitle]=" '姓名' " [listValue]="viewData.cuser.name" (click)="setName()"></zm-list-item>
      <zm-list-item [listTitle]=" '手机号' " [listValue]="viewData.cuser.phone"></zm-list-item>
      <div style="padding:30px 0">      
      <zm-btn-sub [name]=" '退出登录' " (zmbtnClick)="logout()"></zm-btn-sub>
    </div>
    </zm-page-content>
  `
})
export class MyInfoPage implements OnDestroy {

  private service: MyInfoService;
  private viewDataSub: any;
  public viewData: MyInfoViewData = new MyInfoViewData();
  public modalCtrl:ModalCtrl;

  constructor(private cdRef: ChangeDetectorRef,private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    this.service = new MyInfoService();
    let initData = new MyInfoViewData();
    this.viewDataSub = MyInfoViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: MyInfoViewData) => {
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

  logout() {
    this.modalCtrl.dismiss(null);
    SessionUtil.getInstance().onLogout();
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
      this.viewData.cuser.headImg = imgArr[0];
      this.updateCuserInfo(this.viewData);
    }
  }

  setName() {
    AlertUtils.getInstance().showInputConfirm(
      '设置名字',
      '请输入新的名字',
      this.updateName.bind(this),
      null);
  }

  private updateName(value) {
    this.viewData.cuser.name = value;
    this.updateCuserInfo(this.viewData);
  }

  private updateCuserInfo(viewDataP: MyInfoViewData){
    let cuserUpdateInfoData: CUserUpdateInfoApiData = new CUserUpdateInfoApiData();
    AppUtils.copy(cuserUpdateInfoData, viewDataP.cuser);
    this.service.updateCUser(cuserUpdateInfoData).then((success) => {
      if (success) {
        AppUtils.showSuccess("提示", "修改成功");
        this.service.initViewData();
      } else {
        AppUtils.showError("提示", "修改失败");
      }
    });
  }

}




