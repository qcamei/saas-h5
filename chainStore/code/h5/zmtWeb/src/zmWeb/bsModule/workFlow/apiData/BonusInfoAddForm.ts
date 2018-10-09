import {BonusItemData} from "../../../views/storeflow/wfComp/WFDataWraper";
export class BonusInfoAddForm {
buyType:number;
pgId:string;
prdCardPayType:number;
productCardId:string;// 划卡的次卡ID
userBonusMap:any;
constructor(){}

  public static fromBonusItem(bonusItemData:BonusItemData):BonusInfoAddForm{
    let bonusInfoAddForm = new BonusInfoAddForm();
    bonusInfoAddForm.buyType = bonusItemData.type;
    bonusInfoAddForm.pgId = bonusItemData.id;
    bonusInfoAddForm.prdCardPayType = bonusItemData.payType;
    bonusInfoAddForm.productCardId = bonusItemData.productCardId;
    return bonusInfoAddForm;
  }
}
