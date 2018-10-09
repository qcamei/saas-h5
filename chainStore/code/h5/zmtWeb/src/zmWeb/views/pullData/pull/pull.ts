import { Component, OnInit } from '@angular/core';
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Store} from "../../../bsModule/store/apiData/Store";
import {AppUtils} from "../../../comModule/AppUtils";

@Component({
  selector: 'pull',
  templateUrl: 'pull.html',
})
export class PullPage implements OnInit {

  constructor(){

  }

  ngOnInit() {

  }

  /**
   * 获取项目
   */
  goPullProduct(){
    AppRouter.goPullProduct();
  }

  /**
   * 获取商品
   */
  goPullGoods(){
    AppRouter.goPullGoods();
  }

  /**
   * 获取套餐
   */
  goPullPackage(){
    AppRouter.goPullPackage();
  }

  /**
   * 获取次卡
   */
  goPullCard(){
    AppRouter.goPullCard();
  }

  /**
   * 获取会员卡
   */
  goPullMemberCard(){
    AppRouter.goPullMemberCard();
  }

  /**
   * 获取员工
   */
  goPullClerk(){
    AppRouter.goPullClerk();
  }

}
