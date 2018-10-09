import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {StoreListPage} from "./storeList/storeList";
import {AddChainPage} from "./addChain/addChain";
import {EditChainPage} from "./editChain/editChain";
import {ChainDetailPage} from "./chainDetail/chainDetail";

/**
 * 店铺管理路由
 */
const mRoutes:Routes = [
  {
    path:"storeList",
    component:StoreListPage
  },
  {
    path:"addChain",
    component:AddChainPage
  },
  {
    path:"editChain/:chainId",
    component:EditChainPage
  },
  {
    path:"chainDetail/:chainId/:storeId",
    component:ChainDetailPage
  }
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

export class ChainRoutingModule{}
