import {Component, OnInit, Inject} from "@angular/core";
import {AppUtils, ZmMap} from "../../../../../comModule/AppUtils";
import {ProductCompViewData} from "../productComp";
import {ProductInfo} from "../../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../../../bsModule/StoreProductInfo/data/ProductType";
import {MAT_DIALOG_DATA} from "@angular/material";

/**
 * 选择项目组件
 */
@Component({
  selector:'select-product',
  template:`
    <div>
        <h2 mat-dialog-title>
           选择项目
        </h2>
        <mat-dialog-content fusePerfectScrollbar>
                <div fxLayout="row wrap"  fxLayoutGap="20px" >
                    
                
                      <zm-search-box [label]=" '项目查询'" [placeholder]="'请输入编号/名称查询'" [(zmValue)]="data.queryParam" (callBack)="findProduct()"></zm-search-box>
                    <zm-select-string  [label]="'项目分类'"  [selectList] = "data.productTypeList" name="name" value="id"
                            [(zmValue)]="data.productTypeId"   (selectCallback)="findProduct()"></zm-select-string>
                </div>
                <div  fxLayout="row wrap" fxLayoutAlign="space-between center"  class="zmFullWidth">
                               
                                <div fxFlex="1 1 60%">
                                    <table class="scrollTable table table-bordered">
                                        <thead>
                                            <th style="width:10%;">序号</th>
                                            <th style="width:20%;">编号</th>
                                            <th style="width:30%;">项目名称</th>
                                            <th style="width:20%;">分类</th>
                                            <th style="width:20%;">售价</th>
                                        </thead>
                                        <tbody fusePerfectScrollbar>
                                            <tr class="pos-r" *ngFor="let item of data.productList;let i=index;" (click)="selectProduct(item)"  [class.itemActiveClass]="itemActiveIndex===i?'itemActive':''">
                                                <td style="width:10%;"><span *ngIf="itemActiveIndex!==i">{{i+1}}</span><img src="assets/images/selectItem.png" *ngIf="itemActiveIndex===i"></td> 
                                                <td style="width:20%;">{{item.number?item.number:'-'}}</td> 
                                                <td style="width:30%;">{{item.name}}</td> 
                                                <td style="width:20%;">{{item.typeId | productTypePipe:data.productTypeMap}}</td> 
                                                <td style="width:20%;">{{item.price | number:'1.2-2'}}
                                                <div class="maskHover pos-a" style="width: 100%;height: 80%;left: 0;top: 10%;" (mouseover)="itemActiveHover(i)">&nbsp;</div>
                                                </td> 
                                            </tr>
                                        </tbody>
                                    </table>      
                                </div>
                                <div fxFlex="1 1 auto" style="text-align: center"><img src="assets/images/direction.png" alt=""/></div>
                                <div fxFlex="1 1 35%">
                                     <table class="scrollTable table table-bordered">
                                        <thead>
                                            <th style="width:25%;">编号</th>
                                            <th style="width:55%;">项目名称</th>
                                            <th style="width:20%;">操作</th>
                                        </thead>
                                        <tbody style="height:340px;" fusePerfectScrollbar>
                                            <tr *ngFor="let item of data.choosedProductListTmp;let i=index;">
                                                <td style="width:25%;">{{item.number?item.number:'-'}}</td> 
                                                <td style="width:55%;">{{item.name?item.name:'-'}}</td> 
                                                <td style="width:20%;"><span class="color-theme cur-hand" (click)="deleteItem(i)">删除</span></td> 
                                            </tr>
                                          <div *ngIf="data.choosedProductListTmp.length == 0" style="margin: 150px 0;"><p class="font-c2 mg-b-0">请在左边选择项目添加</p></div>
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
.itemActiveClass td{
  border:none;
}
.nb-theme-default .modal-body ::-webkit-scrollbar{
  float: left !important;

}
.mg-b-0{
  margin-bottom: 0;
} 
.pos-r{
  position: relative;
} 
.pos-a{
  position: absolute;
} 
.font-c2{
  color: #bcc2c8;
}
`],
})

export class ProductPopup implements OnInit{

  data:ProductPopupViewData;
  action:any;
  activeModal:any;

  itemActiveIndex:number = -1;
  private service: ProductPopupService;
  // public viewData: ProductPopupViewData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.service = new ProductPopupService();
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

  ngOnInit(): void {

    //项目
    let choosedProductTmp = new Array<ProductInfo>();
    this.data.choosedProductList.forEach((item) =>{
      if(!AppUtils.arrayContains(this.data.choosedProductListTmp,item)){
        choosedProductTmp.push(item);
      }
    });
    this.data.choosedProductListTmp = choosedProductTmp;
  }

  /**
   * 页面点击事件 选择项目添加到选中列表
   * @param item
   */
  selectProduct(item:ProductInfo){
    if(!AppUtils.arrayContains(this.data.choosedProductListTmp,item)){
      this.data.choosedProductListTmp.push(item);
    }else{
      AppUtils.showWarn("提示","已选择该项目");
    }
  }

  /**
   * 删除选中项目
   * @param index
   */
  deleteItem(index){
    this.data.choosedProductListTmp.splice(index,1);
  }


  /**
   * 页面点击事件 取消关闭弹窗
   */
  closeModal() {
    this.activeModal.close();
    this.data.choosedProductListTmp.splice(0,this.data.choosedProductListTmp.length);
  }

  /**
   * 页面点击事件 确定
   */
  confirm(){
    //项目
    this.data.choosedProductList.splice(0,this.data.choosedProductList.length);
    this.data.choosedProductListTmp.forEach((item) =>{
      this.data.choosedProductList.push(item);
    });

    this.action();
    this.closeModal();
  }

  /**
   * 页面点击事件 根据名称/分类查询项目
   */
  findProduct(){
    let products = this.data.openProductMap.values();
    if(!AppUtils.isNullOrWhiteSpace(this.data.queryParam)){
      let queryParam = AppUtils.trimBlank(this.data.queryParam);
      products = products.filter((item) => {
        if((item.name && (item.name.indexOf(queryParam) > -1))
          || (item.number && (item.number.toString().indexOf(queryParam) > -1))){
          return true;
        }else{
          return false;
        }
      });
    }

    if(this.data.productTypeId!="-1"){
      products = products.filter((item) => {
        if(item.typeId == this.data.productTypeId.toString()){
          return true;
        }else{
          return false;
        }
      });
    }
    this.data.productList = products;
  }
}

export class ProductPopupService{
  constructor(){}
}

export class ProductPopupViewData{
  public productMap:ZmMap<ProductInfo>;
  public openProductMap: ZmMap<ProductInfo>;
  public productList:Array<ProductInfo> = new Array();//上架项目列表
  //项目类型
  public productTypeMap: ZmMap<ProductType>;
  public productTypeList: Array<ProductType>;

  //选中的项目列表
  public choosedProductList:Array<ProductInfo>;
  public choosedProductListTmp:Array<ProductInfo>;

  //查询参数
  public queryParam:string;
  public productTypeId:string = '-1';


  public static fromComp(productCompViewData:ProductCompViewData):ProductPopupViewData{
    let productPopupViewData = new ProductPopupViewData();

    /*店内项目*/
    productPopupViewData.productList = productCompViewData.productList;
    productPopupViewData.productTypeList = productCompViewData.productTypeList;
    productPopupViewData.productMap = productCompViewData.productMap;
    productPopupViewData.openProductMap = productCompViewData.openProductMap;
    productPopupViewData.productTypeMap = productCompViewData.productTypeMap;
    productPopupViewData.choosedProductList = productCompViewData.choosedProductList;
    productPopupViewData.choosedProductListTmp = productCompViewData.choosedProductListTmp;
    return productPopupViewData;
  }

}
