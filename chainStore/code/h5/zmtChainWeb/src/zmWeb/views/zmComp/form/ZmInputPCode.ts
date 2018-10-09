import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
/**
 * 项目编号

 <zm-input-pcode label="项目编号" placeholder="请输入项目编号" maxlength="20"
 [(zmValue)]="viewData.defaultNumber" [(zmPass)]="viewData.defaultNumberPass"
 [oriCode]="viewData.productDetail.number" [existList]="viewData.prdNumberList" (valueChecked)="test()" ></zm-input-pcode>

 */

@Component({
  selector:'zm-input-pcode',
  template: `
            
          <zm-input-text [label]="label" [placeholder]="placeholder" [required]="required" [disabled]="disabled" [maxlength]="20"
                      [(zmValue)]="zmValue" [(zmPass)]="zmPass" [checkFun]="check.bind(this)"  (valueChecked)="onValueCheck()"></zm-input-text>
            `
})

export class ZmInputPCode{


  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  @Input() required = true;
  @Input() label="";
  @Input() placeholder="";
  @Input() disabled = false;

  //已经存在的编号列表
  @Input() existList;
  //当期的原始编号
  @Input() oriCode;

  /**
   * zmvalue 双向绑定
   */
  @Output() zmValueChange = new EventEmitter();
  private valueTmp;
  @Input()
  get zmValue():boolean {
    return this.valueTmp;
  }
  set zmValue(val:boolean) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }
  /**
   * zmPass 双向绑定
   */
  private zmPassTmp:boolean;
  @Output() zmPassChange = new EventEmitter();

  @Input()
  get zmPass():boolean {
    return this.zmPassTmp;
  }
  set zmPass(val:boolean) {
    this.zmPassTmp = val;
    this.zmPassChange.emit(this.zmPassTmp);
  }

  public check(pcode) {

    let errorMsg = "";
    if(!pcode.match("^\\s*[\\w-]+\\s*$")){
      errorMsg = "请输入由数字、字母、下划线(_)、连接符(-)组成的字符串";
    }else if(this.isExist(pcode)){
      errorMsg = this.label+"已存在，请检查输入";
    }

    return errorMsg;
  }

  private isExist(pcode){
    if(this.existList && pcode){
      if(this.oriCode){
        return pcode != this.oriCode && AppUtils.arrayContains(this.existList,pcode);
      }else{
        return AppUtils.arrayContains(this.existList,pcode);
      }
    }else{
      return false;
    }

  }

  public onValueCheck(){
    this.valueChecked.emit(null);
  }



}
