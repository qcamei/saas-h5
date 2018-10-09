import {ProductItemData} from "../../../views/storeflow/wfComp/WFDataWraper";
export class ProdRecordAddForm {
  prodId:string;
  count:number;
  oldPrice:number;// 原价
  discount:number;
  recordType:number;// 记录类型 RecordTypeEnum
  constructor(){}

  public static fromProductItem(productItemData:ProductItemData):ProdRecordAddForm{
    let prodRecordAddForm = new ProdRecordAddForm();
    prodRecordAddForm.prodId = productItemData.id;
    prodRecordAddForm.oldPrice = productItemData.oldPrice;
    prodRecordAddForm.count = productItemData.count;
    prodRecordAddForm.discount = productItemData.discount;
    prodRecordAddForm.recordType = productItemData.recordType;
    return prodRecordAddForm;
  }
}
