import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";

/**
 * 文本域输入公共组件
 * eg:
 *  <zm_input_textarea [label]="'店铺描述'" [placeholder]="'请输入店铺描述'" [(text)]="text"></zm_input_textarea>
 */
@Component({
  selector:'zm_input_textarea',
  template: `
             <label>{{label}}</label>
             <div class="col-sm-6">
             <textarea class="form-control" style="height:100px;" placeholder="placeholder" [(ngModel)] = "text"></textarea>
             </div>
            `
})
export class ZmInputTextarea implements OnInit,OnDestroy,OnChanges {

  @Input() label:string;
  @Input() placeholder:string;
  @Output() textChange = new EventEmitter();

  private textTmp:string;

  constructor(){}

  ngOnInit():void{

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
