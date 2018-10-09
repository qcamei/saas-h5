import {Component, OnInit, Input, Output, Inject} from "@angular/core";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {SelectConsumeViewData} from "../../selectConsumeComp/selectConsumeComp";
import {MAT_DIALOG_DATA} from "@angular/material";
/**
 * 选择项目组件
 */
@Component({
  selector:'select-product',
template:`
    <div animation-modal>
      <div mat-dialog-title>
        <h4 class="modal-title fz-16 font-bold">选择项目</h4>
        <div class="disFlex align-center" style="white-space:nowrap;">
              <zm-search-box [label]=" '项目查询'" [placeholder]="'请输入编号/名称查询'" [(zmValue)]="data.queryParam" (callBack)="findProduct()"></zm-search-box>
              <div class="form-group">
                <label class="mg-b-0 mg-l-20 mg-r-10 font-bold fz-14">分类</label>
                <select class="form-control  cur-hand  set-bg c-hued" [(ngModel)]="data.productTypeId" (change)="findProduct()">
                    <option [value]="0">全部</option>
                    <option [value]="item.id" *ngFor="let item of data.productTypeList">{{item.name}}</option>
                </select>
              </div>
        </div>
      </div>
      <mat-dialog-content fusePerfectScrollbar>
         
        <div fxLayout="row wrap" fxLayoutAlign="start center">
            <!--<img src="assets/images/direction.png" alt="" class="icon-dir"/>-->
            <div fxFlex="1 1 50%">
                <table class="scrollTable table table-bordered" >
                    <thead>
                        <th style="width:10%;">序号</th>
                        <th style="width:20%;">编号</th>
                        <th style="width:30%;">项目名称</th>
                        <th style="width:20%;">分类</th>
                        <th style="width:20%;">售价</th>
                    </thead>
                     <tbody style="height:340px;" fusePerfectScrollbar>
                        <tr class="pos-r" *ngFor="let item of data.productList;let i=index;" (click)="selectProduct(item)"  [class.itemActiveClass]="itemActiveIndex===i?'itemActive':''">
                            <div class="maskHover pos-a" style="width: 100%;height: 80%;left: 0;top: 10%;" (mouseover)="itemActiveHover(i)">&nbsp;</div>
                            <td style="border-left:none;"><span *ngIf="itemActiveIndex!==i">{{i+1}}</span><img src="assets/images/selectItem.png" *ngIf="itemActiveIndex===i"></td> 
                            <td style="width:20%;">{{item.number?item.number:'-'}}</td> 
                            <td style="width:30%;">{{item.name}}</td> 
                            <td style="width:20%;">{{item.typeId |productTypePipe:data.productTypeMap}}</td> 
                            <td style="width:20%;">{{item.price | number:'1.2-2'}}</td> 
                        </tr>
                    </tbody>
                </table>      
            </div>
           <!-- <div fxFlex="1 1 auto" style="text-align: center"><img src="assets/images/direction.png" alt=""/> </div>-->
            <div fxFlex="1 1 50%" >
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
      <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
        <button class="cancel-btn" (click)="closeModal()">取消</button>
        <button class="confirm-btn" (click)="confirm()">确定</button>
      </mat-dialog-actions>
    </div>
  `,
  styles:[`
.pd-lr-15{
  padding-left:15px;
  padding-right: 15px;
} 
.pd-tb-10{
  padding-top:10px;
  padding-bottom:10px;
} 
.pd-r-10{
  padding-right: 10px;
}
.pd-l-10{
  padding-left:10px;
}
.mg-b-0{
  margin-bottom:0;
} 
.mg-l-20{
  margin-left:20px;
} 
.mg-r-10{
  margin-right: 10px;
}
.mg-t-20{
  margin-top:20px;
}

.modal-title{
  font-size: 18px;
  font-weight: bold !important;
  color: #333 !important;
} 
.fz-16{
  font-size: 16px;
} 
.fz-14{
  font-size: 14px;
}
.font-c2{
  color: #bcc2c8;
}
.font-bold{
  font-weight: bold;
} 
.disFlex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: -moz-box;
  display: flex;
}
.align-center {
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -moz-box-align: center;
  align-items: center;
}
.set-bg{
  background-color:#F4F6FA !important;
} 
.c-hued{
  width: 100px;
}  
.pos-r{
  position: relative;
}
.pos-a{
  position: absolute;
} 
.color-theme{
  color:#03a9f4;
} 
.cur-hand{
  cursor: pointer;
} 
.text-right {
  text-align: right;
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

.close{
  outline:none;
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

.scrollTable thead th{
  border-bottom: none;
}
.scrollTable tbody{
  height:340px;
  overflow-x:hidden;
  overflow-y:auto;
  border:1px solid #e9ecef;
}
.scrollTable tbody::-webkit-scrollbar{
  display: block;
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
tbody::-webkit-scrollbar{
  display: block;
} 
tbody{
    -ms-overflow-style: none;
}

  .table {
    font-size: 14px;
    text-align: center;
    margin-bottom: 0 !important;
  }
  .table thead th {
    font-weight: bold;
    background-color: #f4f6fa !important;
  }
  .table tbody tr{
    margin-top: -1px;
  }
  .table tbody tr:nth-of-type(odd){
    background-color: #ffffff;
  }
  .table tbody tr:nth-of-type(even),tbody tr:nth-of-type(even) input,tbody tr:nth-of-type(even) select{
    background-color:#f9fafc;
  }
  .table tbody .c-tr:hover{
    background-color: #e7f3fd;
  }
  .table a{cursor:pointer;}
  .table a:hover{text-decoration: none;color:#03a9f4 !important;}
  
  .table th, .table td{
    vertical-align: middle !important;
    font-size: 14px;
    word-wrap:break-word;
    word-break: break-all;
  }
  .table-bordered thead th{
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
    .form-control:focus{
      box-shadow: none;
    }
`],
})
export class SelectProductPopupComp implements OnInit{

  @Input() data:SelectProductPopupViewData;
  @Output() action:any;
  itemActiveIndex:number = -1;
  public viewData: SelectProductPopupViewData;

  private activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  /*
   * 鼠标hover事件
   */
   itemActiveHover(index):void{
      this.itemActiveIndex = index;
   }

  ngOnInit(): void {
    this.data.choosedProductListTmp.splice(0,this.data.choosedProductListTmp.length);
    this.data.choosedProductList.forEach((item) =>{
      if(!AppUtils.arrayContains(this.data.choosedProductListTmp,item)){
        this.data.choosedProductListTmp.push(item);
      }
    });
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
    //清楚列表
    this.data.choosedProductList.splice(0,this.data.choosedProductList.length);
    this.activeModal.close();
  }

  /**
   * 页面点击事件 确定
   */
  confirm(){
    this.data.choosedProductList.splice(0,this.data.choosedProductList.length);
    this.data.choosedProductListTmp.forEach((item) =>{
      this.data.choosedProductList.push(item);
    });
    if(this.data.choosedProductList.length > 0){
      this.action();
    }
    this.activeModal.close();
  }

  /**
   * 页面点击事件 根据名称查询项目
   */
  findProduct(){
    let products = this.data.productMap.values();
    if(!AppUtils.isNullObj(this.data.queryParam)){
      this.data.queryParam = AppUtils.isNullOrWhiteSpace(this.data.queryParam)?"":AppUtils.trimBlank(this.data.queryParam);
      products = products.filter((item) => {
        if((item.name && (item.name.indexOf(this.data.queryParam) > -1)) || (item.number && (item.number.toString().indexOf(this.data.queryParam) > -1))){
          return true;
        }else{
          return false;
        }
      })
    }

    if(this.data.productTypeId != "0"){
      products = products.filter((item) => {
        if(item.typeId == this.data.productTypeId){
          return true;
        }else{
          return false;
        }
      })
    }

    this.data.productList = products;
  }

}

export class SelectProductPopupViewData{
  public productMap:ZmMap<ProductInfo>;
  public productList:Array<ProductInfo> = new Array();
  //项目类型
  public productTypeMap: ZmMap<ProductType>;
  public productTypeList: Array<ProductType>;

  //选中的项目列表
  public choosedProductList:Array<ProductInfo>;
  public choosedProductListTmp:Array<ProductInfo>;

  //查询参数
  public queryParam:string = "";
  public productTypeId:string = "0";

  public static fromConsume(selectConsumeViewData:SelectConsumeViewData):SelectProductPopupViewData{
    let selectProductPopupViewData = new SelectProductPopupViewData();
    selectProductPopupViewData.productList = selectConsumeViewData.productList;
    selectProductPopupViewData.productTypeList = selectConsumeViewData.productTypeList;
    selectProductPopupViewData.productMap = selectConsumeViewData.productMap;
    selectProductPopupViewData.productTypeMap = selectConsumeViewData.productTypeMap;
    selectProductPopupViewData.choosedProductList = selectConsumeViewData.choosedProductList;
    selectProductPopupViewData.choosedProductListTmp = selectConsumeViewData.choosedProductListTmp;
    return selectProductPopupViewData;
  }

}
