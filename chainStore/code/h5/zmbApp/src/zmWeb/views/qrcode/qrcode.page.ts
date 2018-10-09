import {Component,  ChangeDetectorRef} from "@angular/core";
import {IonicPage} from "ionic-angular";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {Store} from "../../bsModule/store/data/Store";
import {AppCfg} from "../../comModule/AppCfg";
import {QrcodeViewDataMgr} from "./qrcodeViewDataMgr";
import {AppUtils} from "../../comModule/AppUtils";


@IonicPage({
  name: "qrcodePage",
  segment: 'qrcodePage'
})
@Component({
  template: `
    <zm-page-header title="二维码"></zm-page-header>
    <zm-page-content>
        <zm-tabs-custom [tabList]="viewData.tabList" [(zmValue)]="viewData.selectedTab" (onChange)="switchTab()"></zm-tabs-custom>
        <div style="margin-top:50px;" fxLayout="row" fxLayoutAlign="center center">
          <img style="width: 60%; height: 60%" src="{{viewData.qrCodeImgUrl}}"/>
        </div>
        <zm-no-data *ngIf="viewData.loadingFinish&&viewData.qrCodeImgUrl==''"></zm-no-data>
    </zm-page-content>

    `,
  styles: [`

      `],
})

export class QrcodePage {

  public viewData: QrcodeViewData = new QrcodeViewData();
  private service: QrcodeService;

  constructor(private cdRef: ChangeDetectorRef) {
    QrcodeViewDataMgr.getInstance().onDataChanged(new QrcodeViewData(),(viewDataP:QrcodeViewData) => {
      if(viewDataP){
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    });
    this.service = new QrcodeService();
  }

  ionViewWillEnter() {
    this.service.buildViewData(this.viewData);
  }

  /**
   * 切换tab
   */
  switchTab(){
    this.service.buildViewData(this.viewData);
  }


}

export class QrcodeService{

  constructor(){}

  public async buildViewData(viewDataTmp:QrcodeViewData){
    viewDataTmp.loadingFinish = false;
    let store:Store= await SessionUtil.getInstance().getCurStore();
    if(!AppUtils.isNullObj(store) && !AppUtils.isNullObj(viewDataTmp.selectedTab)){
      if(viewDataTmp.selectedTab.value == 0){
        viewDataTmp.qrCodeImgUrl = AppCfg.getInstance().getImgPreUrl() + store.joinStoreImg;
      }else{
        viewDataTmp.qrCodeImgUrl = AppCfg.getInstance().getImgPreUrl() + store.acodeImg;
      }
    }
    viewDataTmp.loadingFinish = true;
    QrcodeViewDataMgr.getInstance().setData(viewDataTmp);
  }
}

export class QrcodeViewData{
  public tabList = [{name:'店铺',value:0},{name:'小程序',value:1}];
  public selectedTab = this.tabList[0];
  public qrCodeImgUrl = '';
  public loadingFinish:boolean = false;
}



