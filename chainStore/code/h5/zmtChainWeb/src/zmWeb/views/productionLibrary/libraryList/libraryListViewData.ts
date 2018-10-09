import {SellProduct} from "../../../bsModule/sellProduct/data/SellProduct";
import {SellProductQueryForm} from "../../../bsModule/sellProduct/apiData/SellProductQueryForm";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {Constants} from "../../common/Util/Constants";

export class LibraryListViewData {

  public productList:Array<SellProduct> = new Array<SellProduct>();
  public queryForm: SellProductQueryForm = new SellProductQueryForm();
  public state:number = Constants.DEFAULT_STATE_VALUE;
  public sellProductType:number = -1;

  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;
  public batchOp:number;

  //分配门店相关
  public storeList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds:Array<string> = new Array<string>();
}
