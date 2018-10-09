import {CardItemData} from "../../../views/storeflow/wfComp/WFDataWraper";
export class PrdCardUpdateForm {
  prdCardTypeId:string;
  count:number;
  oldPrice:number;// 原价
  discount:number;
  recordType:number;// 记录类型 RecordTypeEnum
  constructor(){}

  public static fromCardItem(cardItemData:CardItemData):PrdCardUpdateForm{
    let prdCardUpdateForm = new PrdCardUpdateForm();
    prdCardUpdateForm.prdCardTypeId = cardItemData.id;
    prdCardUpdateForm.oldPrice = cardItemData.oldPrice;
    prdCardUpdateForm.count = cardItemData.count;
    prdCardUpdateForm.discount = cardItemData.discount;
    prdCardUpdateForm.recordType = cardItemData.recordType;
    return prdCardUpdateForm;
  }
}
