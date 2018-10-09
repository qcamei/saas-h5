import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {StoreClerkInfoViewDataMgr} from "../StoreClerkInfoViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Store} from "../../../bsModule/store/apiData/Store";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {AppCfg} from "../../../comModule/AppCfg";
import {AppRouter} from "../../../comModule/AppRouter";

/**
 * 店员管理 员工加入
 */
@Component({
  selector:'add-clerk',
  templateUrl:'addClerk.html',
  styleUrls:['addClerk.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class AddClerkPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: AddClerkService;
  public viewData: AddClerkViewData;

  constructor(
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr,
              private storeSynDataHolder:StoreSynDataHolder,
              private cdRef: ChangeDetectorRef){
    this.service = new AddClerkService(this.storeClerkInfoViewDataMgr,this.storeSynDataHolder);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeClerkInfoViewDataMgr.subscribeAddClerkVD((viewDataP:AddClerkViewData) => {
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
   * 跳转审核名单
   */
  goFindClerk(){
    AppRouter.goFindClerk(1);
  }

}

export class AddClerkService{
  constructor(private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr,private storeSynDataHolder:StoreSynDataHolder){}

  public initViewData(){
    let viewDataTmp = new AddClerkViewData();
    this.storeClerkInfoViewDataMgr.setAddClerkViewData(viewDataTmp);

    this.buildViewData((viewData:AddClerkViewData) =>{
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewData
   */
  public handleViewData(viewData:AddClerkViewData){
    this.storeClerkInfoViewDataMgr.setAddClerkViewData(viewData);
  }

  private async buildViewData(callbackP:(viewData:AddClerkViewData) =>void) {
    let viewDataTmp = new AddClerkViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    let store: Store = await this.storeSynDataHolder.getData(storeId);
    if (store && store.joinStoreImg) {
      viewDataTmp.joinStoreImg = AppCfg.getInstance().getImgPreUrl() + store.joinStoreImg;
    }
    this.storeClerkInfoViewDataMgr.setAddClerkViewData(viewDataTmp);
    callbackP(viewDataTmp);
  }

}

export class AddClerkViewData{
  public joinStoreImg:string = "http://via.placeholder.com/350x150";
}
