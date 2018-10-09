import {WorkFlowDataUpdateInfoForm} from "./WorkFlowDataUpdateInfoForm";
import {WorkFlowDataUpdateStatusForm} from "./WorkFlowDataUpdateStatusForm";
import {WorkFlowDataCancelForm} from "./WorkFlowDataCancelForm";

export class WorkFlowDataUpdateForm {
  updateType:number;
  updWorkFlowDataInfoForm:WorkFlowDataUpdateInfoForm;
  workFlowDataStatusForm:WorkFlowDataUpdateStatusForm;
  workFlowDataCancelForm:WorkFlowDataCancelForm
  constructor(){}
}
