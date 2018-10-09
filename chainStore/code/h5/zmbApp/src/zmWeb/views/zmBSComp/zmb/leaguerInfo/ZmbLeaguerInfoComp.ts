import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges
} from "@angular/core";
import {Leaguer} from "../../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {AppUtils} from "../../../../comModule/AppUtils";
import {Constants} from "../../../zmComUtils/Constants";
import {GenderEnum} from "../../../../comModule/enum/GenderEnum";
import {AppCfg} from "../../../../comModule/AppCfg";
import {LeaguerInfoService} from "./LeaguerInfoService";
import {LeaguerHelper} from "./LeaguerHelper";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";

//  <zmbLeaguerInfo [id]="" [(leaguer)]="" (zmLeaguerCb)=""></zmbLeaguerInfo>
@Component({
  selector: 'zmbLeaguerInfo',
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
            <span *ngIf="isFemale()&&!isOutSider()"><img src="assets/img/sex-wumen.png"></span>
            <span *ngIf="!isFemale()&&!isOutSider()"><img src="assets/img/sex-man.png"></span>
          </div>
          <div *ngIf="!isOutSider()" style="color: #999999">
            {{getPhone()}}
          </div>

        </div>

      </div>
      
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush

})

// assets/img/avatar.jpeg
export class ZmbLeaguerInfoComp implements OnInit, OnChanges {

  @Input() id: string;
  @Output() leaguerChange: EventEmitter<any> = new EventEmitter<any>();

  leaguerInfo: Leaguer;

  @Output() zmLeaguerCb: EventEmitter<Leaguer> = new EventEmitter();

  @Input()
  get leaguer() {
    return this.leaguerInfo;
  }

  set leaguer(val: any) {
    this.leaguerInfo = val;
    this.leaguerChange.emit(this.leaguerInfo);
    this.cdRef.markForCheck();
  }

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let idP = changes['id'];
    if (!AppUtils.isNullObj(idP)) {
      this.getLeaguerInfo();
    }
  }

  ngOnInit() {
    if (!AppUtils.isNullObj(this.leaguer)) return;
    if (AppUtils.isNullObj(this.id)) return;
    this.getLeaguerInfo();
  }

  /**
   * 获取客户信息
   */
  getLeaguerInfo() {
    if (AppUtils.isNullObj(this.id)) return;
    LeaguerInfoService.getInstance().getSimpleLeaguerInfo(this.id).then((leauger: Leaguer) => {
      this.leaguer = leauger;
      this.callback();
      this.cdRef.markForCheck();
    });
  }

  getName(): string {
    if (AppUtils.isNullObj(this.leaguer)) return Constants.NO_CONTENT;
    return this.leaguer.name;
  }

  getPhone(): string {
    if (AppUtils.isNullObj(this.leaguer)) return Constants.NO_CONTENT;
    return this.leaguer.phone;
  }

  isFemale(): boolean {
    if (AppUtils.isNullObj(this.leaguer)) return true;
    return this.leaguer.sex == GenderEnum.FEMALE;
  }

  getImgUrl(): string {
    if (AppUtils.isNullObj(this.leaguer)) return "assets/img/girl.png";
    return AppCfg.getInstance().getImgPreUrl() + this.leaguer.headImg;
  }

  /**
   * 回调
   */
  callback() {
    this.zmLeaguerCb.emit(this.leaguer);
  }

  /**
   * true表示散客
   * @returns {boolean}
   */
  isOutSider(): boolean {
    if (AppUtils.isNullObj(this.id) && AppUtils.isNullObj(this.leaguer)) return false;
    let leaguerId: string = !AppUtils.isNullObj(this.id) ? this.id : this.leaguer.id;
    let isOutsider: boolean = LeaguerHelper.isOutsider(SessionUtil.getInstance().getCurStoreId(),leaguerId);//true表示散客
    return isOutsider;
  }
}


