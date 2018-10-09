import {Component, OnInit, Input, Output, Inject} from '@angular/core';
import {SimpleOrderDetailPopup} from '../simpleOrderDetailPopup/simpleOrderDetailPopup';
import {SimpleOrderItem} from "../relateOrderPopup/relateOrderViewData";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {ProductCardItemEnum} from "../../../../bsModule/productCardDetail/data/ProductCardItemEnum";
import {BuyTypeEnum} from "../../../../bsModule/order/data/BuyTypeEnum";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {PackageProjectDetailCacheDataHolder} from "../../../../bsModule/packageProjectDetail/packageProjectDetailCacheDateHolder";
import {PackageProjectDetail} from "../../../../bsModule/packageProjectDetail/data/PackageProjectDetail";
import {PackageItemEnum} from "../../../../bsModule/packageProjectDetail/data/PackageItemEnum";
import {SimpleProductItem} from "./simpleProductItem";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";

/**
 * 跟进记录选择项目
 */
@Component({
  selector: 'relate-product-popup',
  templateUrl: 'relateProductPopup.html',
  styleUrls: ['relateProductPopup.scss']
})
export class RelateProductPopup implements OnInit {

  @Input() data:SimpleOrderItem;
  @Input() selectedProductList:Array<SimpleProductItem>;
  @Output() action:any;

  public productItems:Array<SimpleProductItem> = new Array<SimpleProductItem>();
  public selectedProductListTmp:Array<SimpleProductItem> = new Array<SimpleProductItem>();
  public productTypeMap:ZmMap<ProductType>;
  private activeModal;
  constructor(
    private matDialog: MatDialog,
    private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
    private packageProjectDetailCacheDataHolder:PackageProjectDetailCacheDataHolder,
    @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.activeModal = dataInput.modalCtrl;
  }

  async ngOnInit() {
    if(!AppUtils.isNullObj(this.data)){
      let prdAndPackageList = this.getPrdAndPackageList();
      let storeId = SessionUtil.getInstance().getStoreId();
      let storeProductInfo:StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
      this.productTypeMap = storeProductInfo?storeProductInfo.getAllProductTypeMap():new ZmMap<ProductType>();
      let productItemMap = new ZmMap<SimpleProductItem>();
      for(let i=0;i<prdAndPackageList.length;i++){
        let productAndPackageItem = prdAndPackageList[i];
        if(productAndPackageItem.buyType == BuyTypeEnum.PRODUCT){//项目
          let simpleProductItem = new SimpleProductItem();
          simpleProductItem.pgId = productAndPackageItem.pgId;
          simpleProductItem.pgName = storeProductInfo&&storeProductInfo.getAllProductInfoMap().get(productAndPackageItem.pgId)?storeProductInfo.getAllProductInfoMap().get(productAndPackageItem.pgId).name:'-';
          simpleProductItem.number = storeProductInfo&&storeProductInfo.getAllProductInfoMap().get(productAndPackageItem.pgId)?storeProductInfo.getAllProductInfoMap().get(productAndPackageItem.pgId).number:'-';
          simpleProductItem.typeId = storeProductInfo&&storeProductInfo.getAllProductInfoMap().get(productAndPackageItem.pgId)?storeProductInfo.getAllProductInfoMap().get(productAndPackageItem.pgId).typeId:'0';
          productItemMap.put(simpleProductItem.pgId,simpleProductItem);
        }else if(productAndPackageItem.buyType == BuyTypeEnum.PACKAGE){//套餐 需要遍历包含项目
          let packageProjectDetail:PackageProjectDetail = await this.packageProjectDetailCacheDataHolder.getData(productAndPackageItem.pgId);
          if(!AppUtils.isNullObj(packageProjectDetail.packageItems)){
            for(let i=0;i<packageProjectDetail.packageItems.length;i++){
              let packageItem = packageProjectDetail.packageItems[i];
              if(packageItem.itemType == PackageItemEnum.PRODUCT){
                let simpleProductItem = new SimpleProductItem();
                simpleProductItem.pgId = packageItem.pgId.toString();
                simpleProductItem.pgName = storeProductInfo.getAllProductInfoMap().get(simpleProductItem.pgId)?storeProductInfo.getAllProductInfoMap().get(simpleProductItem.pgId).name:'-';
                simpleProductItem.number = storeProductInfo.getAllProductInfoMap().get(simpleProductItem.pgId)?storeProductInfo.getAllProductInfoMap().get(simpleProductItem.pgId).number:'-';
                simpleProductItem.typeId = storeProductInfo.getAllProductInfoMap().get(simpleProductItem.pgId)?storeProductInfo.getAllProductInfoMap().get(simpleProductItem.pgId).typeId:'0';
                productItemMap.put(simpleProductItem.pgId,simpleProductItem);
              }
            }
          }
        }
        this.productItems = productItemMap.values();
      }

      //已选项目回显
      if(!AppUtils.isNullObj(this.selectedProductList)){
        for(let j=0;j<this.selectedProductList.length;j++){
          let selectItem = this.selectedProductList[j];
          inner:
            for(let i=0;i<this.productItems.length;i++){
              let productItem = this.productItems[i];
              if(selectItem.pgId == productItem.pgId){
                productItem.isSelected = true;
                this.selectedProductListTmp.push(productItem);
                break inner;
              }
            }
        }
      }
    }
  }

  /**
   * 取出订单项目套餐
   * @returns {ProductAndPackageItem[]}
   */
  getPrdAndPackageList():Array<ProductAndPackageItem>{
    let prdAndPackageList = new Array<ProductAndPackageItem>();
    if(!AppUtils.isNullObj(this.data.delimitCardItems)){
      this.data.delimitCardItems.forEach((item)=>{
        let productAndPackageItem = new ProductAndPackageItem();
        if(item.itemType == ProductCardItemEnum.PRODUCT){
          productAndPackageItem.buyType = BuyTypeEnum.PRODUCT;
        }else if(item.itemType == ProductCardItemEnum.PACKAGE){
          productAndPackageItem.buyType = BuyTypeEnum.PACKAGE;
        }
        productAndPackageItem.pgId = item.pgId;
        prdAndPackageList.push(productAndPackageItem);
      })
    }
    if(!AppUtils.isNullObj(this.data.buyItems)){
      this.data.buyItems.forEach((item)=>{
        let productAndPackageItem = new ProductAndPackageItem();
        if(item.buyType == BuyTypeEnum.PRODUCT){
          productAndPackageItem.buyType = BuyTypeEnum.PRODUCT;
        }else if(item.buyType == BuyTypeEnum.PACKAGE){
          productAndPackageItem.buyType = BuyTypeEnum.PACKAGE;
        }
        productAndPackageItem.pgId = item.pgId;
        prdAndPackageList.push(productAndPackageItem);
      })
    }
    if(!AppUtils.isNullObj(this.data.donationItems)){
      this.data.donationItems.forEach((item)=>{
        let productAndPackageItem = new ProductAndPackageItem();
        if(item.buyType == BuyTypeEnum.PRODUCT){
          productAndPackageItem.buyType = BuyTypeEnum.PRODUCT;
        }else if(item.buyType == BuyTypeEnum.PACKAGE){
          productAndPackageItem.buyType = BuyTypeEnum.PACKAGE;
        }
        productAndPackageItem.pgId = item.pgId;
        prdAndPackageList.push(productAndPackageItem);
      })
    }
    return prdAndPackageList;
  }

  /**
   * 选择项目
   * @param itemP
   */
  selectItem(){
    this.productItems.forEach((item)=>{
      if(item.isSelected){
        if(this.selectedProductListTmp.indexOf(item) == -1){
          this.selectedProductListTmp.push(item);
        }
      }else{
        if(this.selectedProductListTmp.indexOf(item) > -1){
          this.selectedProductListTmp.splice(this.selectedProductListTmp.indexOf(item),1);
        }
      }
    })
  }

  /**
   * 关闭
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * 取消
   */
  cancel(){
    this.activeModal.close();
  }

  /**
   * 返回
   */
  back(){
    this.action([],true)
    this.activeModal.close();
  }

  /**
   * 确定
   */
  confirm(){
    this.action(this.selectedProductListTmp);
    this.activeModal.close();
  }

  /**
   * 查看详情
   */
  goDetail(item:SimpleOrderItem){
    const activeModal = ZmModalMgr.getInstance().newModal(SimpleOrderDetailPopup);
    activeModal.componentInstance.data = item;
  }

}

class ProductAndPackageItem{
  public pgId:string;
  public buyType:number;
}
