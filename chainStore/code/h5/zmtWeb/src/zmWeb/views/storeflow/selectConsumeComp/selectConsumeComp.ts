import {
  Component, OnInit, OnDestroy, Input,} from "@angular/core";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {
  ProductItemData, GoodsItemData, CardItemData, WFDataWraper,
  ProdRecordsWFCompData, SuperItemData, AttachProdsWFCompData, ProductCardWFCompData, PackageWFCompData,
  PackageItemData, GiftWFCompData
} from "../wfComp/WFDataWraper";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {
  SelectProductPopupComp,
  SelectProductPopupViewData
} from "../selectProductComp/selectProductPopup/selectProductPopupComp";
import {WFDataWraperMgr} from "../wfComp/WFDataWraperMgr";
import {RecordTypeEnum} from "../../../bsModule/workFlow/data/RecordTypeEnum";
import {LeaguerCardEnum} from "../../../bsModule/storeLeaguerInfo/data/LeaguerCardEnum";
import {Popup} from "../../common/popup/popup";
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";
import {SelectGoodsPopupComp, SelectGoodsPopupViewData} from "../selectGoodsComp/selectGoodsPopup/selectGoodsPopupComp";
import {SelectCardPopupComp, SelectCardPopupViewData} from "../selectCardComp/selectCardPopup/selectCardPopupComp";
import {SelectPackagePopupComp, SelectPackagePopupViewData} from "../selectPackageComp/selectPackagePopupComp";
import {PrdCardPayEnum} from "../../../bsModule/workFlow/data/PrdCardPayEnum";
import {PrdCardType} from "../../../bsModule/storeCardInfo/data/PrdCardType";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";


/**
 * 选择购买项公共组件
 */
@Component({
  selector:'select-consume-comp',
  template:`
             <!--购买-->
             
            <zm-card-box [withCollapse]="true" [expanded]="contentBuyExpanded">
               <header fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="100px">
                 <label fxLayoutAlign="center center" style="font-weight: bold;font-size: 18px;">购买</label>
                 <div fxLayout="row" fxLayoutAlign="start" fxLayoutGap="20px">
                    
                    <div class="zmCurHand"  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" (click)="selectProduct($event,0)">
                      <img src="assets/images/icon/icon_Add.png" alt="">
                      <span class="color-theme fz-14 " style="font-weight:normal;margin-left: 12px;" >项目</span>
                    </div>
                    <div class="zmCurHand"  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"(click)="selectGoods($event,0)">
                      <img src="assets/images/icon/icon_Add.png" alt="">
                      <span class="color-theme  fz-14 " style="font-weight:normal;margin-left: 12px;" >商品</span>
                    </div>
                    <div class="zmCurHand"  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" (click)="selectPackage($event,0)">
                      <img src="assets/images/icon/icon_Add.png" alt="">
                      <span class="color-theme  fz-14 " style="font-weight:normal;margin-left: 12px;" >套餐</span>
                    </div>
                    <div *ngIf="wFDataWraper.isLeaguer" class="zmCurHand"  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" (click)="selectCard($event,0)">
                      <img src="assets/images/icon/icon_Add.png" alt="">
                      <span class="color-theme  fz-14 " style="font-weight:normal;margin-left: 12px;" >次卡</span>
                    </div>
                 </div>
               </header>
               <content>
                  <zm-table-detail *ngIf="(prodRecordsWFCompData.productList.length>0) 
                  || (attachProdsWFCompData.goodsList.length>0)
                  || (packageWFCompData.packageList.length>0)
                  || (productCardWFCompData.cardList.length>0)">
                    <thead>
                      <th style="width:8%;">序号</th>
                      <th style="width:9%;">类型</th>
                      <th style="width:15%;">名称</th>
                      <th style="width:10%;">原价</th>
                      <th style="width:10%;">售价</th>
                      <th style="width:10%;">折扣</th>
                      <th style="width:10%;">数量</th>
                      <th style="width:10%;">预存<span><img class="ml-4"  matTooltip="会员(非散客)购买除次卡外的产品转入预存\n以后来店从“划卡/预存”中选择使用" style="width:16px;" src="assets/images/icon/question_gray.png"/></span></th>
                      <th style="width:10%;">应收</th>
                      <th style="width:8%;">操作</th>
                    </thead>
                    <tbody style="text-align: center">
                      <tr *ngFor="let item of prodRecordsWFCompData.productList;let i=index;">
                          <td style="width:8%;">{{i+1}}</td>
                          <td style="width:9%;">{{item.type|buyTypePipe}}</td>
                          <td style="width:15%;">{{item.name}}</td>
                          <td style="width:10%;">{{item.oldPrice}}</td>
                          <td style="width:10%;">
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                                <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input step="0.01" type="number" oninput="if(value.length>8)value=value.slice(0,8)" style="width:100%;border:none;-ms-border:none;" class="text-center" [(ngModel)]="item.price" (blur)="changePrice($event,item)">
                              </div>
                          </td>
                          <td style="width:10%;">
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" *ngIf="item.payType == 0">
                                <zm-input-wf-discount class="w-100-p" [label]="'折'" [placeholder]="'请输入折扣'" [(discount)]="item.discount" (discountChange)="changeDiscount($event,item)"></zm-input-wf-discount>
                              </div>
                          </td>
                          <td style="width:10%;"> 
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                                <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="changeCount($event,item)">
                              </div>
                          </td>
                          <td style="width:10%;"> 
                              <div *ngIf="wFDataWraper.isLeaguer" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                                <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.restCount" (blur)="changeRestCount($event,item)">
                              </div>
                              <div *ngIf="!wFDataWraper.isLeaguer">-</div>
                          </td>
                          <td style="width:10%;">{{item.cost}}</td>
                          <td style="width:8%;color:#4678fa;"><a (click)="deleteItem(item)">删除</a></td>
                      </tr>
                      <tr *ngFor="let item of attachProdsWFCompData.goodsList;let i=index;">
                          <td style="width:8%;">{{i+1}}</td>
                          <td style="width:9%;">{{item.type|buyTypePipe}}</td>
                          <td style="width:15%;">{{item.name}}</td>
                          <td style="width:10%;">{{item.oldPrice}}</td>
                          <td style="width:10%;">
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                                <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>8)value=value.slice(0,8)" style="width:100%;border:none;-ms-border:none;" class="text-center" [(ngModel)]="item.price" (blur)="changePrice($event,item)">
                              </div>
                          </td>
                          <td style="width:10%;">
                              <div *ngIf="item.payType == 0">
                                <zm-input-wf-discount class="w-100-p" [label]="'折'" [placeholder]="'请输入折扣'" [(discount)]="item.discount" (discountChange)="changeDiscount($event,item)"></zm-input-wf-discount>
                              </div>
                          </td>
                          <td style="width:10%;"> 
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                               <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="changeCount($event,item)">
                              </div>
                          </td>
                          <td style="width:10%;"> 
                              <div *ngIf="wFDataWraper.isLeaguer" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                                <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.restCount" (blur)="changeRestCount($event,item)">
                              </div>
                              <div *ngIf="!wFDataWraper.isLeaguer">-</div>
                          </td>
                          <td style="width:10%;">{{item.cost}}</td>
                          <td style="width:8%;color:#4678fa;"><a (click)="deleteItem(item)">删除</a></td>
                      </tr>
                      <tr *ngFor="let item of packageWFCompData.packageList;let i=index;">
                          <td style="width:8%;">{{i+1}}</td>
                          <td style="width:9%;">{{item.type|buyTypePipe}}</td>
                          <td style="width:15%;">{{item.name}}</td>
                          <td style="width:10%;">{{item.oldPrice}}</td>
                          <td style="width:10%;">
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                               <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>8)value=value.slice(0,8)" style="width:100%;border:none;-ms-border:none;" class="text-center" [(ngModel)]="item.price" (blur)="changePrice($event,item)">
                              </div>
                          </td>
                          <td style="width:10%;">
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" *ngIf="item.payType == 0">
                                <zm-input-wf-discount class="w-100-p" [label]="'折'" [placeholder]="'请输入折扣'" [(discount)]="item.discount" (discountChange)="changeDiscount($event,item)"></zm-input-wf-discount>
                              </div>
                          </td>
                          <td style="width:10%;"> 
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                                <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="changeCount($event,item)">
                              </div>
                          </td>
                          <td style="width:10%;"> 
                              <div *ngIf="wFDataWraper.isLeaguer" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                                <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.restCount" (blur)="changeRestCount($event,item)">
                              </div>
                              <div *ngIf="!wFDataWraper.isLeaguer">-</div>
                          </td>
                          <td style="width:10%;">{{item.cost}}</td>
                          <td style="width:8%;color:#4678fa;"><a  (click)="deleteItem(item)">删除</a></td>
                      </tr>
                      <tr *ngFor="let item of productCardWFCompData.cardList;let i=index;">
                          <td style="width:8%;">{{i+1}}</td>
                          <td style="width:9%;">{{item.type|buyTypePipe}}</td>
                          <td style="width:15%;">{{item.name}}</td>
                          <td style="width:10%;">{{item.oldPrice}}</td>
                          <td style="width:10%;">
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                                <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>8)value=value.slice(0,8)" style="width:100%;border:none;-ms-border:none;" class="text-center" [(ngModel)]="item.price" (blur)="changePrice($event,item)">
                              </div>
                          </td>
                          <td style="width:10%;">
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" *ngIf="item.payType == 0">
                                <zm-input-wf-discount  class="w-100-p" [label]="'折'" [placeholder]="'请输入折扣'" [(discount)]="item.discount" (discountChange)="changeDiscount($event,item)"></zm-input-wf-discount>
                              </div>
                          </td>
                          <td style="width:10%;"> 
                              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px">
                                <i class="fa fa-pencil pos-a" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="changeCount($event,item)">
                              </div>
                          </td>
                          <td style="width:10%;">
                              -
                          </td>
                          <td style="width:10%;">{{item.cost}}</td>
                          <td style="width:8%;color:#4678fa;text-align: center"><a (click)="deleteItem(item)">删除</a></td>
                      </tr>
                    </tbody>
                  </zm-table-detail>
                  
                  <div class="noData-tips text-center mg-t-30 mg-b-30" *ngIf="(prodRecordsWFCompData.productList.length==0) 
                  && (attachProdsWFCompData.goodsList.length==0)
                  && (packageWFCompData.packageList.length==0)
                  && (productCardWFCompData.cardList.length==0)">
                      <p class="mg-b-0" style="color:#999;">请点击上方进行添加购买项</p>
                  </div>
               </content>
             </zm-card-box>
             
             
            <!--赠送-->
           <zm-card-box [withCollapse]="true" [expanded]="contentExpanded">
               <header fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="100px">
               
                 <label fxLayoutAlign="center center" style="font-weight: bold;font-size: 18px;">赠送</label>
                 <div fxLayout="row" fxLayoutAlign="start" fxLayoutGap="20px">
                     <div class="zmCurHand"  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"(click)="selectProduct($event,1)">
                      <img src="assets/images/icon/icon_Add.png" alt="">
                      <span class="color-theme fz-14 " style="font-weight:normal;margin-left: 12px;" >项目</span>
                    </div>
                     <div class="zmCurHand"  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" (click)="selectGoods($event,1)">
                      <img src="assets/images/icon/icon_Add.png" alt="">
                      <span class="color-theme  fz-14 " style="font-weight:normal;margin-left: 12px;" >商品</span>
                    </div>
                     <div class="zmCurHand"  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" (click)="selectPackage($event,1)">
                      <img src="assets/images/icon/icon_Add.png" alt="">
                      <span class="color-theme  fz-14 " style="font-weight:normal;margin-left: 12px;" >套餐</span>
                    </div>
                     <div *ngIf="wFDataWraper.isLeaguer" class="zmCurHand"  fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" (click)="selectCard($event,1)">
                      <img src="assets/images/icon/icon_Add.png" alt="">
                      <span class="color-theme  fz-14 " style="font-weight:normal;margin-left: 12px;" >次卡</span>
                    </div>
                 </div>
               </header>
               <content>
                  <zm-table-detail [borderNone]="true" *ngIf="(giftWFCompData.productList.length>0) 
                  || (giftWFCompData.goodsList.length>0)
                  || (giftWFCompData.packageList.length>0)
                  || (giftWFCompData.cardList.length>0)">
                    <thead>
                      <th style="width:8%;">序号</th>
                      <th style="width:9%;">类型</th>
                      <th style="width:25%;">名称</th>
                      <th style="width:20%;">售价</th>
                      <th style="width:15%;">数量</th>
                      <th style="width:15%;">总价</th>
                      <th style="width:8%;">操作</th>
                    </thead>
                    <tbody style="text-align: center">
                      <tr *ngFor="let item of giftWFCompData.productList;let i=index;">
                          <td style="width:8%;">{{i+1}}</td>
                          <td style="width:9%;">{{item.type|buyTypePipe}}</td>
                          <td style="width:25%;">{{item.name}}</td>
                          <td style="width:20%;">{{item.totalPrice}}</td>
                          <td style="width:15%;"> 
                              <div fxLayout="row" fxLayoutAlign="start center">
                                <i class="fa fa-pencil" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="changeCount($event,item)">
                              </div>
                          </td>
                          <td style="width:15%;" class="text-center">
                              {{item.totalPrice}}
                          </td>
                          <td style="width:8%;color:#4678fa;"><a (click)="deleteItem(item)">删除</a></td>
                      </tr>
                      <tr *ngFor="let item of giftWFCompData.goodsList;let i=index;">
                          <td style="width:8%;">{{i+1}}</td>
                          <td style="width:9%;">{{item.type|buyTypePipe}}</td>
                          <td style="width:25%;">{{item.name}}</td>
                          <td style="width:20%;">{{item.totalPrice}}</td>
                          <td style="width:15%;"> 
                              <div fxLayout="row" fxLayoutAlign="start center">
                                 <i class="fa fa-pencil" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="changeCount($event,item)">
                              </div>
                          </td>
                          <td style="width:15%;" class="text-center">
                              {{item.totalPrice}}
                          </td>
                          <td style="width:8%;color:#4678fa;"><a (click)="deleteItem(item)">删除</a></td>
                      </tr>
                      <tr *ngFor="let item of giftWFCompData.packageList;let i=index;">
                          <td style="width:8%;">{{i+1}}</td>
                          <td style="width:9%;">{{item.type|buyTypePipe}}</td>
                          <td style="width:25%;">{{item.name}}</td>
                          <td style="width:20%;">{{item.totalPrice}}</td>
                          <td style="width:15%;"> 
                              <div fxLayout="row" fxLayoutAlign="start center">
                                 <i class="fa fa-pencil" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="changeCount($event,item)">
                              </div>
                          </td>
                          <td style="width:15%;" class="text-center">
                              {{item.totalPrice}}
                          </td>
                          <td style="width:8%;color:#4678fa;"><a (click)="deleteItem(item)">删除</a></td>
                      </tr>
                      <tr *ngFor="let item of giftWFCompData.cardList;let i=index;">
                          <td style="width:8%;">{{i+1}}</td>
                          <td style="width:9%;">{{item.type|buyTypePipe}}</td>
                          <td style="width:25%;">{{item.name}}</td>
                          <td style="width:20%;">{{item.totalPrice}}</td>
                          <td style="width:15%;"> 
                              <div fxLayout="row" fxLayoutAlign="start center">
                                <i class="fa fa-pencil" style="color:#4678fa;padding-top:5px;"></i>
                                <input type="number" oninput="if(value.length>3)value=value.slice(0,3)" style="width:100%;border:none;" class="pd-l-20 pd-r-10 text-center" [(ngModel)]="item.count" (blur)="changeCount($event,item)">
                              </div>
                          </td>
                          <td style="width:15%;" class="text-center">
                              {{item.totalPrice}}
                          </td>
                          <td style="width:8%;color:#4678fa;"><a (click)="deleteItem(item)">删除</a></td>
                      </tr>
                    </tbody>
                  </zm-table-detail>
                  
                  <div class="noData-tips text-center mg-t-30 mg-b-30" *ngIf="(giftWFCompData.productList.length==0) 
                  && (giftWFCompData.goodsList.length==0)
                  && (giftWFCompData.packageList.length==0)
                  && (giftWFCompData.cardList.length==0)">
                      <p class="mg-b-0" style="color:#999;">请点击上方进行添加购买项</p>
                  </div>
               </content>
             </zm-card-box>
            
  `,
  styles:[`
    
  `]
})
export class SelectConsumeComp implements OnInit,OnDestroy {

  private service: SelectConsumeService;
  public viewData: SelectConsumeViewData;

  //输入参数
  @Input() wFDataWraper: WFDataWraper;
  public prodRecordsWFCompData:ProdRecordsWFCompData;//项目
  public attachProdsWFCompData:AttachProdsWFCompData;//商品
  public productCardWFCompData:ProductCardWFCompData;//次卡
  public packageWFCompData:PackageWFCompData;//套餐
  public giftWFCompData:GiftWFCompData;//赠品

  public contentExpanded:boolean = false;
  public contentBuyExpanded:boolean = false;

  constructor(private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder: StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder: StorePackageProjectSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private wfDataWraperMgr:WFDataWraperMgr,
              private matDialog: MatDialog,
              ) {
    ZmModalMgr.getInstance().reset(this.matDialog);
    this.service = new SelectConsumeService(this.storeProductInfoSynDataHolder,
      this.storeGoodsSynDataHolder,
      this.storePackageProjectSynDataHolder,
      this.storeCardInfoSynDataHolder,
    );
  }

  ngOnInit() {
    this.prodRecordsWFCompData = this.wFDataWraper.getProdRecordsWFCompData();
    this.attachProdsWFCompData = this.wFDataWraper.getAttachProdsWFCompData();
    this.productCardWFCompData = this.wFDataWraper.getProductCardWFCompData();
    this.packageWFCompData = this.wFDataWraper.getPackageWFCompData();
    this.giftWFCompData = this.wFDataWraper.getGiftWFCompData();

    this.service.initViewData((viewDataTmp: SelectConsumeViewData) => {
      if (viewDataTmp) {
        this.viewData = viewDataTmp;
      }
    })
  }

  ngOnChanges(){
    this.prodRecordsWFCompData = this.wFDataWraper.getProdRecordsWFCompData();
    this.attachProdsWFCompData = this.wFDataWraper.getAttachProdsWFCompData();
    this.productCardWFCompData = this.wFDataWraper.getProductCardWFCompData();
    this.packageWFCompData = this.wFDataWraper.getPackageWFCompData();
    this.giftWFCompData = this.wFDataWraper.getGiftWFCompData();

    if((this.prodRecordsWFCompData.productList.length>0)
      || (this.attachProdsWFCompData.goodsList.length>0)
      || (this.packageWFCompData.packageList.length>0)
      || (this.productCardWFCompData.cardList.length>0)){
      this.contentBuyExpanded = true;
    }

    if((this.giftWFCompData.productList.length>0)
      || (this.giftWFCompData.goodsList.length>0)
      || (this.giftWFCompData.packageList.length>0)
      || (this.giftWFCompData.cardList.length>0)){
      this.contentExpanded = true;
    }
  }

  ngOnDestroy(): void {

  }

  /**
   * 弹出选择项目popup
   */
  selectProduct(event,recordType:RecordTypeEnum):void{
    event.stopPropagation();
    let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
    if(!AppUtils.isNullObj(selectLeaguer) && !AppUtils.isNullOrWhiteSpace(selectLeaguer.id)){
      if(recordType == RecordTypeEnum.Buy){
        this.prodRecordsWFCompData = this.wFDataWraper.getProdRecordsWFCompData();
        this.prodRecordsWFCompData.productList.forEach((item) =>{
          let productInfo = this.viewData.productMap.get(item.id);
          if(!AppUtils.isNullObj(productInfo)){
            this.viewData.choosedProductList.push(productInfo);
          }
        })
      }else if(recordType == RecordTypeEnum.Donation){
        this.giftWFCompData = this.wFDataWraper.getGiftWFCompData();
        this.giftWFCompData.productList.forEach((item) =>{
          let productInfo = this.viewData.productMap.get(item.id);
          if(!AppUtils.isNullObj(productInfo)){
            this.viewData.choosedProductList.push(productInfo);
          }
        })
      }
      const activeModal = ZmModalMgr.getInstance().newLgModal(SelectProductPopupComp,null,null);
      //设置弹窗数据
      activeModal.componentInstance.data = SelectProductPopupViewData.fromConsume(this.viewData);
      activeModal.componentInstance.action = this.selectProductCallback.bind(this,recordType);
    }else{
      AppUtils.showWarn("提示","请选择会员");
    }
  }

  /**
   * 选择项目回调
   */
  selectProductCallback(recordType:RecordTypeEnum):void{
    if(recordType==RecordTypeEnum.Buy){
      this.contentBuyExpanded = true;
    }
    if(recordType==RecordTypeEnum.Donation){
      this.contentExpanded = true;
    }

    let productList = this.viewData.choosedProductList.map((item) =>{
      let productItemData = ProductItemData.fromProduct(item);
      productItemData.recordType = recordType == RecordTypeEnum.Donation?RecordTypeEnum.Donation:RecordTypeEnum.Buy;
      productItemData.payType = recordType == RecordTypeEnum.Donation?PrdCardPayEnum.Donation:PrdCardPayEnum.CashPay;
      return productItemData;
    });
    this.viewData.choosedProductList.splice(0,this.viewData.choosedProductList.length);
    //设置项目折扣
    this.setDiscount(productList,BuyTypeEnum.PRODUCT,recordType);
    if(recordType == RecordTypeEnum.Buy){
      this.prodRecordsWFCompData.productList = productList;
    }else if(recordType == RecordTypeEnum.Donation){
      this.giftWFCompData.productList = productList;
    }
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

  /**
   * 弹出选择商品popup
   */
  selectGoods(event,recordType:RecordTypeEnum):void{
    event.stopPropagation();
    let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
    if(!AppUtils.isNullObj(selectLeaguer) && !AppUtils.isNullOrWhiteSpace(selectLeaguer.id)){
      if(recordType == RecordTypeEnum.Buy){
        this.attachProdsWFCompData = this.wFDataWraper.getAttachProdsWFCompData();
        this.attachProdsWFCompData.goodsList.forEach((item)=>{
          let goods = this.viewData.goodsMap.get(item.id);
          if(!AppUtils.isNullObj(goods)){
            this.viewData.choosedGoodsList.push(goods);
          }
        })
      }else if(recordType == RecordTypeEnum.Donation){
        this.giftWFCompData = this.wFDataWraper.getGiftWFCompData();
        this.giftWFCompData.goodsList.forEach((item)=>{
          let goods = this.viewData.goodsMap.get(item.id);
          if(!AppUtils.isNullObj(goods)){
            this.viewData.choosedGoodsList.push(goods);
          }
        })
      }
      const activeModal = ZmModalMgr.getInstance().newLgModal(SelectGoodsPopupComp,null,null);
      activeModal.componentInstance.data = SelectGoodsPopupViewData.fromConsume(this.viewData);
      activeModal.componentInstance.action = this.selectGoodsCallback.bind(this,recordType);
    }else{
      AppUtils.showWarn("提示","请选择会员");
    }
  }

  /**
   * 选择商品回调 添加到工作流
   */
  selectGoodsCallback(recordType:RecordTypeEnum):void{
    if(recordType==RecordTypeEnum.Buy){
      this.contentBuyExpanded = true;
    }
    if(recordType==RecordTypeEnum.Donation){
      this.contentExpanded = true;
    }
    let goodsList = this.viewData.choosedGoodsList.map((item) =>{
      let goodsItemData = GoodsItemData.fromGoods(item);
      goodsItemData.recordType = recordType == RecordTypeEnum.Donation?RecordTypeEnum.Donation:RecordTypeEnum.Buy;
      goodsItemData.payType = recordType == RecordTypeEnum.Donation?PrdCardPayEnum.Donation:PrdCardPayEnum.CashPay;
      return goodsItemData;
    });
    this.viewData.choosedGoodsList.splice(0,this.viewData.choosedGoodsList.length);
    //设置商品折扣
    this.setDiscount(goodsList,BuyTypeEnum.GOODS,recordType);
    if(recordType == RecordTypeEnum.Buy){
      this.attachProdsWFCompData.goodsList = goodsList;
    }else if(recordType == RecordTypeEnum.Donation){
      this.giftWFCompData.goodsList = goodsList;
    }
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

  /**
   * 弹出选择套餐popup
   */
  selectPackage(event,recordType:RecordTypeEnum):void{
    event.stopPropagation();
    let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
    if(!AppUtils.isNullObj(selectLeaguer) && !AppUtils.isNullOrWhiteSpace(selectLeaguer.id)){
      if(recordType == RecordTypeEnum.Buy){
        this.packageWFCompData = this.wFDataWraper.getPackageWFCompData();
        this.packageWFCompData.packageList.forEach((item)=>{
          let packageProject = this.viewData.packageMap.get(item.id);
          if(!AppUtils.isNullObj(packageProject)){
            this.viewData.choosedPackageList.push(packageProject);
          }
        })
      }else if(recordType == RecordTypeEnum.Donation){
        this.giftWFCompData = this.wFDataWraper.getGiftWFCompData();
        this.giftWFCompData.packageList.forEach((item)=>{
          let packageProject = this.viewData.packageMap.get(item.id);
          if(!AppUtils.isNullObj(packageProject)){
            this.viewData.choosedPackageList.push(packageProject);
          }
        })
      }
      const activeModal = ZmModalMgr.getInstance().newLgModal(SelectPackagePopupComp,null,null);
      activeModal.componentInstance.data = SelectPackagePopupViewData.fromConsume(this.viewData);
      activeModal.componentInstance.action = this.selectPackageCallback.bind(this,recordType);
    }else{
      AppUtils.showWarn("提示","请选择会员");
    }
  }

  /**
   * 选择套餐回调 添加到工作流
   */
  selectPackageCallback(recordType:RecordTypeEnum):void{
    if(recordType==RecordTypeEnum.Buy){
      this.contentBuyExpanded = true;
    }
    if(recordType==RecordTypeEnum.Donation){
      this.contentExpanded = true;
    }
    let packageList = this.viewData.choosedPackageList.map((item) =>{
      let packageItemData = PackageItemData.fromPackage(item);
      packageItemData.recordType = recordType == RecordTypeEnum.Donation?RecordTypeEnum.Donation:RecordTypeEnum.Buy;
      packageItemData.payType = recordType == RecordTypeEnum.Donation?PrdCardPayEnum.Donation:PrdCardPayEnum.CashPay;
      return packageItemData;
    });
    this.viewData.choosedPackageList.splice(0,this.viewData.choosedPackageList.length);
    //设置套餐折扣
    this.setDiscount(packageList,BuyTypeEnum.PACKAGE,recordType);
    if(recordType == RecordTypeEnum.Buy){
      this.packageWFCompData.packageList = packageList;
    }else if(recordType == RecordTypeEnum.Donation){
      this.giftWFCompData.packageList = packageList;
    }
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

  /**
   * 弹出选择次卡popup
   */
  selectCard(event,recordType:RecordTypeEnum):void{
    event.stopPropagation();
    let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
    if(!AppUtils.isNullObj(selectLeaguer) && !AppUtils.isNullOrWhiteSpace(selectLeaguer.id)){
      if(recordType == RecordTypeEnum.Buy){
        this.productCardWFCompData = this.wFDataWraper.getProductCardWFCompData();
        this.productCardWFCompData.cardList.forEach((item)=>{
          let productCard = this.viewData.productCardMap.get(item.id);
          if(!AppUtils.isNullObj(productCard)){
            this.viewData.choosedCardList.push(productCard);
          }
        })
      }else if(recordType == RecordTypeEnum.Donation){
        this.giftWFCompData = this.wFDataWraper.getGiftWFCompData();
        this.giftWFCompData.cardList.forEach((item)=>{
          let productCard = this.viewData.productCardMap.get(item.id);
          if(!AppUtils.isNullObj(productCard)){
            this.viewData.choosedCardList.push(productCard);
          }
        })
      }
      const activeModal = ZmModalMgr.getInstance().newLgModal(SelectCardPopupComp,null,null);
      activeModal.componentInstance.data = SelectCardPopupViewData.fromConsume(this.viewData);
      activeModal.componentInstance.action = this.selectCardCallback.bind(this,recordType);
    }else{
      AppUtils.showWarn("提示","请选择会员");
    }
  }

  /**
   * 选择次卡回调 添加到工作流
   */
  selectCardCallback(recordType:RecordTypeEnum):void{
    if(recordType==RecordTypeEnum.Buy){
      this.contentBuyExpanded = true;
    }
    if(recordType==RecordTypeEnum.Donation){
      this.contentExpanded = true;
    }
    let cardList = this.viewData.choosedCardList.map((item) =>{
      let cardItemData = CardItemData.fromCard(item);
      cardItemData.recordType = recordType == RecordTypeEnum.Donation?RecordTypeEnum.Donation:RecordTypeEnum.Buy;
      cardItemData.payType = recordType == RecordTypeEnum.Donation?PrdCardPayEnum.Donation:PrdCardPayEnum.CashPay;
      return cardItemData;
    });
    this.viewData.choosedCardList.splice(0,this.viewData.choosedCardList.length);
    this.setDiscount(cardList,BuyTypeEnum.PRDCARD,recordType);
    if(recordType == RecordTypeEnum.Buy){
      this.productCardWFCompData.cardList = cardList;
    }else if(recordType == RecordTypeEnum.Donation){
      this.giftWFCompData.cardList = cardList;
    }
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

  /**
   * 设置折扣
   * @param arraySuperItemData
   */
  private setDiscount(arraySuperItemData: Array<SuperItemData>,buyType:number,recordType:RecordTypeEnum) {
    if(recordType == RecordTypeEnum.Buy){
      let selectLeaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
      let memberCard = this.wFDataWraper.getCuserWFCompData().memberCard;
      if (!AppUtils.isNullObj(selectLeaguer)
        && !AppUtils.isNullObj(memberCard)
        && !AppUtils.isNullObj(selectLeaguer.leaguerMemberCard)
        && (selectLeaguer.leaguerMemberCard.state == LeaguerCardEnum.VALID)) {
        let discount:number = 10;
        let itemDataMap = new ZmMap();
        if(buyType == BuyTypeEnum.PRODUCT){
          discount = memberCard.prodDiscount;
          itemDataMap = this.buildProductItemDataMap();
        }else if(buyType == BuyTypeEnum.GOODS){
          discount = memberCard.goodsDiscount;
          itemDataMap = this.buildGoodsItemDataMap();
        }else if(buyType == BuyTypeEnum.PACKAGE){
          discount = memberCard.packagePrjDiscount;
          itemDataMap = this.buildPackageItemDataMap();
        }else if(buyType == BuyTypeEnum.PRDCARD){
          discount = memberCard.prdCardDiscount;
          itemDataMap = this.buildCardItemDataMap();
        }
        if (discount >= 0 && discount <= 10) {
          let dis: number = discount / 10;
          arraySuperItemData.forEach((item) => {
            if(itemDataMap.contains(item.id)){
              AppUtils.copy(item,itemDataMap.get(item.id));
            }else{
              item.discount = AppUtils.roundPoint(discount, 1);
              item.cost = AppUtils.roundPoint((item.cost * dis), 2);
              item.price = AppUtils.roundPoint(item.oldPrice*dis,2);
            }
          })
        }
      }
    }
  }

  /**
   * 组装productItemDataMap
   */
  private buildProductItemDataMap():ZmMap<ProductItemData>{
    let productItemDataMap = new ZmMap<ProductItemData>();
    this.prodRecordsWFCompData.productList.forEach((item)=>{
      productItemDataMap.put(item.id,item);
    })
    return productItemDataMap;
  }

  /**
   * 组装goodsItemDataMap
   */
  private buildGoodsItemDataMap():ZmMap<GoodsItemData>{
    let goodsItemDataMap = new ZmMap<GoodsItemData>();
    this.attachProdsWFCompData.goodsList.forEach((item)=>{
      goodsItemDataMap.put(item.id,item);
    })
    return goodsItemDataMap;
  }

  /**
   * 组装cardItemDataMap
   */
  private buildCardItemDataMap():ZmMap<CardItemData>{
    let cardItemDataMap = new ZmMap<CardItemData>();
    this.productCardWFCompData.cardList.forEach((item)=>{
      cardItemDataMap.put(item.id,item);
    })
    return cardItemDataMap;
  }

  /**
   * 组装packageItemDataMap
   */
  private buildPackageItemDataMap():ZmMap<PackageItemData>{
    let packageItemDataMap = new ZmMap<PackageItemData>();
    this.packageWFCompData.packageList.forEach((item)=>{
      packageItemDataMap.put(item.id,item);
    })
    return packageItemDataMap;
  }

  /**
   * 删除
   * @param superItemData
   */
  deleteItem(superItemData){
    Popup.getInstance().open("提示","是否删除该项？",()=>{
      if(superItemData.recordType == RecordTypeEnum.Buy){
        if(superItemData.type == BuyTypeEnum.PRODUCT){
          this.prodRecordsWFCompData.productList.splice(this.prodRecordsWFCompData.productList.indexOf(superItemData),1);
          this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
        }else if(superItemData.type == BuyTypeEnum.GOODS){
          this.attachProdsWFCompData.goodsList.splice(this.attachProdsWFCompData.goodsList.indexOf(superItemData),1);
          this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
        }else if(superItemData.type == BuyTypeEnum.PACKAGE){
          this.packageWFCompData.packageList.splice(this.packageWFCompData.packageList.indexOf(superItemData),1);
          this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
        }else if(superItemData.type == BuyTypeEnum.PRDCARD){
          this.productCardWFCompData.cardList.splice(this.productCardWFCompData.cardList.indexOf(superItemData),1);
          this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
        }
      }else{
        if(superItemData.type == BuyTypeEnum.PRODUCT){
          this.giftWFCompData.productList.splice(this.prodRecordsWFCompData.productList.indexOf(superItemData),1);
          this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
        }else if(superItemData.type == BuyTypeEnum.GOODS){
          this.giftWFCompData.goodsList.splice(this.attachProdsWFCompData.goodsList.indexOf(superItemData),1);
          this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
        }else if(superItemData.type == BuyTypeEnum.PACKAGE){
          this.giftWFCompData.packageList.splice(this.packageWFCompData.packageList.indexOf(superItemData),1);
          this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
        }else if(superItemData.type == BuyTypeEnum.PRDCARD){
          this.giftWFCompData.cardList.splice(this.productCardWFCompData.cardList.indexOf(superItemData),1);
          this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
        }
      }
    })
  }

  /**
   * 修改单价
   * @param e
   * @param superItemData
   */
  changePrice(e,superItemData){
    let superItemDataTmp = new SuperItemData();
    AppUtils.copy(superItemDataTmp,superItemData);
    let price = e.target.value;
    price = price?price:superItemDataTmp.oldPrice;
    price = price<0?0:price;
    price = AppUtils.roundPoint(price,2);
    if(price > superItemDataTmp.oldPrice){
      AppUtils.showWarn("提示","售价不能大于原价");
      price = superItemDataTmp.oldPrice;
    }
    superItemDataTmp.price = price;
    superItemDataTmp.discount = AppUtils.roundPoint((superItemDataTmp.price/superItemDataTmp.oldPrice)*10,2);
    superItemDataTmp.cost = AppUtils.roundPoint(price*superItemDataTmp.count,2);
    AppUtils.copy(superItemData, superItemDataTmp);
    this.wfDataWraperMgr.changeBonusItemPrice(superItemData);
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

  /**
   * 修改数量
   * @param e
   * @param superItemData
   */
  changeCount(e,superItemData){
    let count = e.target.value;
    let superItemDataTmp = new SuperItemData();
    AppUtils.copy(superItemDataTmp,superItemData);
    count = count?count:1;
    count = AppUtils.isPositiveInteger(count)?parseInt(count):1;
    superItemDataTmp.count = count;
    if(superItemData.recordType == RecordTypeEnum.Buy){
      superItemDataTmp.totalPrice = AppUtils.roundPoint(superItemDataTmp.oldPrice*count,2);
      superItemDataTmp.cost = AppUtils.roundPoint(superItemDataTmp.price*count,2);
    }else if(superItemData.recordType == RecordTypeEnum.Donation){
      superItemDataTmp.totalPrice = AppUtils.roundPoint(superItemDataTmp.oldPrice*count,2);
    }
    AppUtils.copy(superItemData, superItemDataTmp);
    this.wfDataWraperMgr.changeBonusItemPrice(superItemData);
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

  /**
   * 修改预存数量
   * @param e
   * @param superItemData
   */
  changeRestCount(e,superItemData){
    let restCount = e.target.value;
    restCount = restCount?restCount:0;
    restCount = AppUtils.isPositiveInteger(restCount)?parseInt(restCount):0;
    if(restCount > superItemData.count){
      AppUtils.showWarn("提示","预存数量不能大于购买数量");
      restCount = superItemData.count
    }
    superItemData.restCount = restCount;
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

  /**
   * 修改折扣
   * @param e
   * @param superItemData
   */
  changeDiscount(e,superItemData){
    let discountE = e;
    let superItemDataTmp = new SuperItemData();
    AppUtils.copy(superItemDataTmp,superItemData);
    superItemDataTmp.discount = discountE;
    superItemDataTmp.price = AppUtils.roundPoint(superItemDataTmp.oldPrice*(discountE/10),2);
    superItemDataTmp.cost = AppUtils.roundPoint(superItemDataTmp.price*superItemDataTmp.count,2);
    AppUtils.copy(superItemData, superItemDataTmp);
    this.wfDataWraperMgr.changeBonusItemPrice(superItemData);
    this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
  }

}
export class SelectConsumeService{

  constructor(private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeGoodsSynDataHolder:StoreGoodsSynDataHolder,
              private storePackageProjectSynDataHolder:StorePackageProjectSynDataHolder,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              ){}

  public async initViewData(callback:(viewDataP:SelectConsumeViewData) => void){
    let viewDataTmp = new SelectConsumeViewData();
    let storeId = SessionUtil.getInstance().getStoreId();

    //店铺项目
    let storeProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storeProductInfo)){
      viewDataTmp.productMap = storeProductInfo.getOpenProductInfoMap();
      viewDataTmp.productList = viewDataTmp.productMap.values();
      viewDataTmp.productTypeMap = storeProductInfo.getProductTypeMap();
      viewDataTmp.productTypeList = viewDataTmp.productTypeMap.values();
    }
    //店铺商品
    let storeGoods:StoreGoods = await this.storeGoodsSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storeGoods)){
      viewDataTmp.goodsMap = storeGoods.getOpenGoodsMap();
      viewDataTmp.goodsList = viewDataTmp.goodsMap.values();
      viewDataTmp.goodsTypeMap = storeGoods.getValidGoodsTypeMap();
      viewDataTmp.goodsTypeList = viewDataTmp.goodsTypeMap.values();
    }

    //店铺套餐
    let storePackageProject:StorePackageProject = await this.storePackageProjectSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storePackageProject)){
      viewDataTmp.packageMap = storePackageProject.getOpenPackageProjectMap();
      viewDataTmp.packageList = viewDataTmp.packageMap.values();
      viewDataTmp.packageTypeMap = storePackageProject.getValidPackageTypeMap();
      viewDataTmp.packageTypeList = viewDataTmp.packageTypeMap.values();
    }


    //店铺次卡
    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storeCardInfo)){
      viewDataTmp.productCardMap = storeCardInfo.getOpenProductCardMap();
      viewDataTmp.productCardList = viewDataTmp.productCardMap.values();
      viewDataTmp.cardTypeMap = storeCardInfo.getAllProductCardTypeMap();
      viewDataTmp.cardTypeList = viewDataTmp.cardTypeMap.values();
    }
    callback(viewDataTmp);
  }

}

export class SelectConsumeViewData{
  /***************************************项目********************************************/
  public productMap:ZmMap<ProductInfo>;
  public productList:Array<ProductInfo> = new Array();
  public productTypeMap:ZmMap<ProductType>;
  public productTypeList:Array<ProductType> = new Array();
  //选中的项目列表
  public choosedProductList:Array<ProductInfo> = new Array();
  public choosedProductListTmp:Array<ProductInfo> = new Array();
  /***************************************项目********************************************/

  /***************************************商品********************************************/
  public goodsMap:ZmMap<Goods>;
  public goodsList:Array<Goods>;
  public goodsTypeMap:ZmMap<GoodsType>;
  public goodsTypeList:Array<GoodsType> = new Array();
  //选中的商品列表
  public choosedGoodsList:Array<Goods> = new Array<Goods>();
  public choosedGoodsListTmp:Array<Goods> = new Array<Goods>();
  /***************************************商品********************************************/

  /***************************************套餐********************************************/
  public packageMap:ZmMap<PackageProject>;
  public packageList:Array<PackageProject> = new Array();
  public packageTypeMap:ZmMap<PackageProjectType>;
  public packageTypeList:Array<PackageProjectType> = new Array();
  //选中的套餐列表
  public choosedPackageList:Array<PackageProject> = new Array<PackageProject>();
  public choosedPackageListTmp:Array<PackageProject> = new Array<PackageProject>();
  /***************************************套餐********************************************/

  /***************************************次卡********************************************/
  public productCardMap:ZmMap<ProductCard>;
  public productCardList:Array<ProductCard> = new Array();
  public cardTypeMap:ZmMap<PrdCardType>;
  public cardTypeList:Array<PrdCardType> = new Array();
  //选中的次卡列表
  public choosedCardList:Array<ProductCard> = new Array<ProductCard>();
  public choosedCardListTmp:Array<ProductCard> = new Array<ProductCard>();
  /***************************************次卡********************************************/
}
