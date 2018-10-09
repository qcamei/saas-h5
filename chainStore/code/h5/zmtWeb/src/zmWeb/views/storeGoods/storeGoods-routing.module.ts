import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {AddGoods} from "./addGoods/addGoods";
import {EditGoods} from "./editGoods/editGoods";
import {GoodsClassify} from "./goodsClassify/goodsClassify";
import {GoodsDetails} from "./goodsDetails/goodsDetails";
import {StoreGoodsList} from "./storeGoodsList/storeGoodsList";
import {GoodsListResolve} from "../../comModule/guard/listResolve/GoodsListResolve";

const mRoutes:Routes = [
  {
    path:"addGoods",
    resolve:{todos:GoodsListResolve},
    component:AddGoods
  },
  {
    path:"editGoods/:goodsDetailId",
    component:EditGoods
  },
  {
    path:"goodsClassify",
    component:GoodsClassify
  },
  {
    path:"goodsDetails/:goodsId",
    component:GoodsDetails
  },
  {
    path:"storeGoodsList",
    component:StoreGoodsList
  },
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

export class StoreGoodsRoutingModule{}
