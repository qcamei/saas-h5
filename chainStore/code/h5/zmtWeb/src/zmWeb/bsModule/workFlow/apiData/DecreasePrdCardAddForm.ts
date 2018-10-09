import {ProductItemData} from "../../../views/storeflow/wfComp/WFDataWraper";
import {DecreasePrdCardRecordStatusEnum} from "../data/DecreasePrdCardRecordStatusEnum";
export class DecreasePrdCardAddForm {
cardTypeId:string;
prdId:number;
status:number;
count:number;
discount:number;
buserIds:Array<number>;
constructor(){}

  public static fromProductItem(productItemData:ProductItemData):DecreasePrdCardAddForm{
    let decreasePrdCardAddForm = new DecreasePrdCardAddForm();
    decreasePrdCardAddForm.cardTypeId = productItemData.productCardId;
    decreasePrdCardAddForm.prdId = parseInt(productItemData.id);
    decreasePrdCardAddForm.status = DecreasePrdCardRecordStatusEnum.OWNERCARD;//已购
    decreasePrdCardAddForm.count = productItemData.count;
    decreasePrdCardAddForm.discount = productItemData.discount;
    return decreasePrdCardAddForm;
  }
}
