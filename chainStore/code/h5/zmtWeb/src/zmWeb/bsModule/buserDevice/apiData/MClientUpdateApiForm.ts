import {MClientUpdateSnCodeForm} from "./MClientUpdateSnCodeForm";
import {MClientUpdateStatusForm} from "./MClientUpdateStatusForm";
import {MClientUpdateBandingForm} from "./MClientUpdateBandingForm";
import {MClientUpdateLocationForm} from "./MClientUpdateLocationForm";
export class MClientUpdateApiForm {
  updateType: number;
  updateSnCodeData: MClientUpdateSnCodeForm;
  updateStatusData: MClientUpdateStatusForm;
  updateBandingData: MClientUpdateBandingForm;
  updateLocationData: MClientUpdateLocationForm;

  constructor() {
  }
}
