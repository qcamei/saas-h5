import {StoreListService, StoreListViewData} from "../chain/storeList/storeList";
import {AppUtils} from "../../comModule/AppUtils";
import {ChainMgr} from "../../bsModule/chain/ChainMgr";
import {ChainSynDataHolder} from "../../bsModule/chain/ChainSynDataHolder";
import {ChainViewDataMgr} from "../chain/ChainViewDataMgr";
import {StoreMgr} from "../../bsModule/store/storeMgr";
import {StoreConfigMgr} from "../../bsModule/storeConfig/StoreConfigMgr";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {StoreVD} from "../chainPackageProject/packageProject/addPackage/addPackage";
import {StoreDataShareData} from "../../bsModule/storeConfig/StoreDataShareData";
import {ShareEnum} from "../../bsModule/storeConfig/ShareEnum";

export class StoreCacheUtils {

  private static Instance;


  public static getInstance(chainViewDataMgr: ChainViewDataMgr,
                            chainMgr: ChainMgr,
                            chainSynDataHolder: ChainSynDataHolder,
                            storeMgr: StoreMgr,
                            storeConfigMgr: StoreConfigMgr): StoreCacheUtils {
    if (AppUtils.isNullObj(this.Instance)) {
      this.Instance = new StoreCacheUtils(chainViewDataMgr, chainMgr, chainSynDataHolder, storeMgr, storeConfigMgr);
    }
    return this.Instance;
  }

  storeListViewData: StoreListViewData;//缓存店铺列表
  private service: StoreListService;

  constructor(private chainViewDataMgr: ChainViewDataMgr,
              private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private storeMgr: StoreMgr,
              private storeConfigMgr: StoreConfigMgr) {
    this.initStoreListService();
  }


  private initStoreListService() {
    this.service = new StoreListService(
      this.chainViewDataMgr,
      this.chainMgr,
      this.chainSynDataHolder,
      this.storeMgr,
    );
  }


  public getStoreListViewData(callback) {
    if (AppUtils.isNullObj(this.storeListViewData)) {
      this.service.buildViewData(async storeListViewData => {
        this.storeListViewData = storeListViewData;
        // let storeIdArr: Array<string> = [];
        // storeListViewData.storeList.map((storeVD: StoreVD) => {
        //   if (!storeVD.isChain) {
        //     storeIdArr.push(storeVD.id);
        //   }
        // });
        // let storeIds: string = storeIdArr.join(",");
        // let ret: Array<StoreDataShareData> = await this.storeConfigMgr.getStoreDataShareDataList(SessionUtil.getInstance().getChainId(), storeIds);
        // storeListViewData.storeList.map((storeVD: StoreVD) => {
        //   if (!storeVD.isChain) {
        //     storeIdArr.push(storeVD.id);
        //     if (!AppUtils.isNullObj(ret)) {
        //       for (let i: number = 0; i < ret.length; i++) {
        //         if (storeVD.id == ret[i].storeId) {
        //           storeVD.dataPermission = ret[i].shareType == ShareEnum.SHARE;
        //         }
        //       }
        //     }
        //   }
        // });
        callback(this.storeListViewData);
      });
    } else {
      callback(this.storeListViewData);
    }
  }

  public static clear(): void {
    if (!AppUtils.isNullObj(this.Instance)) {
      this.Instance.storeListViewData = null;
    }
  }

}


