import {GoodsItemData} from "../../../views/storeflow/wfComp/WFDataWraper";
export class GoodsRecordUpdateForm {
  goodsId:string;
  count:number;
  oldPrice:number;// 原价
  discount:number;
  recordType:number;// 记录类型 RecordTypeEnum
  constructor(){}

  public static fromGoodsItem(goodsItemData:GoodsItemData):GoodsRecordUpdateForm{
    let goodsRecordUpdateForm = new GoodsRecordUpdateForm();
    goodsRecordUpdateForm.goodsId = goodsItemData.id;
    goodsRecordUpdateForm.oldPrice = goodsItemData.oldPrice;
    goodsRecordUpdateForm.count = goodsItemData.count;
    goodsRecordUpdateForm.discount = goodsItemData.discount;
    goodsRecordUpdateForm.recordType = goodsItemData.recordType;
    return goodsRecordUpdateForm;
  }
}
