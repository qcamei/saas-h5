import {BUser} from "../../../bsModule/buser/data/BUser";
export class StaffItemData{
  id:string;
  name:string;
  phone:string;
  headImg:string;
  gender:number;
  selected:boolean = false; //是否选中

  public static fromBuser(item:BUser):StaffItemData{
    let staffItemData = new StaffItemData();
    staffItemData.id = item.id;
    staffItemData.name = item.name;
    staffItemData.phone = item.phone;
    staffItemData.headImg = item.headImg;
    staffItemData.gender = item.gender;
    return staffItemData;
  }
}
