import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {SettingsPage} from "./page/settings";
import {SettingsRoutingModule} from "./settings-routing.module";
import {setPopup} from "./popup/setPopup";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {DownLoadComp} from "./comp/downLoadComponent";
import {setLeaguerPage} from "./setLeaguer/setLeaguer";
import {setProductPage} from "./setProduct/setProduct";
import {setGoodsPage} from "./setGoods/setGoods";
import {ExcelBSmodule} from "../../bsModule/excel/Excel.bsmodule";
import {StoreLeaguerInfoBSmodule} from "../../bsModule/storeLeaguerInfo/StoreLeaguerInfo.bsmodule";
import {SettingsViewDataMgr} from "./SettingsViewDataMgr";
import {ImportDataComp} from "./comp/importDataComponent";
import {StoreGoodsModule} from "../storeGoods/storeGoods.module";
import {UploadSuccessPopup} from "./popup/UpLoadSuccessPopup";
import {ImportSuccessPopup} from "./popup/ImportSuccessPopup";
import {ProductLeadModal} from "./modal/ProductLeadModal";
import {LeaguerLeadModal} from "./modal/LeaguerLeadModal";
import {GoodsLeadModal} from "./modal/GoodsLeadModal";
import {StoreProductInfoModule} from "../storeProductInfo/storeProduct.module";
import {SetSourcePage} from "./setSource/setSource";
import {SetTypePage} from "./setType/setType";
import {SetAppointmentPage} from "./setAppointment/setAppointment";
import {SetAttributePage} from "./setAttribute/setAttribute";
import {ExpandAttributeComp} from "./setAttribute/expandAttributeComp";
import {LeaguerOriginModalComp} from "./popup/LeaguerOriginModalComp";
import {StoreConfigBSmodule} from "../../bsModule/storeConfig/StoreConfig.bsmodule";
import {AppointSettingModalComp} from "./popup/AppointSettingModalComp";
import { SetBossPayInfoPage } from "./setBossPayInfo/setBossPayInfo";
import {UploadCertFileComp} from "./comp/uploadCertFile/uploadCertFileComp";import {BossPayInfoBsModule} from "../../bsModule/bossPayInfo/BossPayInfo.bsModule";import {UpLoadComp} from "./comp/upLoadComponent";

@NgModule({
  declarations:[

    UploadSuccessPopup,
    ImportSuccessPopup,
    setPopup,
    LeaguerLeadModal,
    GoodsLeadModal,
    ProductLeadModal,

    SettingsPage,
    setLeaguerPage,
    setProductPage,
    setGoodsPage,
    SetSourcePage,
    SetTypePage,
    SetAppointmentPage,
    SetAttributePage,
    SetBossPayInfoPage,

    //商品项目导入
    DownLoadComp,
    UpLoadComp,
    ImportDataComp,

    //弹出框
    ExpandAttributeComp,
    LeaguerOriginModalComp,
    AppointSettingModalComp,

    //上传商户证书
    UploadCertFileComp
  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,

    //公共组件
    ZmCompModule,
    SharedModule,

    //业务
    ExcelBSmodule,
    StoreLeaguerInfoBSmodule,
    StoreProductInfoModule,
    StoreGoodsModule,
    StoreConfigBSmodule,
    BossPayInfoBsModule,
    //路由
    SettingsRoutingModule,

  ],
  providers:[
    SettingsViewDataMgr,

  ],

  entryComponents:[
    UploadSuccessPopup,
    ImportSuccessPopup,
    setPopup,
    LeaguerLeadModal,
    GoodsLeadModal,
    ProductLeadModal,
    //商品项目导入
    DownLoadComp,
    UpLoadComp,
    ImportDataComp,
    //会员属性
    ExpandAttributeComp,
    LeaguerOriginModalComp,
    AppointSettingModalComp,
    //上传商户证书
    UploadCertFileComp,

  ]

})

export class SettingsModule{}
