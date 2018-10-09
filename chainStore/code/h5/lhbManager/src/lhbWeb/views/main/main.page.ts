import {Component, OnInit, OnDestroy, ChangeDetectorRef,ChangeDetectionStrategy} from '@angular/core';
import {SessionUtil} from "../../comModule/SessionUtil";
import {AppUtils} from "../../comModule/AppUtils";
import {Router} from "@angular/router";
import {MainViewDataMgr} from "./mainViewDataMgr";
import {MainHeaderCompViewData} from "./head/main.header";
import {OPUser} from "../../bsModule/opUser/apiData/OPUser";
import {OPUserMgr} from "../../bsModule/opUser/OPUserMgr";

@Component({
  template: `
    <zmt-main-layout [data]="headerData">
      <router-outlet></router-outlet>
    </zmt-main-layout>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPage implements OnInit,OnDestroy{

  private viewDataSub:any;
  private viewDataChangedSub:any;
  private service:MainService;
  public viewData:MainViewData = new MainViewData();

  public headerData:MainHeaderCompViewData = MainHeaderCompViewData.fromComp(this.viewData);

  constructor(
              private opuserMgr:OPUserMgr,
              private mainViewDataMgr:MainViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private router: Router) {
    this.service = new MainService(this.opuserMgr,this.mainViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.mainViewDataMgr.subscribeMainVD((viewDataP:MainViewData) => {
      if(viewDataP){
        this.viewData = viewDataP;
        this.headerData = MainHeaderCompViewData.fromComp(viewDataP);
        this.cdRef.markForCheck();
      }
    });
    this.viewDataChangedSub = this.mainViewDataMgr.subscribeMainDataChangedVD(() => {
      this.service.initViewData();
    });

    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    if(!AppUtils.isNullObj(this.viewDataChangedSub)){
      this.viewDataChangedSub.unsubscribe();
    }

  }

}

export class MainService {

  constructor(private opuserMgr:OPUserMgr,
              private mainViewDataMgr: MainViewDataMgr) {
  }

  public initViewData() {
    this.buildViewData((viewDataP: MainViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP) {
    this.mainViewDataMgr.setMainViewData(viewDataP);
  }


  private async buildViewData(callback: (viewDataP: MainViewData) => void) {
    let viewDataTmp: MainViewData = new MainViewData();
    let opuserId = SessionUtil.getInstance().getOPUserId();
    let opuser:OPUser = await this.opuserMgr.get(opuserId);
    viewDataTmp.userName = opuser.name;
    if(opuser.headImg){
      viewDataTmp.imgUrl = SessionUtil.getInstance().getImgPreUrl()+opuser.headImg;
    }
    callback(viewDataTmp);
  }

}

export class MainViewData{

  public userName:string = "";
  public imgUrl:string = "assets/images/man.png";

  constructor(){
  }
}


