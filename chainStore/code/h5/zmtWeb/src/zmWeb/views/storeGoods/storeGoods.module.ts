import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {AddGoods} from "./addGoods/addGoods";
import {EditGoods} from "./editGoods/editGoods";
import {GoodsClassify} from "./goodsClassify/goodsClassify";
import {GoodsDetails} from "./goodsDetails/goodsDetails";
import {StoreGoodsList} from "./storeGoodsList/storeGoodsList";
import {StoreGoodsRoutingModule} from "./storeGoods-routing.module";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {StoreGoodsViewDataMgr} from './StoreGoodsViewDataMgr';
import {ZmCompModule} from "../zmComp/zmComp.module";
import {StoreGoodsBSModule} from "../../bsModule/storeGoods/StoreGoods.bsModule";
import {GoodsDetailBSModule} from "../../bsModule/goodsDetail/GoodsDetail.bsmodule";
import {ModalComponent} from "./goodsClassify/goodsClassifyModalComp";
import {AddGoodsTypeWithReturnComp} from "./comp/addGoodsTypeWithReturn";

@NgModule({
  declarations:[
    //page
    AddGoods,
    EditGoods,
    GoodsClassify,
    GoodsDetails,
    StoreGoodsList,
    ModalComponent,
    AddGoodsTypeWithReturnComp ,

  ],
  imports:[
    //公共module
    CommonModule,
    FormsModule,
    //组件module
    SharedModule,
    ZmCompModule,

    StoreGoodsRoutingModule,
    StoreGoodsBSModule,
    GoodsDetailBSModule,
  ],
  providers:[
    StoreGoodsViewDataMgr,
  ],
  exports:[
  ],
  entryComponents: [
    ModalComponent,
    AddGoodsTypeWithReturnComp
  ]
})

export class StoreGoodsModule{}
