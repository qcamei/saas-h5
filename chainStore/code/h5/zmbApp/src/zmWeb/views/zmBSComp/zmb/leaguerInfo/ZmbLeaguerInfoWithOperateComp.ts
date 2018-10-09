import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, KeyValueDiffers, OnChanges,
  OnInit,
  Output, SimpleChanges
} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {Constants} from "../../../zmComUtils/Constants";
import {GenderEnum} from "../../../../comModule/enum/GenderEnum";
import {AppCfg} from "../../../../comModule/AppCfg";
import {LeaguerInfoService} from "./LeaguerInfoService";
import {LeaguerDetail} from "../../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {AttentionTypeEnum} from "../../../../bsModule/storeLeaguerInfo/data/AttentionTypeEnum";
import {LeaguerHelper} from "./LeaguerHelper";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";

//  <zmbLeaguerInfoWithOperateComp [id]="" [(leaguer)]="" (zmLeaguerCb)=""></zmbLeaguerInfoWithOperateComp>
@Component({
  selector: 'zmbLeaguerInfoWithOperate',
  template: `

    <div style="width:100%;padding:0 10px;">
      <zmbLeaguerInfo [leaguer]="leaguerInfo"></zmbLeaguerInfo>
      <div  *ngIf="!isOutSider()"style="border-bottom:1px solid #f4f4f4; width:95%;margin: 0 auto"></div>
      <div  *ngIf="!isOutSider()" style="width:100%;padding:10px;font-size:14px;">
        
        <div fxLayout="row" fxLayoutAlign="start center">
          <div (click)="sendMsg()" fxFlex="1 1" fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="5px"><img
            src="assets/img/duanxin.png"><span>短信</span></div>
          <div (click)="call()" fxFlex="1 1" fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="5px"><img
            src="assets/img/phone.png"><span>电话</span></div>
          <div *ngIf="isShowAttention" (click)="doAttention()" fxFlex="1 1" fxLayout="row" fxLayoutAlign="center center"
               fxLayoutGap="5px">
            <img src="{{getAttentionIcon()}}">
            <span>{{isAttention() ? "已标星" : "标星"}}</span>
          </div>

        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush

})

// assets/img/avatar.jpeg
export class ZmbLeaguerInfoWithOperateComp implements OnInit,OnChanges {

  differ: any;//用于监听 id 变化
  @Input() id: string;
  @Input() isShowAttention: boolean = true;
  @Output() leaguerChange: EventEmitter<any> = new EventEmitter<any>();

  leaguerInfo: LeaguerDetail;

  @Output() zmLeaguerCb: EventEmitter<LeaguerDetail> = new EventEmitter();

  @Input()
  get leaguer() {
    return this.leaguerInfo;
  }

  set leaguer(val: any) {
    this.leaguerInfo = val;
    this.leaguerChange.emit(this.leaguerInfo);
  }

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let idP = changes['id'];
    if(!AppUtils.isNullObj(idP)){
      this.getLeaguerInfo();
    }
  }

  ngOnInit() {
    if (!AppUtils.isNullObj(this.leaguer)) return;
    this.getLeaguerInfo();
  }

  /**
   * 获取客户信息
   */
  getLeaguerInfo() {
    if (AppUtils.isNullObj(this.id)) return;
    LeaguerInfoService.getInstance().getLeaguerDetail(this.id).then((leaguerDetail: LeaguerDetail) => {
      this.leaguer = leaguerDetail;
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
    return this.leaguer.name;
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
   * ture 表示标星
   * @returns {boolean}
   */
  isAttention(): boolean {
    if (AppUtils.isNullObj(this.leaguer)) return false;
    return this.leaguer.attention == AttentionTypeEnum.STAR;
  }

  getAttentionIcon(): string {
    if (AppUtils.isNullObj(this.leaguer)) return "assets/img/ic_vip2.png";
    return this.isAttention() ? "assets/img/ic_vip.png" : "assets/img/ic_vip2.png";
  }

  /**
   * 回调
   */
  callback() {
    this.zmLeaguerCb.emit(this.leaguer);
  }

  /**
   * 发短信
   */
  sendMsg(){
    AppUtils.showSuccess("提示", "发短信");
  }

  /**
   * 打电话
   */
  call(){
    AppUtils.showSuccess("提示", "打电话");
  }

  /**
   * 添加或者取消标星
   */
  doAttention(){
    if(this.isAttention()){//当前客户已经标星
      this.removeAttention();
    }else {
      this.addAttention();
    }
  }

  /**
   * 添加标星
   */
  addAttention() {
    if (AppUtils.isNullObj(this.leaguer)) return;
    LeaguerInfoService.getInstance().addAttention(this.leaguer.id).then(
      (success) => {
        if (success) {
          AppUtils.showSuccess("提示", "标星成功");
          this.leaguer.attention = AttentionTypeEnum.STAR;
          this.cdRef.markForCheck();
        } else {
          AppUtils.showError("提示", "标星失败");
        }
      });
  }
  /**
   * 删除标星
   */
  removeAttention() {
    if (AppUtils.isNullObj(this.leaguer)) return;
    LeaguerInfoService.getInstance().addAttention(this.leaguer.id).then(
      (success) => {
        if (success) {
          AppUtils.showSuccess("提示", "取消标星成功");
          this.leaguer.attention = AttentionTypeEnum.UNKNOW;
          this.cdRef.markForCheck();
        } else {
          AppUtils.showError("提示", "取消标星失败");
        }
      });
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


