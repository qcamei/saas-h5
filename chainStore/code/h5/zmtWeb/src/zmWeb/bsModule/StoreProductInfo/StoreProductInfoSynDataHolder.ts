import {Injectable} from "@angular/core";
import {BUserMgr} from "../buser/BUserMgr";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {StoreProductInfo} from "./data/StoreProductInfo";
import {ProductInfo} from "./data/ProductInfo";
import {StoreProductInfoMgr} from "./StoreProductInfoMgr";




@Injectable()
export class StoreProductInfoSynDataHolder {

  private constructorT: {new(): StoreProductInfo;};
  private buserMgr: BUserMgr;


  constructor(private storePrdMgr: StoreProductInfoMgr) {
  }

  private synType: DataSynType = DataSynType.StoreProductInfo;

  public  getData(targetId: string): Promise<StoreProductInfo> {
    let dataHolder = this;
    return new Promise<StoreProductInfo>(resolve => {

      let target: StoreProductInfo = DataSynCtrl.Instance.get(StoreProductInfo, this.synType, targetId);
      if (target == null) {

        this.storePrdMgr.getStoreProductInfo(targetId).then(
          function (storePrd) {
            if (storePrd != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storePrd));
            }
            resolve(storePrd);
          });
      } else {
        resolve(target);
      }
    });
  }

  public newDataSynItem(storePrd: StoreProductInfo): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storePrd.id;
    dataSynVer.ver = storePrd.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storePrd);
    dataSynItem.obj = storePrd;

    return dataSynItem;
  }

  public async getProductInfo(storeId:string, proId:string):Promise<ProductInfo>{
    let prdInfoList:Array<ProductInfo> = await this.getProductInfoList(storeId);
    let targetPrd:ProductInfo = null;
    prdInfoList.forEach((prdInfoTmp:ProductInfo, index: number, array:ProductInfo[]) =>{
      if(proId == prdInfoTmp.id){ //过滤
        targetPrd = prdInfoTmp;
        //todo forEach break
      }
    });
    return new Promise<ProductInfo>(resolve=>{
      resolve(targetPrd);
    });
  }


  public getProductInfoList(storeId): Promise<Array<ProductInfo>> {
    let storePrductInfoMap = null;

    return new Promise<Array<ProductInfo>>(resolve => {
      this.getData(storeId).then(
        function (storePrd) {

          let storePrdInfoList = new Array<ProductInfo>();
          if (storePrd != null) {
            storePrductInfoMap = storePrd.productInfoMap;
            for (var key in storePrductInfoMap) {
              storePrdInfoList.push(storePrductInfoMap[key]);
            }
          }
          resolve(storePrdInfoList);
        });
    });

  }

}





