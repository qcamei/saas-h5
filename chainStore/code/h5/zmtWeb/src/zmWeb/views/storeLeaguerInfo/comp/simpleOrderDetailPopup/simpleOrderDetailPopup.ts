import {Component, OnInit, Input, Renderer2, ElementRef, ViewChild, Inject} from '@angular/core';
import {AppUtils} from "../../../../comModule/AppUtils";
import {BuyTypeEnum} from "../../../../bsModule/order/data/BuyTypeEnum";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreGoods} from "../../../../bsModule/storeGoods/data/StoreGoods";
import {StorePackageProject} from "../../../../bsModule/storePackageProject/data/StorePackageProject";
import {StoreCardInfo} from "../../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {SimpleOrderItem} from "../relateOrderPopup/relateOrderViewData";
import {MAT_DIALOG_DATA} from "@angular/material";
import {SimpleBuyItem} from "../relateOrderPopup/simpleBuyItem";

@Component({
  selector: 'simple-order-detail',
  templateUrl: 'simpleOrderDetailPopup.html',
  styleUrls: ['simpleOrderDetailPopup.scss']
})
export class SimpleOrderDetailPopup implements OnInit {

  @Input() data:SimpleOrderItem;
  public buyItems:Array<SimpleBuyItem> = new Array<SimpleBuyItem>();
  @ViewChild('modal') modal: ElementRef;
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private storePackageSynDataHolder:StorePackageProjectSynDataHolder,
              public  el:ElementRef,
              public  renderer:Renderer2) {}

  ngOnInit() {
    let Gparent = this.modal.nativeElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling;
    let parent = this.modal.nativeElement.parentElement.parentElement.parentElement.parentElement;

    this.renderer.setStyle(Gparent, 'z-index', '1055');
    this.renderer.setStyle(parent, 'z-index', '1060');

    if(!AppUtils.isNullObj(this.data)){
       this.initViewData().then((buyItems=>{
         this.buyItems = buyItems;
       }));
    }
  }

  /**
   * 组装显示数据
   * @returns {Promise<Array<SimpleBuyItem>>}
   */
  private async initViewData():Promise<Array<SimpleBuyItem>>{
    let buyItems = new Array<SimpleBuyItem>();
    if(!AppUtils.isNullObj(this.data.delimitCardItems)){//划卡项
      this.data.delimitCardItems.forEach((item)=>{
        buyItems.push(SimpleBuyItem.fromDelimitCarditem(item));
      })
    }
    if(!AppUtils.isNullObj(this.data.buyItems)){//购买项
      this.data.buyItems.forEach((item)=>{
        buyItems.push(SimpleBuyItem.fromBuyItem(item));
      })
    }
    if(!AppUtils.isNullObj(this.data.donationItems)){//赠送项
      this.data.donationItems.forEach((item)=>{
        buyItems.push(SimpleBuyItem.fromDonationItem(item));
      })
    }

    let storeId = SessionUtil.getInstance().getStoreId();
    let storeProductInfo:StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    let storeGoods:StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    let storePackageProject:StorePackageProject = await this.storePackageSynDataHolder.getData(storeId);
    let storeCardInfo:StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    for(let i=0;i<buyItems.length;i++){
      let buyItem = buyItems[i];
      if(buyItem.buyType == BuyTypeEnum.PRODUCT){
        buyItem.pgName = storeProductInfo&&storeProductInfo.getAllProductInfoMap().get(buyItem.pgId)?storeProductInfo.getAllProductInfoMap().get(buyItem.pgId).name:'-';
      }else if(buyItem.buyType == BuyTypeEnum.GOODS){
        buyItem.pgName = storeGoods&&storeGoods.getAllGoodsMap().get(buyItem.pgId)?storeGoods.getAllGoodsMap().get(buyItem.pgId).name:'-';
      }else if(buyItem.buyType == BuyTypeEnum.PACKAGE){
        buyItem.pgName = storePackageProject&&storePackageProject.getAllPackageProjectMap().get(buyItem.pgId)?storePackageProject.getAllPackageProjectMap().get(buyItem.pgId).name:'-';
      }else if(buyItem.buyType == BuyTypeEnum.PRDCARD){
        buyItem.pgName = storeCardInfo&&storeCardInfo.getProductCardMap().get(buyItem.pgId)?storeCardInfo.getProductCardMap().get(buyItem.pgId).name:'-';
      }
    }
    return new Promise<Array<SimpleBuyItem>>(resolve=>{
      resolve(buyItems);
    })
  }

  /**
   * 关闭弹框
   */
  closeModal() {
    this.activeModal.close();
  }

}
