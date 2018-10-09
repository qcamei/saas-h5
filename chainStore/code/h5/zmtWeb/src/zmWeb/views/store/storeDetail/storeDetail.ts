import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {Store} from "../../../bsModule/store/apiData/Store";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreViewDataMgr} from "../StoreViewDataMgr";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../comModule/AppUtils";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";

/**
 * 店铺管理首页 查看店铺
 */
@Component({
  selector:'store-detail',
  templateUrl:'storeDetail.html',
  styleUrls:['storeDetail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreDetailPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramSub:any;
  private service: StoreDetailService;
  public viewData: StoreDetailViewData;

  constructor(private storeMgr:StoreMgr,
              private storeSynDataHolder:StoreSynDataHolder,
              private storeViewDataMgr:StoreViewDataMgr,
              private cdRef:ChangeDetectorRef,
              private route:ActivatedRoute){
    this.service = new StoreDetailService(this.storeMgr,this.storeSynDataHolder,this.storeViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeViewDataMgr.subscribeStoreDetailVD((viewDataP:StoreDetailViewData) =>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.paramSub = this.route.params.subscribe(params =>{
      let storeId = params['storeId'];
      this.service.initViewData(storeId);
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    this.paramSub.unsubscribe();
  }
}

export class StoreDetailService{
  constructor(private storeMgr:StoreMgr,private storeSynDataHolder:StoreSynDataHolder,private storeViewDataMgr:StoreViewDataMgr){}

  public initViewData(storeId): void{
    this.storeViewDataMgr.setStoreDetailViewData(new StoreDetailViewData());

    this.buildViewData(storeId,(viewDataP:StoreDetailViewData) =>{
      this.handleViewData(viewDataP);
    })
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:StoreDetailViewData){
    this.storeViewDataMgr.setStoreDetailViewData(viewDataP);
  }

  /**
   * 请求店铺信息 组装viewData
   * @param storeId
   * @param callbackP
   */
  public buildViewData(storeId,callbackP:(viewDataP:StoreDetailViewData) => void){
    let viewDataTmp:StoreDetailViewData = new StoreDetailViewData();
    // this.storeMgr.getStore(storeId).then((store:Store) =>{
    this.storeSynDataHolder.getData(storeId).then((store:Store) =>{
      if(!AppUtils.isNullObj(store)){
        viewDataTmp.store = store;
      }else{
        AppUtils.showError("提示","加载失败");
      }
      callbackP(viewDataTmp);
    }).catch(error => {
      AppUtils.showError("提示","加载失败");
    })
  }

}

export class StoreDetailViewData{
  public store:Store = new Store();
}
