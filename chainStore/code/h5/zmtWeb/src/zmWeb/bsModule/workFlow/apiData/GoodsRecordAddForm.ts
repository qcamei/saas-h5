import {GoodsItemData} from "../../../views/storeflow/wfComp/WFDataWraper";
export class GoodsRecordAddForm {
  goodsId:string;
  count:number;
  oldPrice:number;// 原价
  discount:number;
  recordType:number;// 记录类型 RecordTypeEnum
  constructor(){}

  public static fromGoodsItem(item:GoodsItemData):GoodsRecordAddForm{
    let goodsRecordAddForm = new GoodsRecordAddForm();
    goodsRecordAddForm.goodsId = item.id;
    goodsRecordAddForm.oldPrice = item.oldPrice;
    goodsRecordAddForm.count = item.count;
    goodsRecordAddForm.discount = item.discount;
    goodsRecordAddForm.recordType = item.recordType;
    return goodsRecordAddForm;
  }
}
