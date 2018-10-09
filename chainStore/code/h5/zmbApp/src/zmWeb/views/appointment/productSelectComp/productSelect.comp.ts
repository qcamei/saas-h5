//  <zmb-product-select-comp [(selectedProductList)]= "" [selectedLeaguer]=""></zmb-product-select-comp>
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit,
  Output
} from "@angular/core";
import {ProductItemData} from "../productSelectList/productSelectList.page";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";

@Component({
  selector: 'zmb-product-select-comp',
  template: `
    <div>
      <zm-workFlow-title [title]="'选择项目'" [required]="true" [showBorder]="true"
                         (zmWorkFlowClick)="goProducSelectListPage()"></zm-workFlow-title>
      
      
        <selected-product-list [productTypeMap]= "productTypeMap" [itemList]="selectedProductList"></selected-product-list>
      
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ProductSelectComp implements OnInit, OnDestroy {

  @Input() selectedLeaguer:Leaguer;

  @Input() productTypeMap:ZmMap<ProductType>;

  /**
   * selectedProductList 双向绑定
   */
  private selectedProductListTmp: Array<ProductItemData> = new Array<ProductItemData>(); //选中的项目数据
  @Output() selectedProductListChange = new EventEmitter();

  @Input()
  get selectedProductList() {
    return this.selectedProductListTmp;
  }

  set selectedProductList(val) {
    this.selectedProductListTmp = val;
    this.selectedProductListChange.emit(this.selectedProductList);
  }

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  goProducSelectListPage() {
    AppRouter.getInstance().goProductSelectList(this.selectedCallback.bind(this));
  }

  selectedCallback(selectedProductListP: Array<ProductItemData>) {
    if (!AppUtils.isNullObj(selectedProductListP)) {
      this.selectedProductList = selectedProductListP;
      this.cdRef.markForCheck();
    }
  }

}
