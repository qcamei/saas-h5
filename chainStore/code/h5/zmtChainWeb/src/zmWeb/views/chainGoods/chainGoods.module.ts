import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {AddGoods} from "./addGoods/AddGoods";
import {EditGoods} from "./editGoods/editGoods";
import {GoodsClassify} from "./goodsClassify/goodsClassify";
import {GoodsDetails} from "./goodsDetails/goodsDetails";
import {ChainGoodsRoutingModule} from "./chainGoods-routing.module";
import {SharedModule} from "./../common/SharedModule/SharedModule";
import {ChainGoodsViewDataMgr} from './ChainGoodsViewDataMgr';
import {ZmCompModule} from "../zmComp/zmComp.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ChainGoodsBsmodule} from "../../bsModule/chainGoods/ChainGoods.bsmodule";
import {GoodsTypeComp} from "./goodsClassify/goodsClassifyModalComp";
import {GoodsList} from "./goodsList/GoodsList";
import {DetailDataVersionBSModule} from "../../bsModule/detailDataVersion/DetailDataVersion.bsmodule";
import {ProductionLibraryModule} from "../productionLibrary/productionLibrary.module";
import {AddGoodsTypeWithReturnComp} from "./comp/addGoodsTypeWithReturn";

@NgModule({
  declarations:[

    AddGoods,
    EditGoods,
    GoodsClassify,
    GoodsDetails,
    GoodsList,

    GoodsTypeComp,
    AddGoodsTypeWithReturnComp,

  ],
  imports:[
    CommonModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ZmCompModule,

    ChainGoodsRoutingModule,
    ChainGoodsBsmodule,

    DetailDataVersionBSModule,
    ProductionLibraryModule,
  ],
  providers:[
    ChainGoodsViewDataMgr,
  ],
  exports:[
  ],
  entryComponents: [
    GoodsTypeComp,
    AddGoodsTypeWithReturnComp
  ]
})

export class ChainGoodsModule{}
