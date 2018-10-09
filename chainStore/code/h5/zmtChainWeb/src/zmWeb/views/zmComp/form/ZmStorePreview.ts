import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";

/**
 * 图片预览公共组件
 * eg:
 * <zm_store_preview [(storeArr)]="" (storeArrChange)=""></zm_store_preview>
 */
@Component({
  selector: 'zm_store_preview',
  template: `	
	    <div *ngIf="storeArr != null" style="margin-left:80px;">
        <ul  fxLayout="row wrap" fxLayoutAlign="start center" fxLayoutGap="20px">
          <li style="width:20%;" *ngFor="let item of storeArr;let i = index" class="mt-20 pos-r">
            <div class="bdRound text-truncate text-center" title="{{item.name}}">{{item.name}}</div>
             <img src="assets/images/icon/deleteTag.png" class="zmCurHand pos-a" style="top:-5px;right:-8px;" alt=""
                         (click)="removeStore(item)">
          </li>
         
      </ul>
		</div>
  `,
  styles: [`
  .bdRound{
    padding:5px;border:1px solid #03a9f4;
    border-radius:8px;
    color:#03a9f4;
  }
	.align-center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -moz-box-align: center;
    align-items: center;
  }
	.dib{
	  display: inline-block;
	} 
	.mg-r-20{
	  margin-right:20px;
	} 
	.mg-t-20{
	  margin-top:20px;
	} 
	.pos-r{
	  position: relative;
	}
	.cur-hand{
	  cursor: pointer;
	} 
	.pos-a{
	  position: absolute;
	}
  `]
})
export class ZmStorePreview{

  public storeArrTmp: Array<StoreVD> = [];
  @Output() storeArrChange = new EventEmitter();

  selectStoreIds:Array<string> = new Array<string>();

  constructor() {
  }

  @Input()
  get storeArr() {
    return this.storeArrTmp;
  }

  set storeArr(val) {
    this.storeArrTmp = val;
    this.storeArrChange.emit(this.storeArrTmp);
  }

  removeStore(item) {
    this.storeArrTmp.forEach((itemTmp) => {
      if (itemTmp.id == item.id) {
        itemTmp.checked = false;
      }
    });
    AppUtils.removeFromArray(this.storeArrTmp, item);
    this.storeArrChange.emit(this.storeArrTmp);
  }
}
