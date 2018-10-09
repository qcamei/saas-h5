import {BaseAttributeStatusForm} from "./BaseAttributeStatusForm";
import {ExpandAttributeAddForm} from "./ExpandAttributeAddForm";
import {ExpandAttributeSortForm} from "./ExpandAttributeSortForm";
import {ExpandAttributeUpdateForm} from "./ExpandAttributeUpdateForm";
import {ExpandAttributeStatusForm} from "./ExpandAttributeStatusForm";
import {LeaguerOriginAddForm} from "./LeaguerOriginAddForm";
import {LeaguerOriginRemoveForm} from "./LeaguerOriginRemoveForm";
import {LeaguerOriginUpdateForm} from "./LeaguerOriginUpdateForm";
import {LeaguerTypeUpdateForm} from "./LeaguerTypeUpdateForm";
import {AppointTimeUpdateForm} from "./AppointTimeUpdateForm";
import {CancelAppointAddForm} from "./CancelAppointAddForm";
import {CancelAppointRemoveForm} from "./CancelAppointRemoveForm";
import {CancelAppointUpdateForm} from "./CancelAppointUpdateForm";
import {LeaguerAnalysisUpdateForm} from "./LeaguerAnalysisUpdateForm";
export class StoreConfigUpdateForm {
  updateType:number;
  baseAttributeStatusForm:BaseAttributeStatusForm;
  expandAttributeAddForm:ExpandAttributeAddForm;
  expandAttributeSortForm:ExpandAttributeSortForm;
  expandAttributeUpdateForm:ExpandAttributeUpdateForm;
  expandAttributeStatusForm:ExpandAttributeStatusForm;
  leaguerOriginAddForm:LeaguerOriginAddForm;
  leaguerOriginRemoveForm:LeaguerOriginRemoveForm;
  leaguerOriginUpdateForm:LeaguerOriginUpdateForm;
  appointTimeUpdateForm:AppointTimeUpdateForm;
  cancelAppointAddForm:CancelAppointAddForm;
  cancelAppointRemoveForm:CancelAppointRemoveForm;
  cancelAppointUpdateForm:CancelAppointUpdateForm;
  leaguerAnalysisUpdateForm:LeaguerAnalysisUpdateForm;

  /**************************遗留字段***********************************/
  leaguerTypeUpdateForm:LeaguerTypeUpdateForm;
  constructor(){}
}
