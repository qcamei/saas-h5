import {CardItemData} from "../../../views/storeflow/wfComp/WFDataWraper";
export class PrdCardAddForm {
  prdCardTypeId:string;
  count:number;
  oldPrice:number;// 原价
  discount:number;
  recordType:number;// 记录类型 RecordTypeEnum
  constructor(){}

  public static fromCardItem(cardItemData:CardItemData):PrdCardAddForm{
    let prdCardAddForm = new PrdCardAddForm();
    prdCardAddForm.prdCardTypeId = cardItemData.id;
    prdCardAddForm.oldPrice = cardItemData.oldPrice;
    prdCardAddForm.count = cardItemData.count;
    prdCardAddForm.discount = cardItemData.discount;
    prdCardAddForm.recordType = cardItemData.recordType;
    return prdCardAddForm;
  }
}
