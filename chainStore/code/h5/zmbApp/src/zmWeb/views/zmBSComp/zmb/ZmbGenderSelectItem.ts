import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

/**
 * <zmb-gender-select-item [title]="性别" [(genderVD)]="gender"></zmb-gender-select-item>
 */
@Component({
  selector: 'zmb-gender-select-item',
  template: `

    <ion-list no-lines>
      <ion-item>
        <ion-label>{{title}}</ion-label>
        <ion-select [(ngModel)]="genderVDTmp" (ngModelChange)="doModelChange() " cancelText="取消" okText="确定">
              <ion-option value="1">男</ion-option>
              <ion-option value="2">女</ion-option>
        </ion-select>
      </ion-item>
    </ion-list>
    <div class="lineView"></div>
    
            `,
  styles: [`
    .select-ios {
    padding: 21px 8px 21px 16px !important;
}
    /*.listItem{*/
      /*top: 100px;*/
      /*width: 100%;*/
      /*height: 60px;*/
      /*background-color: white;*/
      /*color:#414141;*/
      /*font-size: 16px;*/
    
    /*}*/
    
    /*.listItem .title{*/
      /*width: 200px;*/
      /*height: 60px;*/
      /*padding-top: 20px;*/
      /*padding-left: 20px;*/
      /*float: left;*/
    /*}*/
    
    /*.listItem .select{*/
      /*text-align: right !important;*/
    /*}*/
    
.lineView{
      width: 95%;
      height: 1px;
      /*margin-top: 1px;*/
      background-color: #f3f3f3;
      margin:0 auto;
    }

    .item-cover {
      /*left: 0;*/
      /*top: 0;*/
      /*position: absolute;*/
      /*width: 100%;*/
      /*height: 60px !important;*/
      /*background: transparent;*/
      /*cursor: pointer;*/
    }
    
    `]
})


export class ZmbGenderSelectItem implements OnInit {


  @Input() title:string = '性别';
  @Output() onModelChange = new EventEmitter();

  /**
   * genderVD 双向绑定
   */
  private genderVDTmp: number = 2; //默认女
  @Output() genderVDChange = new EventEmitter();
  @Input()
  get genderVD() {
    return this.genderVDTmp;
  }
  set genderVD(val) {
    this.genderVDTmp = val;
    this.genderVDChange.emit(this.genderVD);
  }


  doModelChange(){
    this.onModelChange.emit(this.genderVD);
  }

  constructor() {
  }

  ngOnInit() {
  }


}
