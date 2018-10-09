import {StaffData} from "../../../views/storeflow/wfComp/WFDataWraper";

export class UserBonus {
buserId:string;
amount:number;
bonusType:number;//BonusTypeEnum
percentage:number;
cost:number;
constructor(){}

  public static fromStaffItem(staffData:StaffData):UserBonus{
    let userBonus = new UserBonus();
    userBonus.buserId = staffData.id;
    userBonus.amount = staffData.amount;
    userBonus.bonusType = staffData.bonusType;
    userBonus.percentage = staffData.percentage;
    userBonus.cost = staffData.cost;
    return userBonus;
  }
}
