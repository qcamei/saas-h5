import {ProductItemData} from "../../../views/storeflow/wfComp/WFDataWraper";
export class DecreasePrdCardUpdateForm {
decreasePrdCardId:string;
count:number;
discount:number;
buserIds:Array<number>;
constructor(){}

  public static fromProductItem(productItemData:ProductItemData):DecreasePrdCardUpdateForm{
    let decreasePrdCardUpdateForm = new DecreasePrdCardUpdateForm();
    decreasePrdCardUpdateForm.count = productItemData.count;
    decreasePrdCardUpdateForm.discount = productItemData.discount;
    return decreasePrdCardUpdateForm;
  }
}
