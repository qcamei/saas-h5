import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ChainViewDataMgr} from "../ChainViewDataMgr";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../comModule/AppUtils";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {Chain} from "../../../bsModule/chain/data/Chain";
import {Store} from "../../../bsModule/store/data/Store";
import {StoreMgr} from "../../../bsModule/store/storeMgr";

/**
 * 店铺管理首页 查看店铺
 */
@Component({
  selector:'chain-detail',
  templateUrl:'chainDetail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChainDetailPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramSub:any;
  private service: ChainDetailService;
  public viewData: ChainDetailViewData;

  constructor(
              private chainSynDataHolder:ChainSynDataHolder,
              private chainViewDataMgr:ChainViewDataMgr,
              private storeMgr:StoreMgr,
              private cdRef:ChangeDetectorRef,
              private route:ActivatedRoute){
    this.service = new ChainDetailService(this.chainSynDataHolder,this.chainViewDataMgr,this.storeMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chainViewDataMgr.subscribeChainDetailVD((viewDataP:ChainDetailViewData) =>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramSub = this.route.params.subscribe(params =>{
      let chainId = params['chainId'];
      let storeId = params['storeId'];
      this.service.initViewData(chainId,storeId);
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    this.paramSub.unsubscribe();
  }
}

export class ChainDetailService{
  constructor(
              private chainSynDataHolder:ChainSynDataHolder,
              private chainViewDataMgr:ChainViewDataMgr,
              private storeMgr:StoreMgr){}

  public initViewData(chainId,storeId): void{
    this.chainViewDataMgr.setChainDetailViewData(new ChainDetailViewData());

    this.buildViewData(chainId,storeId,(viewDataP:ChainDetailViewData) =>{
      this.handleViewData(viewDataP);
    })
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:ChainDetailViewData){
    this.chainViewDataMgr.setChainDetailViewData(viewDataP);
  }

  /**
   * 请求店铺信息 组装viewData
   * @param chainId
   * @param callbackP
   */
  public async buildViewData(chainId,storeId,callbackP:(viewDataP:ChainDetailViewData) => void){
    let viewDataTmp:ChainDetailViewData = new ChainDetailViewData();
    if(chainId!="null"){
      let chain:Chain = await this.chainSynDataHolder.getData(chainId);
      if(!AppUtils.isNullObj(chain)){
        viewDataTmp.chain = chain;
      }
    }

    if(storeId!="null"){
      let store:Store = await this.storeMgr.getStore(storeId);
      if(!AppUtils.isNullObj(store)){
        viewDataTmp.storeDetail = store;
      }
    }
    callbackP(viewDataTmp);
  }

}

export class ChainDetailViewData{
  public chain:Chain ;
  public storeDetail:Store;
}
