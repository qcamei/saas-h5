import {Output, Component, EventEmitter, OnInit, Input} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 文本域输入公共组件
 * eg:
 *  <zm_input_textarea [maxlength]="200" [label]="'总部介绍'" [placeholder]="'请输入总部介绍'" [(textChange)]="viewData.addForm.descript"></zm_input_textarea>
 */
@Component({
  selector:'zm-input-textarea',
  template: `
             <mat-form-field class="zmFullWidth" color="accent">
                 <mat-label>{{label}}</mat-label>
                <textarea matInput [placeholder]="placeholder"  [(ngModel)]="text" [maxlength]="maxlength"></textarea>
             </mat-form-field>
              
            `,
  styles:[`
      
  `]
})
export class ZmInputTextarea implements OnInit {

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


  @Input()
  get text(): string {
    return this.textTmp;
  }

  set text(value: string) {
    this.textTmp = value;
    this.textChange.emit(this.textTmp);
  }

}
