import {IncomePayType} from "./IncomePayType";
import {AppUtils} from "../../../comModule/AppUtils";
import {EntityStateEnum} from "../../StoreProductInfo/data/EntityStateEnum";


export class StoreIncomePay {
    constructor(){}
    id:number;
    storeId:number;
    incomePayTypeIdIndex:number;
    incomePayTypeMap:Array<IncomePayType>;
    splitMark:number;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;


  //有效的收支分类
  public getValidIncomePayTypeList(): Array<IncomePayType> {
    let incomeTypeMap = this.incomePayTypeMap;
    let incomeTypeArray = new Array<IncomePayType>();

    for (var key in incomeTypeMap) {
      let incomeTypeTmp: IncomePayType = new IncomePayType();
      if (incomeTypeMap[key].entityState == EntityStateEnum.Normal) {
        AppUtils.copy(incomeTypeTmp, incomeTypeMap[key]);
        incomeTypeArray.push(incomeTypeTmp);
      }

    }
    return incomeTypeArray;
  }

  //所有的分类
  public getAllIncomePayTypeList(): Array<IncomePayType> {
    let incomePayTypeMap = this.incomePayTypeMap;
    let incomePayTypeArray = new Array<IncomePayType>();

    for (var key in incomePayTypeMap) {
      let incomePayTypeTmp: IncomePayType = new IncomePayType();
      AppUtils.copy(incomePayTypeTmp, incomePayTypeMap[key]);
      incomePayTypeArray.push(incomePayTypeTmp);
    }
    return incomePayTypeArray;
  }
}
