
import {Injectable} from "@angular/core";
import {ChainProductMgr} from "./chainProductMgr";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {ChainProduct} from "./data/ChainProduct";
import {AppUtils} from "../../comModule/AppUtils";

@Injectable()
export class ChainProductSynDataHolder {

  constructor(
    private chainProductMgr: ChainProductMgr
  ) {
  }

  private synType: DataSynType = DataSynType.ChainProduct;

  public  getData(targetId: string): Promise<ChainProduct> {
    let dataHolder = this;
    return new Promise<ChainProduct>(resolve => {

      let target: ChainProduct = DataSynCtrl.Instance.get(ChainProduct, this.synType, targetId);
      if (target == null) {

        this.chainProductMgr.getChainProduct(targetId).then(
          function (chainProduct) {
            if (chainProduct != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(chainProduct));
            }
            resolve(chainProduct);
          });
      } else {
        resolve(target);
      }
    });
  }

  public newDataSynItem(chainProduct: ChainProduct): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = chainProduct.id.toString();
    dataSynVer.ver = chainProduct.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(chainProduct);
    dataSynItem.obj = chainProduct;

    return dataSynItem;
  }

}





