import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {StoreLeaguerInfoViewDataMgr} from "./StoreLeaguerInfoViewDataMgr";
import {NgModule} from "@angular/core";
import {FindLeaguerPage} from "./findLeaguer/findLeaguer";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {StoreLeaguerInfoRoutingModule} from "./storeLeaguerInfo-routing.module";
import {AddLeaguerPage} from "./addLeaguer/addLeaguer";
import {EditLeaguerPage} from "./editLeaguer/editLeaguer";
import {LeaguerDetailPage} from "./leaguerDetail/leaguerDetail";
import {StoreLeaguerInfoBSmodule} from "../../bsModule/storeLeaguerInfo/StoreLeaguerInfo.bsmodule";
import {StoreCardInfoBSModule} from "../../bsModule/storeCardInfo/StoreCardInfo.bsmodule";
import {OrderBSmodule} from "../../bsModule/order/Order.bsmodule";
import {LimitUnitPipe} from "./pipe/limitUnitPipe";
import {ProductCardTypePipe} from "./pipe/productCardTypePipe";
import {CustomerTypePipe} from "./pipe/customerTypePipe";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {LeaguerDetailBSmodule} from "../../bsModule/leaguerDetail/LeaguerDetail.bsmodule";
import {StoreProductInfoBSModule} from "../../bsModule/StoreProductInfo/StoreProductInfo.bsModule";
import {AddRecordPage} from "./leaguerDetail/addRecord/addRecord";
import {EditRecordPage} from "./leaguerDetail/editRecord/editRecord";
import {RecordDetailPage} from "./leaguerDetail/recordDetail/recordDetail";
import {StoreConfigBSmodule} from "../../bsModule/storeConfig/StoreConfig.bsmodule";
import {LeaguerLabelModalComp} from "./addLeaguer/LeaguerLabelModalComp";
import {LeaguerRecordBSmodule} from "../../bsModule/leaguerRecord/LeaguerRecord.bsmodule";
import {LeaguerOriginPipe} from "./pipe/leaguerOriginPipe";
import {LeaguerDetailTabPipe} from "./pipe/leaguerDetailTabPipe";
import {ProductCardDetailBSmodule} from "../../bsModule/productCardDetail/productCardDetail.bsmodule";
import {AddRecordComp} from "./leaguerDetail/addRecord/addRecordComp";
import {RelateOrderPopup} from "./comp/relateOrderPopup/relateOrderPopup";
import {RelateProductPopup} from "./comp/relateProductPopup/relateProductPopup";
import {SimpleOrderDetailPopup} from "./comp/simpleOrderDetailPopup/simpleOrderDetailPopup";
import {StoreGoodsBSModule} from "../../bsModule/storeGoods/StoreGoods.bsModule";
import {StoreClerkInfoBSmodule} from "../../bsModule/storeClerkInfo/StoreClerkInfo.bsmodule";
import {BUserBSModule} from "../../bsModule/buser/BUser.bsModule";
import {StorePackageProjectBSModule} from "../../bsModule/storePackageProject/StorePackageProject.bsModule";
import {BuserPopup} from "./comp/buserPopup/buserPopup";
import {EditRecordComp} from "./leaguerDetail/editRecord/editRecordComp";
import {StaffPopup} from "./comp/staffPopup/staffPopup";
import {LeaguerAnalysisPage} from "./leaguerAnalysis/leaguerAnalysis";
import {LeaguerCardBSmodule} from "../../bsModule/leaguerCard/LeaguerCard.bsmodule";


@NgModule({
  declarations: [
    // 公共组件

    //page
    FindLeaguerPage,
    AddLeaguerPage,
    EditLeaguerPage,
    LeaguerDetailPage,
    AddRecordPage,
    EditRecordPage,
    RecordDetailPage,
    LeaguerAnalysisPage,

    //pipe
    LimitUnitPipe,
    ProductCardTypePipe,
    CustomerTypePipe,
    LeaguerOriginPipe,
    LeaguerDetailTabPipe,

    //popup
    LeaguerLabelModalComp,
    RelateOrderPopup,
    RelateProductPopup,
    SimpleOrderDetailPopup,
    BuserPopup,  //设置负责人（以前的跟进人员）弹框
    StaffPopup,//选择跟进人员弹框

    //comp
    AddRecordComp,//添加跟进记录组件
    EditRecordComp,//编辑跟进记录组件

  ],
  imports: [
    //公共module
    CommonModule,
    FormsModule,
    //业务module
    StoreLeaguerInfoBSmodule,
    StoreCardInfoBSModule,
    OrderBSmodule,
    StoreProductInfoBSModule,
    LeaguerDetailBSmodule,
    StoreConfigBSmodule,
    LeaguerRecordBSmodule,
    ProductCardDetailBSmodule,
    StoreGoodsBSModule,
    StoreClerkInfoBSmodule,
    BUserBSModule,
    StorePackageProjectBSModule,
    LeaguerCardBSmodule,
    //路由module
    StoreLeaguerInfoRoutingModule,
    //组件module
    SharedModule,
    ZmCompModule,

  ],
  exports:[
    //comp
    AddRecordComp,//添加跟进记录组件
  ],
  entryComponents:[
    //popup
    LeaguerLabelModalComp,
    RelateOrderPopup,
    RelateProductPopup,
    SimpleOrderDetailPopup,
    BuserPopup,  //设置负责人（以前的跟进人员）弹框
    StaffPopup,//选择跟进人员弹框
    //comp
    AddRecordComp,//添加跟进记录组件
    EditRecordComp,//编辑跟进记录组件
  ],
  providers: [
    StoreLeaguerInfoViewDataMgr,

]
})

export class StoreLeaguerInfoModule {
}
