// import {Component, OnInit, ChangeDetectorRef, Output, Input, EventEmitter} from "@angular/core";
// 
// import {AppUtils} from "../../../../comModule/AppUtils";
// import {SessionUtil} from "../../../../comModule/session/SessionUtil";
// import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
// import {
//   AddProductPopup, AddProductPopupViewData,
// } from "../../../zmComp/functionsComp/addProductPopup/AddProductPopup";
// import {StoreGoodsSynDataHolder} from "../../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
// import {ProductCardContentViewDataMgr} from "./ProductCardContentViewDataMgr";
// import {ProductDetailCacheDataHolder} from "../../../../bsModule/productDetail/ProductDetailCacheDataHolder";
// import {GoodsDetailCacheDataHolder} from "../../../../bsModule/goodsDetail/GoodsDetailCacheDataHolder";
// import {AddGoodsPopup, AddGoodsPopupViewData} from "../../../zmComp/functionsComp/addGoodPopup/AddGoodsPopup";
// import {ProductData, ProductCardContentCompViewData} from "./ProductCardContentCompViewData";
// import {ProductCardContentCompService} from "./ProductCardContentCompService";
// import {AddPackagePopup, AddPackagePopupViewData} from "../../../zmComp/functionsComp/addPackagePopup/AddPackagePopup";
// import {PackageProjectDetailCacheDataHolder} from "../../../../bsModule/packageProjectDetail/packageProjectDetailCacheDateHolder";
// import {StorePackageProjectSynDataHolder} from "../../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
// import {ProductInfoDetailModalComponent} from "../../../zmComp/functionsComp/productDetailComp/ProductInfoDetailModal.Component";
// import {PackageDetailModalComponent} from "../../../zmComp/functionsComp/packageDetailComp/PackageDetailModalComponent";
// import {GoodsDetailModalComponent} from "../../../zmComp/functionsComp/goodsDetailComp/GoodsDetailModal.Component";
// import {ProductCardItemEnum} from "../../../../bsModule/productCardDetail/data/ProductCardItemEnum";
// import {UseTypeEnum} from "../../../storePackageProject/pipe/UseTypeEnum";
//
//
// /**
//  * 次卡内容组件 -----6.1备份 勿删
//  */
// @Component({
//   selector: 'productCard-content-comp-back',
//   template: `
//         <div  style="background-color: #fff;border-radius:4px;">
//               <div class="disFlex align-center pd-l-38" style="height: 60px;" >
//                 <div  class="disFlex align-center" style="height:60px;width: 100%;" >
//                   <span>次卡内容</span>
//                   <div class="disFlex align-center cur-hand" style="margin-left: 70px;height:60px;" (click)="selectProduct()">
//                     <img src="assets/images/icon/icon_Add.png" alt="">
//                     <span class="color-theme fz-14 " style="font-weight:normal;margin-left: 12px;" >添加项目</span>
//                   </div>
//                   <div class="disFlex align-center cur-hand" style="margin-left: 70px;height:60px;" (click)="selectGoods()">
//                     <img src="assets/images/icon/icon_Add.png" alt="">
//                     <span class="color-theme  fz-14 " style="font-weight:normal;margin-left: 12px;" >添加商品</span>
//                   </div>
//                   <div class="disFlex align-center cur-hand" style="margin-left: 70px;height:60px;" (click)="selectPackage()">
//                     <img src="assets/images/icon/icon_Add.png" alt="">
//                     <span class="color-theme  fz-14 " style="font-weight:normal;margin-left: 12px;" >添加套餐</span>
//                   </div>
//                 </div>
//
//
//               </div>
//             <div [class.collapsed]="!contentExpanded" [class.expanded] = "contentExpanded">
//                 <table class="scrollTable tables table-bordered text-center  mg-t-20" >
//                     <thead  style="background:#f4f6fa;">
//                         <th style="width:10%;">产品名称</th>
//                         <th style="width:10%;">产品分类</th>
//                         <th style="width:10%;">售价</th>
//                         <th style="width:10%;">卡内次数/数量</th>
//                         <th style="width:10%;">单次平均价格</th>
//                         <th style="width:10%;">操作</th>
//                     </thead>
//                     <tbody class="my_color mg-b-20">
//                         <tr *ngFor="let item of productCardContentList;let i=index;">
//                             <td style="width:10%;">{{item.name}}</td>
//                             <td style="width:10%;">{{item.type|itemTypePipe}}</td>
//                             <td style="width:10%;">{{item.price}}</td>
//                             <td style="width:10%;">
//                                 <div class="pos-r align-center" style="display:flex;">
//
//                                   <input type="number" *ngIf="item.userType!=0" oninput="if(value<=0 ||value>999){value=1}" style="width:80%;border:1px solid rgb(236, 233, 233);" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="setCount(item)">
//                                   <input type="text" *ngIf="item.userType==0" style="width:80%;border:1px solid rgb(236, 233, 233);" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.unlimit_count" (change)="changeCount(item)">
//                                   <span *ngIf="item.type==0" style="padding-left:5px;">次</span>
//                                   <span *ngIf="item.type==1 || item.type==2" style="padding-left:5px;">个</span>
//
//                                   </div>
//                             </td>
//                             <td style="width:10%;">
//
//                                 <div class="pos-r align-center " style="display:flex;">
//                                  <input *ngIf="item.discountPrice !=0" [disabled]="item.locked" oninput="if(value<=0){value=1}" [(ngModel)]="item.discountPrice" type="number"  style="width:70%;border:1px solid rgb(236, 233, 233);" class="text-center" (blur)="checkPrice(item)">
//                               <input *ngIf="item.discountPrice ==0" value="-" [disabled]="item.locked"  style="width:70%;border:1px solid rgb(236, 233, 233);" class="text-center">
//                               <input *ngIf="!item.locked" [disabled]="!sellPriceTmp" style="margin-left:10px;" value="确定" type="button" (click)="setDiscount(item,false)">
//                               <input *ngIf="item.locked" [disabled]="!sellPriceTmp" style="margin-left:10px;" value="修改" type="button" (click)="unLockedDiscount(item,true)">
//                                 </div>
//                             </td>
//                             <td style="width:10%;color:#4678fa;">
//                               <span class="cur-hand" (click)="deleteItem(item,i)">删除</span><span></span>
//                               <span class="pd-l-5 cur-hand" (click)="showDetail(item)">查看</span>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//   `,
//   styles: [`
//     .tables {
//       font-size: 14px;
//     }
//     .tables thead th {
//     white-space: nowrap;
//     height:46px;
//     box-sizing:border-box;
//     }
//     .tables tbody tr td{
//     padding:8px;
//     font-size: 14px;
//     box-sizing:border-box;
//     }
//     .scroll-table tr td:nth-child(1){
//       width: 30%;
//     }
//     .scroll-table tr td:nth-child(2){
//       width: 40%;
//     }
//     .fa-pencil{
//     top:2px;
//     }
//
//     .scrollTable tbody{
//
//     height:auto;
//     }
//     .scrollTable tbody tr{
//     border: 1px solid #e9ecef;
//     }
//     .scrollTable tbody tr:last-child{
//     border-bottom:none ;
//     }
//    .c-arrow-down img{
//     transform-origin:50% 50%;
//     transform: rotate(180deg);
//     transition: all 0.5s;
//   }
//   .pd-l-38{
//     padding-left:38px;
//   }
//   .pd-l-5{
//     padding-left:5px;
//   }
//   .my_color tr:hover{
//     background:#e7f3fd;
//   }
//   `]
// })
//
// export class ProductCardContentComp implements OnInit,OnInit {
//   @Output() hasUnLimit = new EventEmitter();
//
//   private totalPriceTmp: number;
//   @Output() totalPriceChange = new EventEmitter();
//
//   @Input()
//   get totalPrice() {
//     return this.totalPriceTmp;
//   }
//
//   set totalPrice(val) {
//     this.totalPriceTmp = val;
//     this.totalPriceChange.emit(this.totalPriceTmp);
//   }
//
//   private sellPriceTmp: number;
//   @Output() sellPriceChange = new EventEmitter();
//
//   @Input()
//   get sellPrice() {
//     return this.sellPriceTmp;
//   }
//
//   set sellPrice(val) {
//     this.sellPriceTmp = val;
//     this.sellPriceChange.emit(this.sellPriceTmp);
//   }
//
//   public productCardContentListTmp: Array<ProductData> = new Array<ProductData>();
//   @Output() productCardContentListChange = new EventEmitter();
//
//   @Input()
//   get productCardContentList() {
//     return this.productCardContentListTmp;
//   }
//
//   set productCardContentList(val) {
//     this.productCardContentListTmp = val;
//     if(this.viewData.flag){
//       this.buildChoosedList(this.productCardContentListTmp);
//     }
//     this.productCardContentListChange.emit(this.productCardContentListTmp);
//   }
//
//   private service: ProductCardContentCompService;
//   public viewData: ProductCardContentCompViewData = new ProductCardContentCompViewData();
//   public contentExpanded = true;
//
//   constructor(private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
//               private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
//               private productDetailCacheDataHolder: ProductDetailCacheDataHolder,
//               private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
//               private packageProjectDetailCacheDataHolder: PackageProjectDetailCacheDataHolder,
//               private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
//               private modalService: NgbModal,
//               private cdRef: ChangeDetectorRef) {
//     this.service = new ProductCardContentCompService(
//       this.storeProductInfoSynDataHolder,
//       this.storeGoodsSynDataHolder,
//       this.storePackageProjectSynDataHolder);
//   }
//
//   ngOnInit() {
//
//     ProductCardContentViewDataMgr.getInstance().onDataChanged(new ProductCardContentCompViewData(), (viewDataTmp: ProductCardContentCompViewData) => {
//       this.viewData = viewDataTmp;
//       this.cdRef.markForCheck();
//     });
//
//     this.service.initViewData();
//   }
//
//   ngOnDestroy(): void {
//     ProductCardContentViewDataMgr.getInstance().onViewDestroy();
//   }
//
//   public buildChoosedList(productCardContentList:Array<ProductData>){
//     for(let item of productCardContentList) {
//       if (item.type == ProductCardItemEnum.PRODUCT) {
//         this.viewData.choosedProductList.push(item);
//       } else if (item.type == ProductCardItemEnum.GOODS) {
//         this.viewData.choosedGoodsList.push(item);
//       } else if (item.type == ProductCardItemEnum.PACKAGE) {
//         this.viewData.choosedPackageList.push(item);
//       }
//     }
//     this.viewData.flag = false;
//   }
//
//   setCount(itemP:ProductData){
//     let totalPrice = 0;
//     this.productCardContentList.forEach((item) => {
//       if (item.id == itemP.id) {
//         item = itemP;
//       }
//       totalPrice += parseInt(item.price.toString())*item.count;
//       this.totalPrice = totalPrice;
//     });
//   }
//
//   changeCount(item: ProductData) {
//     item.unlimit_count == "无限" ? item.count = 0 : item.count = parseInt(item.unlimit_count);
//     item.unlimit_count == "无限" ? item.userType = UseTypeEnum.UNLIMIT_NUMBER : item.userType = UseTypeEnum.lIMIT_NUMBER;
//     item.unlimit_count == "无限" ? this.viewData.hasUnLimit = true : this.viewData.hasUnLimit = false;
//
//     this.hasUnLimit.emit(this.viewData.hasUnLimit);
//   }
//
//
//   /**
//    * 弹出添加项目popup
//    */
//   selectProduct(): void {
//     const activeModal = this.modalService.open(AddProductPopup, {size: 'lg', backdrop: 'static'});
//
//     //设置弹窗数据
//     activeModal.componentInstance.data = AddProductPopupViewData.fromParent(this.viewData);
//     activeModal.componentInstance.type = 0;
//     activeModal.componentInstance.action = this.selectContentCallback.bind(this);
//   }
//
//   /**
//    * 弹出添加商品popup
//    */
//   selectGoods(): void {
//     const activeModal = this.modalService.open(AddGoodsPopup, {size: 'lg', backdrop: 'static'});
//
//     //设置弹窗数据
//     activeModal.componentInstance.data = AddGoodsPopupViewData.fromParent(this.viewData);
//     activeModal.componentInstance.type = 0;
//     activeModal.componentInstance.action = this.selectContentCallback.bind(this);
//   }
//
//   /**
//    * 弹出添加套餐popup
//    */
//   selectPackage(): void {
//     const CardModal = this.modalService.open(AddPackagePopup, {size: 'lg', backdrop: 'static'});
//
//     //设置弹窗数据
//     CardModal.componentInstance.data = AddPackagePopupViewData.fromParent(this.viewData);
//     CardModal.componentInstance.action = this.selectContentCallback.bind(this);
//   }
//
//   /**
//    * 选择产品回调
//    */
//   selectContentCallback(): void {
//     this.productCardContentList = new Array();
//
//     this.productCardContentList = AppUtils.addAll(this.productCardContentList, this.viewData.choosedProductList);
//
//     this.productCardContentList = AppUtils.addAll(this.productCardContentList, this.viewData.choosedGoodsList);
//
//     this.productCardContentList = AppUtils.addAll(this.productCardContentList, this.viewData.choosedPackageList);
//
//
//     for(let item of this.productCardContentList){
//       if(item.count==0){
//         this.viewData.hasUnLimit = true;
//         break;
//       }
//     }
//     this.hasUnLimit.emit(this.viewData.hasUnLimit);
//
//     this.totalPrice = 0;
//     for(let item of this.productCardContentList){
//       this.totalPrice += parseInt(item.price.toString())*item.count;
//     }
//
//     AppUtils.showSuccess("提示", "选择项目成功");
//   }
//
//   /**
//    * 删除选中产品
//    * @param item
//    */
//   deleteItem(itemP: ProductData, index) {
//     Popup.getInstance().open("提示", "确定删除吗?", () => {
//       this.productCardContentList.forEach((item, index) => {
//         if (item == itemP) {
//           this.productCardContentList.splice(index, 1);
//           this.totalPrice -= parseInt(item.price.toString())*item.count;
//         }
//       });
//
//       if (itemP.type == ProductCardItemEnum.PRODUCT) {
//         this.viewData.choosedProductList.forEach((item, index) => {
//           if (item.id == itemP.id) {
//             item.count = 1;
//             this.viewData.choosedProductList.splice(index, 1);
//           }
//         });
//       }
//
//       if (itemP.type == ProductCardItemEnum.GOODS) {
//         this.viewData.choosedGoodsList.forEach((item, index) => {
//           if (item.id == itemP.id) {
//             item.count = 1;
//             this.viewData.choosedGoodsList.splice(index, 1);
//           }
//         });
//       }
//
//       if (itemP.type == ProductCardItemEnum.PACKAGE) {
//         this.viewData.choosedPackageList.forEach((item, index) => {
//           if (item.id == itemP.id) {
//             item.count = 1;
//             this.viewData.choosedPackageList.splice(index, 1);
//           }
//         });
//       }
//
//       AppUtils.showSuccess("提示", "删除成功");
//       this.service.handleViewData(this.viewData);
//     });
//   }
//
//   /**
//    * 查询选中产品详情
//    * @param item
//    */
//   public async showDetail(item: ProductData) {
//     if (item.type == ProductCardItemEnum.PRODUCT) {
//       await this.openProductInfoDetail(item);
//     } else if (item.type == ProductCardItemEnum.GOODS) {
//       await this.openGoodsDetail(item);
//     }
//     else if (item.type == ProductCardItemEnum.PACKAGE) {
//       await this.openPackageDetail(item);
//     }
//   }
//
//   private async openProductInfoDetail(item: ProductData) {
//     const activeModal = this.modalService.open(ProductInfoDetailModalComponent, {size: 'lg', backdrop: 'static'});
//     let storeId = SessionUtil.getInstance().getStoreId();
//     let productDetailId = storeId + "_" + item.id;
//     let productDetail = await this.productDetailCacheDataHolder.getData(productDetailId);
//     activeModal.componentInstance.productDetail = productDetail;
//     activeModal.componentInstance.productTypeMap = this.viewData.productTypeMap;
//   }
//
//   private async openGoodsDetail(item: ProductData) {
//     const activeModal = this.modalService.open(GoodsDetailModalComponent, {size: 'lg', backdrop: 'static'});
//     let storeId = SessionUtil.getInstance().getStoreId();
//     let goodsDetailId = storeId + "_" + item.id;
//     let goodsDetail = await this.goodsDetailCacheDataHolder.getData(goodsDetailId);
//     activeModal.componentInstance.goodsDetail = goodsDetail;
//     activeModal.componentInstance.goodsTypeMap = this.viewData.goodsTypeMap;
//   }
//
//   private async openPackageDetail(item:ProductData) {
//     const activeModal = this.modalService.open(PackageDetailModalComponent, {size: 'lg', backdrop: 'static'});
//     let packageDetail = await this.packageProjectDetailCacheDataHolder.getData(item.id);
//     activeModal.componentInstance.packageDetail = packageDetail;
//     activeModal.componentInstance.packageTypeMap = this.viewData.packageProjectTypeMap;
//   }
//
//   //解锁
//   unLockedDiscount(itemP: ProductData, withDiscount) {
//     this.productCardContentList.forEach((item: ProductData) => {
//       if (item.id == itemP.id) {
//         itemP.locked = !withDiscount;
//         itemP.withDiscount = withDiscount;
//         item = itemP;
//       }
//     });
//   }
//
//   checkPrice(itemP: ProductData) {
//     if (itemP.discountPrice > itemP.price) {
//       itemP.discountPrice = itemP.price;
//       return;
//     }
//   }
//
//   /**
//    * 修改选中产品的单件平均价格
//    * @param item
//    */
//   setDiscount(itemP: ProductData, withDiscount) {
//     this.checkPrice(itemP);
//
//     let unlockStatusList = new Array<boolean>();
//     for (let item of this.productCardContentList) {
//       if(item.withDiscount==true){
//         unlockStatusList.push(item.withDiscount);
//       }
//     }
//     //临界情况处理  只有一个产品没被锁定
//     if(unlockStatusList.length<=1){
//       this.autoSetDiscount();
//       this.productCardContentList.forEach((item: ProductData) => {
//         if (item.id == itemP.id) {
//           itemP.locked = !withDiscount;
//           itemP.withDiscount = withDiscount;
//           item = itemP;
//         }
//       });
//     }else{
//       this.productCardContentList.forEach((item: ProductData) => {
//         if (item.id == itemP.id) {
//           itemP.locked = !withDiscount;
//           itemP.withDiscount = withDiscount;
//           item = itemP;
//         }
//       });
//       this.autoSetDiscount();
//     }
//   }
//
//
//   private autoSetDiscount() {
//     let withDiscountList = new Array<boolean>();
//     for (let item of this.productCardContentList) {
//       withDiscountList.push(item.withDiscount);
//     }
//
//     let totalPrice = 0;
//     let price = this.sellPrice;
//     if (!AppUtils.arrayContains(withDiscountList, false)) {//全为true 不锁定
//       this.productCardContentList.forEach(item => {
//         totalPrice += item.price * item.count;
//         totalPrice = AppUtils.twoDecimal(totalPrice);
//       });
//     } else {
//       this.productCardContentList.filter(item => {
//         if (item.withDiscount == true) {
//           totalPrice += item.price * item.count;
//           totalPrice = AppUtils.twoDecimal(totalPrice);
//           return true;
//         }
//         if (item.withDiscount == false) {
//           price -= item.discountPrice * item.count;
//           price = AppUtils.twoDecimal(price);
//           return true;
//         }
//       });
//     }
//
//
//     let rate: number = price / totalPrice;
//     for (let item of this.productCardContentList) {
//       if (item.withDiscount == true) {
//         item.discountPrice = item.price * rate;
//         item.discountPrice = AppUtils.twoDecimal(item.discountPrice);
//         if (item.discountPrice > item.price) {
//           item.discountPrice = item.price;
//           return;
//         }
//       }
//     }
//   }
//
// }
//
//
//
//
//
//
//
//
