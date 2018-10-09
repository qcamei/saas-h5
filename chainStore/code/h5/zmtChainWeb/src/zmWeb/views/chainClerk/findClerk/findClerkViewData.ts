import {ChainUserDto} from "../../../bsModule/chainUser/data/ChainUserDto";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {ChainUserQueryForm} from "../../../bsModule/chainUser/apiData/ChainUserQueryForm";
import {AdminRole} from "../../../bsModule/chainClerk/data/adminRole/AdminRole";

export class FindClerkViewData {

  public roleList: Array<AdminRole>;

  public chainClerkListShow: Array<ChainClerkData> = new Array<ChainClerkData>();
  public chainCurPage: number = 1;
  public chainRecordCount: number;

  public queryForm:ChainUserQueryForm = new ChainUserQueryForm();
  public isStoreClerk: number = -1;//CrossClerkEnum

  public loadingFinish: boolean = false;


  //分配相关
  public storeList: Array<StoreVD> = new Array<StoreVD>();

  public selectStoreList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds:Array<string> = new Array<string>();

}

export class ChainClerkData {
  id: number;
  name: string;
  gender: number;
  phone: string;
  roleNames: string;
  storeNames: string;
  storeCount: number;
  crossClerk: number;//CrossClerkEnum
  applyStoreIds:Array<string>;

  checked: boolean = false;

  constructor() {
  }

  public static fromChainUserDto(chainUserDto:ChainUserDto){
    let chainClerkData = new ChainClerkData();
    chainClerkData.id = chainUserDto.id;
    chainClerkData.gender = chainUserDto.gender;
    chainClerkData.name = chainUserDto.name;
    chainClerkData.phone = chainUserDto.phone;
    chainClerkData.crossClerk = chainUserDto.crossClerk;
    if(chainUserDto.storeNames){
      chainClerkData.storeNames = chainUserDto.storeNames.join("、");
    }
    if(chainUserDto.storeIds){
      chainClerkData.applyStoreIds = chainUserDto.storeIds;
      chainClerkData.storeCount = chainUserDto.storeIds.length;
    }
    if(chainUserDto.adminRoles){
      let roleNameArr:Array<string> = chainUserDto.adminRoles.map((item)=>{return item.name});
      chainClerkData.roleNames = roleNameArr.join("、");
    }
    return chainClerkData;
  }
}
