import {
  Component,
  EventEmitter,
  Input,
  Output
} from "@angular/core";
import {BUser} from "../../../../../bsModule/buser/data/BUser";
import {AppUtils} from "../../../../../comModule/AppUtils";
import {Constants} from "../../../../zmComUtils/Constants";
import {GenderEnum} from "../../../../../comModule/enum/GenderEnum";
import {AppCfg} from "../../../../../comModule/AppCfg";

@Component({
  selector: 'zmbBuser',
  template: `

    <div style="width:100%;padding:0 10px;">
      <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px"
           style="padding:10px 0;font-size:14px;">
        <div zmk-img-circle>
          <img w-100 h-100 [src]="getImgUrl()">
        </div>
        <div fxLayout="column" fxLayoutAlign="space-between start" fxLayoutGap="10px" style="padding:5px 0;">
          <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
            <span>{{getName()}}</span>
            <span *ngIf="isFemale()"><img src="assets/img/sex-wumen.png"></span>
            <span *ngIf="!isFemale()"><img src="assets/img/sex-man.png"></span>
          </div>
          <div style="color: #999999">
            {{getPhone()}}
          </div>

        </div>

      </div>
      
    </div>
  `

})

// assets/img/avatar.jpeg
export class ZmbBUserComp{

  @Output() buserChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() buser: BUser;

  @Output() zmBUserCb: EventEmitter<BUser> = new EventEmitter();

  getName(): string {
    if (AppUtils.isNullObj(this.buser)) return Constants.NO_CONTENT;
    return this.buser.name;
  }

  getPhone(): string {
    if (AppUtils.isNullObj(this.buser)) return Constants.NO_CONTENT;
    return this.buser.phone;
  }

  isFemale(): boolean {
    if (AppUtils.isNullObj(this.buser)) return true;
    return this.buser.gender == GenderEnum.FEMALE;
  }

  getImgUrl(): string {
    if (AppUtils.isNullObj(this.buser)) return "assets/img/girl.png";
    return AppCfg.getInstance().getImgPreUrl() + this.buser.headImg;
  }

  /**
   * 回调
   */
  callback() {
    this.zmBUserCb.emit(this.buser);
  }

}


