import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {AddGoods} from "./addGoods/AddGoods";
import {EditGoods} from "./editGoods/editGoods";
import {GoodsDetails} from "./goodsDetails/goodsDetails";
import {GoodsClassify} from "./goodsClassify/goodsClassify";
import {GoodsList} from "./goodsList/GoodsList";
import {GoodsListResolve} from "../../comModule/guard/listResolve/GoodsListResolve";

const mRoutes:Routes = [
  {
    path:"goodsList",
    resolve:{todos:GoodsListResolve},
    component:GoodsList
  },
  {
    path:"addGoods",
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
];

@NgModule({
  imports:[
    RouterModule.forChild(mRoutes)
  ],
  exports:[
    RouterModule
  ],
  providers:[]
})

export class ChainGoodsRoutingModule{}
