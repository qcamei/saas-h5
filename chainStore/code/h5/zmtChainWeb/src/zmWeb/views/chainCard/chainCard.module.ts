import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AddMemberCardPage} from "./memberCard/addMemberCard/addMemberCard";
import {MemberCardDetailPage} from "./memberCard/memberCardDetail/memberCardDetail";
import {ChainCardBsmodule} from "../../bsModule/chainCard/ChainCard.bsmodule";
import {ChainCardRoutingModule} from "./chainCard-routing.module";
import {UpdateMemberCardPage} from "./memberCard/updateMemberCard/updateMemberCard";
import {MemberCardListPage} from "./memberCard/memberCardList/memberCardList";
import {ProductCardListPage} from "./productCard/productCardList/productCardList";
import {ChainCardViewDataMgr} from "./ChainCardViewDataMgr";
import {AddProductCardPage} from "./productCard/addProductCard/addProductCard";
import {ProductCardDetailPage} from "./productCard/productCardDetail/productCardDetail";
import {UpdateProductCardPage} from "./productCard/updateProductCard/updateProductCard";
import {SharedModule} from "../common/SharedModule/SharedModule";
import {NgModule} from "@angular/core";
import {ValidPeriodUnitPipe} from "./Pipe/ValidPeriodUnitPipe";
import {ChooseCardModal} from "./Comp/ChooseImgComp/ChooseCardModal.Component";
import {CardProductPopupComp} from "./Comp/selectProductOfCardComp/CardProductPopupComp";
import {ZmCompModule} from "../zmComp/zmComp.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AddProductCardTypeModal} from "./productCard/productCardType/addProductCardTypeCompl";
import {ProductCardTypeListPage} from "./productCard/productCardType/productCardTypeList";
import {ProductCardContentComp} from "./Comp/productCardContentComp/ProductCardContentComp";
import {ChainPackageProjectModule} from "../chainPackageProject/chainPackageProject.module";
import {ChainGoodsModule} from "../chainGoods/chainGoods.module";
import {ChainProductModule} from "../chainProduct/chainProduct.module";
import {DetailDataVersionBSModule} from "../../bsModule/detailDataVersion/DetailDataVersion.bsmodule";
import {AddProductCardTypeWithReturnComp} from "./Comp/addTypeWithReturn/addPrdCardTypeWithReturn";


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

    ValidPeriodUnitPipe,

    //modal
    ChooseCardModal,
    CardProductPopupComp,
    ProductCardContentComp,
    AddProductCardTypeModal,
    AddProductCardTypeWithReturnComp,
  ],
  imports: [
    CommonModule,// *ngFor
    FormsModule, //表单 双向绑定
    NgbModule,
    SharedModule,
    ZmCompModule,

    ChainCardBsmodule,
    ChainCardRoutingModule,
    ChainPackageProjectModule,
    ChainProductModule,
    ChainGoodsModule,
    DetailDataVersionBSModule,

  ],
  providers: [
    ChainCardViewDataMgr,
  ],
  exports: [

  ],
  entryComponents: [
    ChooseCardModal,
    UpdateProductCardPage,
    CardProductPopupComp,
    ProductCardContentComp,
    AddProductCardTypeModal,
    AddProductCardTypeWithReturnComp,
  ],

})
export class ChainCardModule {
}
