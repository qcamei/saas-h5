import {Component, Inject} from "@angular/core";
import {AppUtils, ZmMap} from "../../../../../comModule/AppUtils";
import {ProductWithCardData, ProductCompViewData} from "../productComp";
import {ProductInfo} from "../../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../../../bsModule/StoreProductInfo/data/ProductType";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 选择会员划卡
 */
@Component({
  selector:'select-product',
  template:`
      <div>
        <h2 mat-dialog-title>
           选择划卡项目
        </h2>
        <mat-dialog-content fusePerfectScrollbar>
                <div fxLayout="row wrap"  fxLayoutGap="20px" >
                    
                      <zm-search-box [label]=" '查询'" [placeholder]="'请输入编号/名称查询'" [(zmValue)]="data.cardQueryParam" (callBack)="findCardProduct()"></zm-search-box>
                      
                    <zm-select  [label]="'项目分类'"  [selectList] = "data.productTypeList" name="name"  value="id"
                      [(zmValue)]="data.cardProductTypeId"   (selectCallback)="findCardProduct()"></zm-select>
                      
                </div>
                <div  fxLayout="row wrap" fxLayoutAlign="space-between center" fxLayoutGap="20px" class="zmFullWidth">
                               
                                <div fxFlex="1 1 60%">
                                      <table class="scrollTable table table-bordered zmFullWidth">
                                          <thead>
                                              <th style="width:10%;">序号</th>
                                              <th style="width:20%;">编号</th>
                                              <th style="width:15%;">项目名称</th>
                                              <th style="width:20%;">项目分类</th>
                                              <th style="width:20%;">所属次卡</th>
                                              <th style="width:15%;">剩余次数</th>
                                          </thead>
                                          <tbody fusePerfectScrollbar>
                                              <tr *ngFor="let item of data.productWithCardListTmp;let i=index;" (click)="selectCardProduct(item)" (mouseover)="itemActiveHover(i)" [class.itemActiveClass]="itemActiveIndex===i?'itemActive':''">
                                                  <td style="width:10%;"><span *ngIf="itemActiveIndex!==i">{{i+1}}</span><img src="assets/images/selectItem.png" *ngIf="itemActiveIndex===i"></td>
                                                  <td style="width:20%;">{{item.productNumber?item.productNumber:'-'}}</td> 
                                                  <td style="width:15%;">{{item.productName?item.productName:'不限'}}</td> 
                                                  <td style="width:20%;">{{item.productTypeId | productTypePipe:data.productTypeMap}}</td> 
                                                  <td style="width:20%;">{{item.productCardName}}</td> 
                                                  <td style="width:15%;">{{item.count == 0?'无限次':item.count}}</td> 
                                              </tr>
                                          </tbody>
                                      </table>    
                                </div>
                                <div fxFlex="1 1 auto" style="text-align: center"><img src="assets/images/direction.png" alt=""/></div>
                                <div fxFlex="1 1 35%">
                                    <table class="scrollTable table table-bordered">
                                        <thead>
                                            <th style="width:20%;">编号</th>
                                            <th style="width:30%;">项目名称</th>
                                            <th style="width:20%;">售价</th>
                                            <th style="width:20%;">操作</th>
                                        </thead>
                                        <tbody style="height:340px;" fusePerfectScrollbar>
                                            <tr *ngFor="let item of data.choosedCardProductListTmp;let i=index;">
                                                <td style="width:20%;">{{item.productNumber?item.productNumber:'-'}}</td> 
                                                <td style="width:30%;">{{item.productName?item.productName:'不限'}}</td> 
                                                <td style="width:20%;">{{item.productPrice?item.productPrice:'-'}}</td> 
                                                <td style="width:20%;"><span class="color-theme cur-hand" (click)="deleteCardProduct(i)">删除</span></td> 
                                            </tr>
                                           <div *ngIf="data.choosedCardProductListTmp.length == 0" style="margin: 150px 0;"><p class="font-c2 mg-b-0">请在左边选择项目添加</p></div>
                                        </tbody>
                                    </table>    
                                </div>
                </div>
        
        </mat-dialog-content>
        <mat-dialog-actions>
          <div  fxLayout="row wrap" fxLayoutAlign="end" fxLayoutGap="20px" class="zmFullWidth">
                <div class="pd-r-10" (click)="closeModal()">
                     <button class="cancel-btn">取消</button>
                </div>
                <div class="pd-l-10">
                      <button class="confirm-btn" (click)="confirm()">确定</button>
                </div>
         </div>
        </mat-dialog-actions>
    </div>

  `,
  styles:[`
thead th {
    font-size: 14px;
    text-align: center;
    font-weight: bold;
    background-color: #f4f6fa !important;
  }
  tbody tr{
    margin-top: -1px;
  }
  tbody tr:nth-of-type(odd){
    background-color: #ffffff;
  }
  tbody tr:nth-of-type(even),tbody tr:nth-of-type(even) input,tbody tr:nth-of-type(even) select{
    background-color:#f9fafc;
  }
  tbody .c-tr:hover{
    background-color: #e7f3fd;
  }
  tbody a{cursor:pointer;}
  tbody a:hover{text-decoration: none;color:#03a9f4 !important;}
  
  th, td{
    vertical-align: middle !important;
    font-size: 14px;
    word-wrap:break-word;
    word-break: break-all;
  }
  thead th{
    border-bottom-width: 1px !important;
  }
  select.form-control:not([size]):not([multiple]){
    -moz-appearance: none;
    -webkit-appearance: none;
    background-image:url(./assets/images/arrow.png);
    background-repeat: no-repeat;
    background-position:95% 50%;
    font-size: 14px;
    padding-right: 25px;
  }
  select.c-form-select:not([size]):not([multiple]){
    -moz-appearance: none;
    -webkit-appearance: none;
    background-image:url(./assets/images/arrow.png);
    background-repeat: no-repeat;
    background-position:95% 50%;
    font-size: 14px;
    padding-right: 25px;
  }
  select::-ms-expand { display: none; }
 
  input[type=number] {
    -moz-appearance: textfield;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .table {
    font-size: 12px;
    text-align: center;
  }
  .table thead th {
    white-space: nowrap;
    padding:5px 2px;
    box-sizing:border-box;
  }
  .table tbody tr td{
    padding:8px;
    font-size: 12px;
    box-sizing:border-box;
  }
  .scroll-table tr td:nth-child(1){
    width: 30%;
  }
  .scroll-table tr td:nth-child(2){
    width: 40%;
  }
  .search-input{
    outline: none;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    background: #F4F6FA;
    height: 30px;
    border: 1px solid #ECEFF3;
    padding: 0 10px;
    font-size: 14px;
  }

  .scrollTable{
    border:none;
  }
  .scrollTable tbody {
    display: block;
    height: 400px;
    overflow-y: auto;
  }
  .scrollTable thead {
    display: table;
    width: -moz-calc(100% - 10px);
    width: calc(100% - 10px);
    width: 100%;
    table-layout: fixed;
  }
  .scrollTable tr{
    display: table;
    width: 100%;
  }
  
.table {
  font-size: 14px;
  table-layout: fixed;
}
.table thead th {
  white-space: nowrap;
  padding:5px 2px;
  box-sizing:border-box;
}
.table tbody tr td{
  padding:8px;
  font-size: 14px;
  box-sizing:border-box;
}
.scroll-table tr td:nth-child(1){
  width: 30%;
}
.scroll-table tr td:nth-child(2){
  width: 40%;
}
.search-input{
  outline: none;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background: #F4F6FA;
  height: 30px;
  border: 1px solid #ECEFF3;
  padding: 0 10px;
  font-size: 14px;
}
.close{
  outline:none;
}
.fa-pencil{
  top:2px;
}

.scrollTable thead th{
  border-bottom: none;
}
.scrollTable thead {
  display: table;
  width: -moz-calc(100% - 10px);
  width: calc(100% - 10px);
  width: 100%;
  table-layout: fixed;
}
.scrollTable tbody{
  height:340px;
  overflow-x:hidden;
  overflow-y:auto;
  border:1px solid #e9ecef;
}
.scrollTable tbody tr:last-child{
  border-bottom:none ;
}
.scrollTable tbody tr td{
  word-break: break-all;
  word-wrap:break-word;
}
.scrollTable tr td:first-child{
  border-left: none;
}
.scrollTable tr td:last-child{
  border-right: none;
}
.cancel-btn{
  background: #fff;
  border: 2px solid#03a9f4;
  color:#03a9f4;
  width: 168px;
  line-height: 48px;
  -moz-border-radius: 8px;
       border-radius: 8px;
  cursor: pointer;
}
.cancel-btn:focus {
    outline: none;
}

.confirm-btn {
  background:#03a9f4;
  border: 2px solid#03a9f4;
  color: #fff;
  width: 168px;
  line-height: 48px;
  -moz-border-radius: 8px;
       border-radius: 8px;
  cursor: pointer;
}
.confirm-btn:focus {
    outline: none;
}
.color-theme{
  color:#03a9f4;
} 
.cur-hand{
  cursor: pointer;
}

.search-input{
  outline: none;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background: #F4F6FA;
  height: 30px;
  border: 1px solid #ECEFF3;
  padding: 0 10px;
  font-size: 14px;
}
.close{
  outline:none;
}
.fa-pencil{
  top:2px;
}

.scrollTable thead th{
  border-bottom: none;
}
.scrollTable tbody{
  height:340px;
  overflow-x:hidden;
  overflow-y:auto;
  border:1px solid #e9ecef;
}
.scrollTable tbody tr:last-child{
  border-bottom:none ;
}
.scrollTable tbody tr td{
  word-break: break-all;
  word-wrap:break-word;
}
.scrollTable tr td:first-child{
  border-left: none;
}
.scrollTable tr td:last-child{
  border-right: none;
}
.tab {
  font-weight: normal;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
.form-control {
  padding: 0 10px;
  height: 30px !important;
  display: inline-block;
  padding-right: 20px;
  border-width: 1px !important;
}
.itemActiveClass{
  background:#03a9f4 !important;
  color:#fff;
  cursor:pointer;
}
.itemActiveClass td{
  border:none;
}
.icon-dir{
  position: absolute;
  right: 330px;
  top: 300px;
  width: 7px;
}
.nb-theme-default .modal-body ::-webkit-scrollbar{
  float: left !important;

}
.disFlex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: -moz-box;
  display: flex;
}
.flex {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  -webkit-flex: 1;
     -moz-box-flex: 1;
          flex: 1;
}
.align-center{
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -moz-box-align: center;
  align-items: center;
} 
.set-bg{
  background-color:#F4F6FA !important;
} 
.mg-l-20{
  margin-left: 20px;
} 
.c-hued {
  width: 100px;
}
.mg-t-20{
  margin-top:20px;
} 
.font-c2{
  color: #bcc2c8;
} 
.mg-b-0{
  margin-bottom: 0;
} 
.text-right{
  text-align: right;
}
.color-theme{
  color:#03a9f4;
} 
.cur-hand{
  cursor: pointer;
} 
.pd-r-10{
  padding-right: 10px;
} 
.fz-16{
  font-size: 16px;
}
.font-bold{
  font-weight: bold;
}
.form-control:focus{
  box-shadow: none;
}
`],
})

export class ProductCardPopup{
  data:ProductCardPopupViewData;
  action:any;
  activeModal:any;

  itemActiveIndex:number = -1;
  private service: ProductCardPopupService;
  public viewData: ProductCardPopupViewData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.service = new ProductCardPopupService();
    this.activeModal = dataInput.modalCtrl;
    this.data = dataInput.modalData;
    this.action = dataInput.callBack ;
  }

  /*
   * 鼠标hover事件
   */
  itemActiveHover(index):void{
    this.itemActiveIndex = index;
  }
  //
  // //样式处理
  // ngAfterViewInit():void{
  //   let n = document.getElementsByClassName('nav-link');
  //   for(let i=0;i<n.length;i++){
  //     if(i === 0){
  //       (<any>n[i]).style.color = '#4678fa';
  //       (<any>n[i]).style.fontWeight = 'bold';
  //     }else{
  //       (<any>n[i]).style.color = '#2a2a2a';
  //     }
  //   }
  // }
  //
  // switchTabs(e):void{
  //   let n = document.getElementsByClassName('nav-link');
  //   for(let i=0;i<n.length;i++){
  //     if(e.target.innerText === '店内项目' || e.target.innerText === '会员划卡'){
  //       (<any>n[i]).style.color = '#2a2a2a';
  //       (<any>n[i]).style.fontWeight = 'normal';
  //     }
  //   }
  //   if(e.target.innerText === '店内项目' || e.target.innerText === '会员划卡'){
  //     e.target.style.color = "#4678fa" ;
  //     e.target.style.fontWeight = "bold" ;
  //   }
  // }

  ngOnInit(): void {
    //划卡项目
    let choosedCardProductListTmp = new Array<ProductWithCardData>();
    this.data.choosedCardProductList.forEach((item) =>{
      if(!AppUtils.arrayContains(this.data.choosedCardProductListTmp,item)){
        choosedCardProductListTmp.push(item);
      }
    });
    this.data.choosedCardProductListTmp = choosedCardProductListTmp;

  }

  /**
   * 页面点击事件 选择划卡项目添加到选中列表
   * @param item
   */
  selectCardProduct(item:ProductWithCardData){
    if(!AppUtils.arrayContains(this.data.choosedCardProductListTmp,item)){
      this.data.choosedCardProductListTmp.push(item);
    }else{
      AppUtils.showWarn("提示","已选择该划卡项目");
    }
  }

  /**
   * 删除选中划卡项目
   * @param index
   */
  deleteCardProduct(index){
    this.data.choosedCardProductListTmp.splice(index,1);
  }

  /**
   * 页面点击事件 取消关闭弹窗
   */
  closeModal() {
    this.data.choosedCardProductList.splice(0,this.data.choosedCardProductList.length);
    this.activeModal.close();
  }

  /**
   * 页面点击事件 确定
   */
  confirm(){
    this.data.choosedCardProductList.splice(0,this.data.choosedCardProductList.length);
    this.data.choosedCardProductListTmp.forEach((item) =>{
      this.data.choosedCardProductList.push(item);
    });

    this.action();
    this.activeModal.close();
  }

  /**
   * 页面点击事件 根据名称/分类查询划卡项目
   */
  findCardProduct(){
    let cardProducts:Array<ProductWithCardData> = this.data.productWithCardList;
    if(!AppUtils.isNullOrWhiteSpace(this.data.cardQueryParam)){
      let queryParam = AppUtils.trimBlank(this.data.cardQueryParam);

      cardProducts = cardProducts.filter((item) => {
        if((item.productName && (item.productName.indexOf(queryParam) > -1))
          || (item.productNumber && (item.productNumber.toString().indexOf(queryParam) > -1))){
          return true;
        }else{
          return false;
        }
      });
    }

    if(this.data.cardProductTypeId!="0"){
      cardProducts = cardProducts.filter((item) => {
        if(item.productTypeId == this.data.cardProductTypeId){
          return true;
        }else{
          return false;
        }
      });
    }

    this.data.productWithCardListTmp = cardProducts;
  }

}


export class ProductCardPopupService{
  constructor(){}
}

export class ProductCardPopupViewData{
  public productMap:ZmMap<ProductInfo>;
  public productList:Array<ProductInfo> = new Array();
  //项目类型
  public productTypeMap: ZmMap<ProductType>;
  public productTypeList: Array<ProductType>;

  /*********************************会员划卡数据*****************************************/
  public productWithCardList: Array<ProductWithCardData>;
  public productWithCardListTmp: Array<ProductWithCardData>;
  //选中的次卡项目
  public choosedCardProductList: Array<ProductWithCardData>;
  public choosedCardProductListTmp: Array<ProductWithCardData>;

  //查询参数
  public cardQueryParam:string;
  public cardProductTypeId:string = "0";


  public static fromComp(productCompViewData:ProductCompViewData):ProductCardPopupViewData{
    let productCardPopupViewData = new ProductCardPopupViewData();

    /*店内项目*/
    productCardPopupViewData.productTypeList = productCompViewData.productTypeList;
    productCardPopupViewData.productMap = productCompViewData.productMap;
    productCardPopupViewData.productTypeMap = productCompViewData.productTypeMap;

    /*划卡项目*/
    productCardPopupViewData.productWithCardList = productCompViewData.productWithCardList;
    productCardPopupViewData.productWithCardListTmp = productCompViewData.productWithCardListTmp;
    productCardPopupViewData.choosedCardProductList = productCompViewData.choosedCardProductList;
    productCardPopupViewData.choosedCardProductListTmp = productCompViewData.choosedCardProductListTmp;
    return productCardPopupViewData;
  }

}
