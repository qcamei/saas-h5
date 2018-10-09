import {  PullProductPage } from './pullProduct/pullProduct';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PullPage } from './pull/pull';
import { PullPackagePage } from './pullPackage/pullPackage';
import { PullMemberCardPage } from './pullMemberCard/pullMemberCard';
import { PullGoodsPage } from './pullGoods/pullGoods';
import { PullClerkPage } from './pullClerk/pullClerk';
import { PullCardPage } from './pullCard/pullCard';
import {ChainProductDetailPage} from "./pullProduct/chainProductDetail/chainProductDetail";
import {ChainGoodsDetailPage} from "./pullGoods/chainGoodsDetail/chainGoodsDetail";
import {ChainPackageDetailPage} from "./pullPackage/chainPackageDetail/chainPackageDetail";
import {ChainCardDetailPage} from "./pullCard/chainCardDetail/chainCardDetail";
import {ChainMemberCardDetailPage} from "./pullMemberCard/chainMemberCardDetail/chainMemberCardDetail";

const mRoutes:Routes = [
  {path:'pull',component:PullPage},
  {path:'pullProduct',component:PullProductPage},
  {path:'pullGoods',component:PullGoodsPage},
  {path:'pullPackage',component:PullPackagePage},
  {path:'pullCard',component:PullCardPage},
  {path:'pullMemberCard',component:PullMemberCardPage},
  {path:'pullClerk',component:PullClerkPage},

  {path:"productDetail/:id",component:ChainProductDetailPage},
  {path:"goodsDetail/:id",component:ChainGoodsDetailPage},
  {path:"packageDetail/:id",component:ChainPackageDetailPage},
  {path:"cardDetail/:id",component:ChainCardDetailPage},
  {path:"memberCardDetail/:id",component:ChainMemberCardDetailPage},

]

@NgModule({
  imports:[
    RouterModule.forChild(mRoutes)
  ],
  exports:[
    RouterModule
  ],
  providers:[]
})

export class PullDataRoutingModule{}
