import {Component, OnInit, OnDestroy, ChangeDetectorRef,ChangeDetectionStrategy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {StoreGoodsViewDataMgr} from '../StoreGoodsViewDataMgr';
import {SessionUtil} from '../../../comModule/session/SessionUtil';
import {AppUtils, ZmMap} from '../../../comModule/AppUtils';
import {StoreGoods} from '../../../bsModule/storeGoods/data/StoreGoods';
import {Constants} from "../../common/Util/Constants";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {GoodsDetail} from "../../../bsModule/goodsDetail/data/GoodsDetail";
import {
  GoodsDetailCacheDataHolder
} from "../../../bsModule/goodsDetail/GoodsDetailCacheDataHolder";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {AppRouter} from "../../../comModule/AppRouter";

@Component({
  selector:'goodsDetails',
  templateUrl:'goodsDetails.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoodsDetails implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: StoreGoodsDetailService;
  public  viewData: StoreGoodsDetailViewData;

  constructor(
    private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
    private storeGoodsViewDataMgr: StoreGoodsViewDataMgr,
    private goodsDetailCacheDataHolder:GoodsDetailCacheDataHolder,
    private cdRef: ChangeDetectorRef,
    public route: ActivatedRoute) {
    this.service = new StoreGoodsDetailService(
      this.storeGoodsViewDataMgr,
      this.storeGoodsSynDataHolder,
      this.goodsDetailCacheDataHolder);
  }

  ngOnInit() {
    this.viewDataSub = this.storeGoodsViewDataMgr.subscribeStoreGoodsDetailVD((viewDataP: StoreGoodsDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let goodsId = params['goodsId'];
      console.log("goodsId: "+goodsId);
      this.service.initViewData(goodsId);
    });

  }

  ngOnDestroy() {
    if (AppUtils.isNullObj(this.paramsSub)) {
      this.paramsSub.unsubscribe();  //反订阅 防止内存泄露
    }
    if (AppUtils.isNullObj(this.paramsSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  goEditPage(goodsDetailId){
    AppRouter.goEditGoods(goodsDetailId)
  }
}


export class StoreGoodsDetailViewData {
  goods:GoodsDetail = new GoodsDetail();
  goodsTypeMap:ZmMap<GoodsType>;
  defaultImg:string = Constants.GOODS_DEFAULT_IMG;
}





class StoreGoodsDetailService {

  constructor(private storeGoodsViewDataMgr: StoreGoodsViewDataMgr,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private goodsDetailCacheDataHolder:GoodsDetailCacheDataHolder,
  ) {
  }

  public initViewData(goodsId:number): void {
    this.storeGoodsViewDataMgr.setStoreGoodsDetailViewData(new StoreGoodsDetailViewData());

    this.buildViewData( goodsId).then((viewDataTmp:StoreGoodsDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: StoreGoodsDetailViewData) {
    this.storeGoodsViewDataMgr.setStoreGoodsDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId:string
   * @param goodsId:number
   * @returns Promise<StoreGoodsDetailViewData>
   */
  public async buildViewData(goodsId:number):Promise<StoreGoodsDetailViewData>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: StoreGoodsDetailViewData = new StoreGoodsDetailViewData();
    let storeGoods:StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    let targetGoods: GoodsDetail = await this.goodsDetailCacheDataHolder.getData(goodsId.toString());
    if(storeGoods){
      viewDataTmp.goodsTypeMap = storeGoods.getGoodsTypeMap();
    }
    if(targetGoods){
      viewDataTmp.goods = targetGoods;
    }

    return new Promise<StoreGoodsDetailViewData>(resolve=>{
      resolve(viewDataTmp);
    });
  }


}
