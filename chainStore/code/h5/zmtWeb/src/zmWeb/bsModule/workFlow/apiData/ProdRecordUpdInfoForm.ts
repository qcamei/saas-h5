import {ProductItemData, SuperItemData} from "../../../views/storeflow/wfComp/WFDataWraper";
export class ProdRecordUpdInfoForm {
  prodId:string;
  count:number;
  oldPrice:number;// 原价
  discount:number;
  recordType:number;// 记录类型 RecordTypeEnum
  constructor(){}

  public static fromProductItem(productItemData:ProductItemData):ProdRecordUpdInfoForm{
    let prodRecordUpdInfoForm = new ProdRecordUpdInfoForm();
    prodRecordUpdInfoForm.prodId = productItemData.id;
    prodRecordUpdInfoForm.oldPrice = productItemData.oldPrice;
    prodRecordUpdInfoForm.count = productItemData.count;
    prodRecordUpdInfoForm.discount = productItemData.discount;
    prodRecordUpdInfoForm.recordType = prodRecordUpdInfoForm.recordType;
    return prodRecordUpdInfoForm;
  }

  public static fromSuperItem(superItemData:SuperItemData):ProdRecordUpdInfoForm{
    let prodRecordUpdInfoForm = new ProdRecordUpdInfoForm();
    prodRecordUpdInfoForm.prodId = superItemData.id;
    prodRecordUpdInfoForm.oldPrice = superItemData.oldPrice;
    prodRecordUpdInfoForm.count = superItemData.count;
    prodRecordUpdInfoForm.discount = superItemData.discount;
    prodRecordUpdInfoForm.recordType = superItemData.recordType;
    return prodRecordUpdInfoForm;
  }
}
