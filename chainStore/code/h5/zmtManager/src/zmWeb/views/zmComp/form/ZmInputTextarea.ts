import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 文本域输入公共组件
 * eg:
 *  <zm_input_textarea [label]="'店铺描述'" [placeholder]="'请输入店铺描述'" [(text)]="text"></zm_input_textarea>
 */
@Component({
  selector:'zm_input_textarea',
  template: `
             <div class="input-group  c-input-group form-group" style="align-items: baseline !important;">
                <label class="c-label">{{label}}</label>
                <textarea rows="5" class="form-control" placeholder='{{placeholder}}' 
                          [(ngModel)]="text" [ngModelOptions]="{standalone: true}" [maxlength]="maxlength"></textarea>
              </div>
            `,
  styles:[`
      .c-label{
        vertical-align: middle;
        margin-right: 10px;
        margin-bottom: 0;
        width: 100px;
        text-align: right;
      }
      .form-control{
        padding: 0.75rem 0.75rem;
        border: 2px solid #ced4da;
      }
      .form-control:focus{
        box-shadow: none;
      }
      .c-input-group{
        align-items: center !important;
      }
      .c-input-group .form-control{
        border-radius: 0.375rem !important;
      }
      .form-control:focus{
        box-shadow: none;
      }
      
  `]
})
export class ZmInputTextarea implements OnInit,OnDestroy,OnChanges {

  @Input() label:string;
  @Input() placeholder:string;
  @Input() maxlength:number;
  @Output() textChange = new EventEmitter();

  private textTmp:string;

  constructor(){}

  ngOnInit():void{
    if(AppUtils.isNullObj(this.maxlength) || this.maxlength<0){
      this.maxlength = 200;
    }
  }

  ngOnDestroy(): void {

  }

  @Input()
  get text(): string {
    return this.textTmp;
  }

  set text(value: string) {
    this.textTmp = value;
    this.textChange.emit(this.textTmp);
  }

  /**
   * 监听输入值的变化
   * @param changes
   */
  ngOnChanges(changes){
    // this.changeText(changes.text.currentValue);
  }

}
