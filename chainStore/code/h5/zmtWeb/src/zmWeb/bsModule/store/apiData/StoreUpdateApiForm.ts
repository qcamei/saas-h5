import {UpdateStoreInfoApiData} from "./UpdateStoreInfoApiData";
import {WechatQrCodeApiData} from "./WechatQrCodeApiData";
import {StoreUpdateStatusData} from "./StoreUpdateStatusData";


export class StoreUpdateApiForm {
  updateType: number;
  updateStoreInfoApiData:UpdateStoreInfoApiData;
  // submit4CheckApiData: submit4CheckApiData;
  // joinStoreQrCodeApiData: joinStoreQrCodeApiData;
  // alipayQrCodeApiData: alipayQrCodeApiData;
  wechatQrCodeApiData: WechatQrCodeApiData;
  updateStatusData:StoreUpdateStatusData;
}
