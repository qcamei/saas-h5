import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AddMemberCardPage} from "./memberCard/addMemberCard/addMemberCard";
import {MemberCardDetailPage} from "./memberCard/memberCardDetail/memberCardDetail";
import {StoreCardInfoBSModule} from "../../bsModule/storeCardInfo/StoreCardInfo.bsmodule";
import {StoreCardInfoRoutingModule} from "./storeCardInfo-routing.module";
import {UpdateMemberCardPage} from "./memberCard/updateMemberCard/updateMemberCard";
import {MemberCardListPage} from "./memberCard/memberCardList/memberCardList";
import {ProductCardListPage} from "./productCard/productCardList/productCardList";
import {MemCardStatePipe, MemCardStatePipe2} from "./Pipe/MemCardStatePipe";
import {StoreCardInfoViewDataMgr} from "./StoreCardInfoViewDataMgr";
import {AddProductCardPage} from "./productCard/addProductCard/addProductCard";
import {ProductCardDetailPage} from "./productCard/productCardDetail/productCardDetail";
import {UpdateProductCardPage} from "./productCard/updateProductCard/updateProductCard";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {PrdCardStatePipe, PrdCardStatePipe2} from "./Pipe/PrdCardStatePipe";
import {NgModule} from "@angular/core";
import {PrdCardTypePipe} from "./Pipe/PrdCardTypePipe";
import {ChooseCardModal} from "./Comp/ChooseImgComp/ChooseCardModal.Component";
import {CardProductPopupComp} from "./Comp/selectProductOfCardComp/CardProductPopupComp";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {StoreProductInfoModule} from "../storeProductInfo/storeProduct.module";
import {MembershipCardDetailBSmodule} from "../../bsModule/MembershipCardDetail/MemCardDetail.bsmodule";
import {ProductCardDetailBSmodule} from "../../bsModule/productCardDetail/productCardDetail.bsmodule";
import {ProductCardContentComp} from "./Comp/productCardContentComp/ProductCardContentComp";
import {ProductDetailBSModule} from "../../bsModule/productDetail/ProductDetail.bsModule";
import {GoodsDetailBSModule} from "../../bsModule/goodsDetail/GoodsDetail.bsmodule";
import {StoreGoodsModule} from "../storeGoods/storeGoods.module";
import {StorePackageProjectModule} from "../storePackageProject/StorePackageProject.module";
import {AddProductCardTypeModal} from "./productCard/productCardType/addProductCardTypeCompl";
import {ProductCardTypeListPage} from "./productCard/productCardType/productCardTypeList";


@NgModule({
  declarations: [
    AddMemberCardPage,
    MemberCardDetailPage,
    UpdateMemberCardPage,
    MemberCardListPage,
    AddProductCardPage,
    ProductCardDetailPage,
    ProductCardListPage,
    UpdateProductCardPage,
    ProductCardTypeListPage,

    //pipe
    MemCardStatePipe,
    MemCardStatePipe2,
    PrdCardStatePipe,
    PrdCardStatePipe2,
    PrdCardTypePipe,

    //modal
    ChooseCardModal,
    CardProductPopupComp,
    ProductCardContentComp,
    AddProductCardTypeModal,
  ],
  imports: [
    CommonModule,// *ngFor
    FormsModule, //表单 双向绑定
    SharedModule,
    ZmCompModule,

    StoreCardInfoBSModule,
    StoreCardInfoRoutingModule,
    MembershipCardDetailBSmodule,
    ProductCardDetailBSmodule,
    StorePackageProjectModule,
    StoreProductInfoModule,
    StoreGoodsModule,
    ProductDetailBSModule,
    GoodsDetailBSModule,

  ],
  providers: [
    StoreCardInfoViewDataMgr,
  ],
  exports: [

  ],
  entryComponents: [
    ChooseCardModal,
    UpdateProductCardPage,
    CardProductPopupComp,
    ProductCardContentComp,
    AddProductCardTypeModal,
  ],

})
export class StoreCardInfoModule {
}
