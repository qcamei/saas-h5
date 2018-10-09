import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
/**
 * Created by helen on 2018/2/28.
 * 表单提交按钮
 *  <zm_button [text]=" 保存 " (callback)="addProduct()"></zm_button>
 */

@Component({
  selector:'zm_button',
  template: ` 
          <div class=" col-sm-12 col-md-12 col-lg-6 mg-t-30">
            <button type="submit" class="btn c-btn-blue  c-my-btn" [disabled]="submitStatus"
                    (click)="add()">{{text}}
            </button>
          </div>
            `,
  styles:[`
  
`]

})

export class ZmButton{

  @Input() text: string;
  @Input() submitStatus:boolean;
  @Output() callback = new EventEmitter();

  constructor(){

  }

  /**number唯一性*/
  add() {
    if(this.submitStatus==false){
      this.callback.emit();
    }
  }

}
