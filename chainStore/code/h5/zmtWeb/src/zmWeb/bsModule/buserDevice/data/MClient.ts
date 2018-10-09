export class MClient {
  id: number;
  clientId: string;
  mseriesId: string;
  mseriesName: string;
  mtypeId: string;
  mtypeName: string;
  snCode: string;
  imsiCode: string;
  secretKey: string;
  bandingSystem: number;
  bandingAccount: string;
  status: number;
  ctrlState:number;
  lockState:number;
  isActivated: number;
  location: string;
  locationGps: string;
  locationUrl: string;
  createdTime: number;
  lastUpdateTime: number;
  lastUpdateStatusTime: number;
  ver: number;

  constructor() {
  }

}
