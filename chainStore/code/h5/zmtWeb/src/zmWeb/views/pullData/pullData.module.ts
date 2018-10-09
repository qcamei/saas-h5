import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullDataRoutingModule } from './pullData-routing.module';
import { PullPage } from './pull/pull';
import { ZmCompModule } from '../zmComp/zmComp.module';
import { SharedModule } from '../common/SharedModule/SharedModule';
import { PullProductPage } from './pullProduct/pullProduct';
import { PullPackagePage } from './pullPackage/pullPackage';
import { PullMemberCardPage } from './pullMemberCard/pullMemberCard';
import { PullGoodsPage } from './pullGoods/pullGoods';
import { PullClerkPage } from './pullClerk/pullClerk';
import { PullCardPage } from './pullCard/pullCard';
import {ChainDataSynBSmodule} from "../../bsModule/chainDataSyn/ChainDataSyn.bsmodule";
import {ChainProductBSmodule} from "../../bsModule/chainProduct/ChainProduct.bsmodule";
import {PullDataViewDataMgr} from "./pullViewDataMgr";
import {StoreProductInfoBSModule} from "../../bsModule/StoreProductInfo/StoreProductInfo.bsModule";
import {FormsModule} from "@angular/forms";
import {ChainProductDetailPage} from "./pullProduct/chainProductDetail/chainProductDetail";
import {ChainGoodsBSmodule} from "../../bsModule/chainGoods/ChainGoods.bsmodule";
import {StoreGoodsBSModule} from "../../bsModule/storeGoods/StoreGoods.bsModule";
import {ChainGoodsDetailPage} from "./pullGoods/chainGoodsDetail/chainGoodsDetail";
import {ChainPackageDetailPage} from "./pullPackage/chainPackageDetail/chainPackageDetail";
import {StorePackageProjectBSModule} from "../../bsModule/storePackageProject/StorePackageProject.bsModule";
import {ChainPackageProjectBSmodule} from "../../bsModule/chainPackageProject/ChainPackageProject.bsmodule";
import {ChainCardBSmodule} from "../../bsModule/chainCard/ChainCard.bsmodule";
import {StoreCardInfoBSModule} from "../../bsModule/storeCardInfo/StoreCardInfo.bsmodule";
import {ChainCardDetailPage} from "./pullCard/chainCardDetail/chainCardDetail";
import {ChainMemberCardDetailPage} from "./pullMemberCard/chainMemberCardDetail/chainMemberCardDetail";

@NgModule({
  declarations: [
    PullPage,
    PullProductPage,
    PullPackagePage,
    PullMemberCardPage,
    PullGoodsPage,
    PullClerkPage,
    PullCardPage,
    ChainProductDetailPage,
    ChainGoodsDetailPage,
    ChainPackageDetailPage,
    ChainCardDetailPage,
    ChainMemberCardDetailPage,

  ],
  imports: [
    //公共模块
    FormsModule,
    CommonModule,
    ZmCompModule,
    SharedModule,
    //业务模块
    ChainDataSynBSmodule,
    ChainProductBSmodule,
    StoreProductInfoBSModule,
    ChainGoodsBSmodule,
    StoreGoodsBSModule,
    ChainPackageProjectBSmodule,
    StorePackageProjectBSModule,
    ChainCardBSmodule,
    StoreCardInfoBSModule,

    //路由
    PullDataRoutingModule,
  ],
  providers:[
    PullDataViewDataMgr,
  ]
})
export class PullDataModule { }
