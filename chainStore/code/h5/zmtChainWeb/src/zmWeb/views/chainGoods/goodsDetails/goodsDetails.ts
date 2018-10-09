import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ChainGoodsViewDataMgr} from '../ChainGoodsViewDataMgr';
import {SessionUtil} from '../../../comModule/session/SessionUtil';
import {AppUtils, ZmMap} from '../../../comModule/AppUtils';
import {ChainGoods} from '../../../bsModule/chainGoods/data/ChainGoods';
import {Constants} from "../../common/Util/Constants";
import {GoodsType} from "../../../bsModule/chainGoods/data/GoodsType";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChainGoodsSynDataHolder} from "../../../bsModule/chainGoods/chainGoodsSynDataHolder";
import {GoodsDetail} from "../../../bsModule/chainGoods/data/GoodsDetail";
import {GoodsDetailCacheDataHolder} from "../../../bsModule/chainGoods/goodsDetailCacheSynHolder";
import {Store} from "../../../bsModule/store/data/Store";
import {StoreMgr} from "../../../bsModule/store/storeMgr";

@Component({
  selector: 'goodsDetails',
  templateUrl: 'goodsDetails.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoodsDetails implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: ChainGoodsDetailService;
  public viewData: ChainGoodsDetailViewData;

  constructor(private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new ChainGoodsDetailService(
      this.chainGoodsViewDataMgr,
      this.chainGoodsSynDataHolder,
      this.goodsDetailCacheDataHolder,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainGoodsViewDataMgr.subscribeChainGoodsDetailVD((viewDataP: ChainGoodsDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let goodsId = params['goodsId'];
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

  goEditPage(goodsDetailId) {
    AppRouter.goEditGoods(goodsDetailId)
  }
}


export class ChainGoodsDetailViewData {
  goods: GoodsDetail = new GoodsDetail();
  goodsTypeMap: ZmMap<GoodsType>;
  defaultImg: string = Constants.GOODS_DEFAULT_IMG;
  applyStoreName:string;
}


class ChainGoodsDetailService {

  constructor(private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(goodsId: number): void {
    this.chainGoodsViewDataMgr.setChainGoodsDetailViewData(new ChainGoodsDetailViewData());

    this.buildViewData(goodsId).then((viewDataTmp: ChainGoodsDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: ChainGoodsDetailViewData) {
    this.chainGoodsViewDataMgr.setChainGoodsDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId:string
   * @param goodsId:number
   * @returns Promise<ChainGoodsDetailViewData>
   */
  public async buildViewData(goodsId: number): Promise<ChainGoodsDetailViewData> {
    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: ChainGoodsDetailViewData = new ChainGoodsDetailViewData();
    let chainGoods: ChainGoods = await this.chainGoodsSynDataHolder.getData(chainId);
    let targetGoods: GoodsDetail = await this.goodsDetailCacheDataHolder.getData(goodsId.toString());
    if (chainGoods) {
      viewDataTmp.goodsTypeMap = chainGoods.getAllGoodsTypeMap();
    }
    if (targetGoods) {
      viewDataTmp.goods = targetGoods;
      viewDataTmp.applyStoreName = await this.getApplyStoreNames(viewDataTmp.goods.applyStoreIds);
    }

    return new Promise<ChainGoodsDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


  private async getApplyStoreNames(applyStoreIds:Array<string>){
    let chainId = SessionUtil.getInstance().getChainId();
    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    let storeList: Array<Store> = new Array<Store>();
    if (pageResp) {
      storeList = pageResp.list;
    }
    let storeListTmp = new Array<Store>();
    if (applyStoreIds) {
      for (let id of applyStoreIds) {
        storeList.forEach((item) => {
          if (item.id == id) {
            storeListTmp.push(item);
          }
        });
      }
    }
    let arr = new Array<string>();
    arr = storeListTmp.map((item) => {
      return item.name;
    });
    return arr.join("、");
  }


}
