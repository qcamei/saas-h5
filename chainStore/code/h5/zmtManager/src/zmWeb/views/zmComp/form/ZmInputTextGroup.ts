import {Component, Input, Output, EventEmitter} from "@angular/core";
import {VipContent} from "../../../bsModule/vipLevel/data/VipContent";
/**
 * Created by sunbirdjob on 2018/2/23.
 * 必填文本输入框  maxlength="50"
 *
 */

@Component({
  selector: 'zm_input_text_Group',
  template: `
        <p class="py-2"><span class="text-danger">*</span>数量限制</p>
        <div class="d-flex">
                <div class="col-md-6">
                  <div class="form-group row mb-0">
                    <label class="col-md-4 col-form-label text-center px-0"><span class="text-danger">*</span>店铺</label>
                    <div class="col-md-8 px-1">
                    <input type="text" placeholder="请输入店铺数量" maxlength="20"  class="form-control"  name="store" #store="ngModel" required 
                    [ngClass]="{'form-valid-error':store.invalid && (store.touched)}" 
                    [(ngModel)]="zmValue.storeLimit">
                    </div>
                  </div>

                  <div class="row" style="height:30px;font-size:14px;">
                  <div class="col-md-4"></div>
                      <div class="col-md-8 px-1 text-danger">
                        <div  *ngIf="store.invalid && (store.touched)">
                          <div *ngIf="store.errors.required">
                            店铺数量不能为空
                          </div>
                        </div>
                      </div>
                    </div> 
                </div> 
                
                <div class="col-md-6">
                  <div class="form-group row mb-0">
                    <label class="col-md-4 col-form-label text-center px-0"><span class="text-danger">*</span>会员</label>
                    <div class="col-md-8 px-1">
                    <input type="text" placeholder="请输入会员数量" maxlength="20"  class="form-control"  name="menber" #menber="ngModel" required 
                    [ngClass]="{'form-valid-error':menber.invalid && (menber.touched)}" 
                    [(ngModel)]="zmValue.leaguerLimit">
                    </div>
                  </div>

                  <div class="row" style="height:30px;font-size:14px;">
                  <div class="col-md-4"></div>
                      <div class="col-md-8 px-1 text-danger">
                        <div  *ngIf="menber.invalid && (menber.touched)">
                          <div *ngIf="menber.errors.required">
                            会员数量不能为空
                          </div>
                        </div>
                      </div>
                    </div> 
                </div> 
        </div>

        <div class="d-flex">
        <div class="col-md-6">
          <div class="form-group row mb-0">
            <label class="col-md-4 col-form-label text-center px-0"><span class="text-danger">*</span>商品</label>
            <div class="col-md-8 px-1">
            <input type="text" placeholder="请输入商品数量" maxlength="20"  class="form-control"  name="commodity" #commodity="ngModel" required 
            [ngClass]="{'form-valid-error':commodity.invalid && (commodity.touched)}" 
            [(ngModel)]="zmValue.goodsLimit">
            </div>
          </div>

          <div class="row" style="height:30px;font-size:14px;">
          <div class="col-md-4"></div>
              <div class="col-md-8 px-1 text-danger">
                <div  *ngIf="commodity.invalid && (commodity.touched)">
                  <div *ngIf="commodity.errors.required">
                    商品数量不能为空
                  </div>
                </div>
              </div>
            </div> 
        </div> 
        
        <div class="col-md-6">
          <div class="form-group row mb-0">
            <label class="col-md-4 col-form-label text-center px-0"><span class="text-danger">*</span>项目</label>
            <div class="col-md-8 px-1">
            <input type="text" placeholder="请输入项目数量" maxlength="20"  class="form-control"  name="product" #product="ngModel" required 
            [ngClass]="{'form-valid-error':product.invalid && (product.touched)}" 
            [(ngModel)]="zmValue.productLimit">
            </div>
          </div>

          <div class="row" style="height:30px;font-size:14px;">
          <div class="col-md-4"></div>
              <div class="col-md-8 px-1 text-danger">
                <div  *ngIf="product.invalid && (product.touched)">
                  <div *ngIf="product.errors.required">
                    项目数量不能为空
                  </div>
                </div>
              </div>
            </div> 
        </div> 
    </div>

    <div class="d-flex">
    <div class="col-md-6">
      <div class="form-group row mb-0">
        <label class="col-md-4 col-form-label text-center px-0"><span class="text-danger">*</span>套餐</label>
        <div class="col-md-8 px-1">
        <input type="text" placeholder="请输入套餐数量" maxlength="20"  class="form-control"  name="package" #package="ngModel" required 
        [ngClass]="{'form-valid-error':package.invalid && (package.touched)}" 
        [(ngModel)]="zmValue.packageLimit">
        </div>
      </div>

      <div class="row" style="height:30px;font-size:14px;">
      <div class="col-md-4"></div>
          <div class="col-md-8 px-1 text-danger">
            <div  *ngIf="package.invalid && (package.touched)">
              <div *ngIf="package.errors.required">
                套餐数量不能为空
              </div>
            </div>
          </div>
        </div> 
    </div> 
    
    <div class="col-md-6">
      <div class="form-group row mb-0">
        <label class="col-md-4 col-form-label text-center px-0"><span class="text-danger">*</span>次卡</label>
        <div class="col-md-8 px-1">
        <input type="text" placeholder="请输入次卡数量" maxlength="20"  class="form-control"  name="magcard" #magcard="ngModel" required 
        [ngClass]="{'form-valid-error':magcard.invalid && (magcard.touched)}" 
        [(ngModel)]="zmValue.prdCardLimit">
        </div>
      </div>

      <div class="row" style="height:30px;font-size:14px;">
      <div class="col-md-4"></div>
          <div class="col-md-8 px-1 text-danger">
            <div  *ngIf="magcard.invalid && (magcard.touched)">
              <div *ngIf="magcard.errors.required">
                次卡数量不能为空
              </div>
            </div>
          </div>
        </div> 
    </div> 
</div>

<div class="d-flex">
<div class="col-md-6">
  <div class="form-group row mb-0">
    <label class="col-md-4 col-form-label text-center px-0"><span class="text-danger">*</span>会员卡</label>
    <div class="col-md-8 px-1">
    <input type="text" placeholder="请输入会员卡数量" maxlength="20"  class="form-control"  name="menberCar" #menberCar="ngModel" required 
    [ngClass]="{'form-valid-error':menberCar.invalid && (menberCar.touched)}" 
    [(ngModel)]="zmValue.memberCardLimit">
    </div>
  </div>

  <div class="row" style="height:30px;font-size:14px;">
  <div class="col-md-4"></div>
      <div class="col-md-8 px-1 text-danger">
        <div  *ngIf="menberCar.invalid && (menberCar.touched)">
          <div *ngIf="menberCar.errors.required">
            会员卡数量不能为空
          </div>
        </div>
      </div>
    </div> 
</div> 

<div class="col-md-6">
  <div class="form-group row mb-0">
    <label class="col-md-4 col-form-label text-center px-0"><span class="text-danger">*</span>员工</label>
    <div class="col-md-8 px-1">
    <input type="text" placeholder="请输入员工数量" maxlength="20"  class="form-control"  name="staff" #staff="ngModel" required 
    [ngClass]="{'form-valid-error':staff.invalid && (staff.touched)}" 
    [(ngModel)]="zmValue.buserLimit">
    </div>
  </div>

  <div class="row" style="height:30px;font-size:14px;">
  <div class="col-md-4"></div>
      <div class="col-md-8 px-1 text-danger">
        <div  *ngIf="staff.invalid && (staff.touched)">
          <div *ngIf="staff.errors.required">
            员工数量不能为空
          </div>
        </div>
      </div>
    </div> 
</div> 
</div>
            `
})

export class ZmInputTextGroup {

  @Input() label: string;
  @Input() placeholder: string;

  @Output() valueChecked: EventEmitter<any> = new EventEmitter();
  active: boolean = false;

  private zmValueTmp:VipContent;
  @Output() zmValueChange = new EventEmitter();


  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }

  set zmValue(val) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);
  }

  private zmPassTmp: boolean;
  @Output() zmPassChange = new EventEmitter();

  @Input()
  get zmPass(): boolean {
    return this.zmPassTmp;
  }

  set zmPass(val: boolean) {
    this.zmPassTmp = val;
    this.zmPassChange.emit(this.zmPassTmp);
  }


  constructor() {

  }

}
