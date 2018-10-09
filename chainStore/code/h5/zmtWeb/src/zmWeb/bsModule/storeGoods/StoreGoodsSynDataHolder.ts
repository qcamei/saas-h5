import {Injectable} from "@angular/core";
import {BUserMgr} from "../buser/BUserMgr";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {StoreGoods} from "./data/StoreGoods";
import {StoreGoodsMgr} from "./StoreGoodsMgr";
import {Goods} from "./data/Goods";

@Injectable()
export class StoreGoodsSynDataHolder {

  private constructorT: {new(): StoreGoods;};
  private buserMgr: BUserMgr;


  constructor(private storeGoodsMgr: StoreGoodsMgr) {
  }

  private synType: DataSynType = DataSynType.StoreGoods;

  public  getData(targetId: string): Promise<StoreGoods> {
    let dataHolder = this;
    return new Promise<StoreGoods>(resolve => {
      let target: StoreGoods = DataSynCtrl.Instance.get(StoreGoods, this.synType, targetId);
      if (target == null) {
        this.storeGoodsMgr.getStoreGoods(targetId).then(
          function (storeGoods) {
            if (storeGoods != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storeGoods));
            }
            resolve(storeGoods);
          });
      } else {
        resolve(target);
      }
    });
  }

  public newDataSynItem(storeGoods: StoreGoods): DataSynItem {
    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storeGoods.id.toString();
    dataSynVer.ver = storeGoods.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storeGoods);
    dataSynItem.obj = storeGoods;

    return dataSynItem;
  }

  public async getGoods(storeId:string, goodsId:string):Promise<Goods>{
    let goodsList:Array<Goods> = await this.getGoodsList(storeId);
    let targetGoods:Goods = null;
    goodsList.forEach((goodsTmp:Goods, index: number, array:Goods[]) =>{
      if(goodsId == goodsTmp.id){ //过滤
        targetGoods = goodsTmp;
        //todo forEach break
      }
    });
    return new Promise<Goods>(resolve=>{
      resolve(targetGoods);
    });
  }

  public getGoodsList(storeId): Promise<Array<Goods>> {
    let storeGoodsMap = null;

    return new Promise<Array<Goods>>(resolve => {
      this.getData(storeId).then(
        function (storeGoods) {

          let storeGoodsList = new Array<Goods>();
          if (storeGoods != null) {
            storeGoodsMap = storeGoods.goodsMap;
            for (var key in storeGoodsMap) {
              storeGoodsList.push(storeGoodsMap[key]);
            }
          }
          resolve(storeGoodsList);
        });
    });

  }
}





