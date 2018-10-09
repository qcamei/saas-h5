import {EUser} from "../../../bsModule/euser/apiData/EUser";
import {AddEUserFormData} from "./AddEUserFormData";
export class AddEUserViewData{

  public formData:AddEUserFormData = new AddEUserFormData();

  public euserList:Array<EUser> = new Array<EUser>();
  public phoneList:Array<string> = new Array<string>();
}
