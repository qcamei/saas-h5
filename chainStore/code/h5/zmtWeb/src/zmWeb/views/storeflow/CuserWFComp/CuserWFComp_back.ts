// import {Component, OnInit, OnChanges, Input} from '@angular/core';
// import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
// import {SessionUtil} from "../../../comModule/session/SessionUtil";
// import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
// import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
// import {LeaguerMemberCard} from "../../../bsModule/storeLeaguerInfo/data/LeaguerMemberCard";
// import {WFDataWraper, CuserWFCompData} from "../wfComp/WFDataWraper";
// import {WFDataWraperMgr} from "../wfComp/WFDataWraperMgr";
// import {MemberCardStateEnum} from "../../../bsModule/storeLeaguerInfo/data/MemberCardStateEnum";
// import {CuserWFPopup, CuserWFPopupViewData} from "./CuserWFPopup/CuserWFPopup";
// import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
// import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
// import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
// import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
// import {Popup} from "../../common/popup/popup";
// import {Constants} from "../../common/Util/Constants";
// import {MatDialog} from "@angular/material";
// import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
//
// /**
//  * 选择会员公共组件
//  */
// @Component({
//   selector: 'select-leaguer-comp',
//   template: `
//     <!-- 选择会员 start -->
//     <zm-card-box [withCollapse]="true"  [expanded]="contentExpanded">
//          <header fxLayout="row wrap" fxLayoutAlign="start center" >
//           <label style="width:140px;color:#2a2a2a;font-size:18px;" class="text-bold">选择会员</label>
//           <div class="nameDiv fz-14 cur-hand" (click)="selectCustomer($event)" >
//             <span *ngIf="cuserWFCompData.selectLeaguer.name">
//               {{cuserWFCompData.selectLeaguer.name}}
//              </span>
//             <span *ngIf="!cuserWFCompData.selectLeaguer.name" style="color: #A4ABB3">请选择会员</span>
//             <i class="fa fa-plus" style="color:#03a9f4;position:absolute;right:0px;top: 10px;"></i>
//           </div>
//          </header>
//          <content>
//
//             <div class="flex pd-t-30">
//                   <div  class="c-LeaComp">
//                     <label class="font-bold">姓名</label>
//                     <span class="dib mg-l-20">{{cuserWFCompData.selectLeaguer.name}}</span>
//                   </div>
//                   <div class="c-LeaComp mg-t-30">
//                     <label  class="font-bold">昵称</label>
//                     <span class="dib mg-l-20">{{cuserWFCompData.selectLeaguer.aliasName?cuserWFCompData.selectLeaguer.aliasName:"-"}}</span>
//                   </div>
//                   <div class="c-LeaComp mg-t-30">
//                     <label  class="font-bold">性别</label>
//                     <span class="dib mg-l-20">{{cuserWFCompData.selectLeaguer.sex==2?"女":"男"}}</span>
//                   </div>
//                 </div>
//
//
//                 <div class="flex pd-t-30">
//                   <div class="c-LeaComp">
//                     <label  class="font-bold">手机号</label>
//                     <span class="dib mg-l-20">{{cuserWFCompData.selectLeaguer.phone && cuserWFCompData.selectLeaguer.phone.length > 0?cuserWFCompData.selectLeaguer.phone:'-'}}</span>
//                   </div>
//                   <div class="c-LeaComp  mg-t-30">
//                     <label  class="font-bold">身份证</label>
//                     <span class="dib mg-l-20">{{cuserWFCompData.selectLeaguer.idCard?cuserWFCompData.selectLeaguer.idCard:"-"}}</span>
//                   </div>
//                   <div class="c-LeaComp  mg-t-30">
//                     <label style="text-indent:1em;font-weight: bold;">生日</label>
//                     <span class="dib mg-l-20">{{cuserWFCompData.selectLeaguer.birthday>0?(cuserWFCompData.selectLeaguer.birthday|date:"yyyy/MM/dd"):"-"}}</span>
//                   </div>
//                 </div>
//
//
//                 <div class="align-center text-center pos-r" style="height:180px;width:350px;">
//                    <div style="height:100%;" *ngIf="hasMbCard == true">
//                     <img *ngIf="hasExpired == false" src="{{cuserWFCompData.memberCard.imgPath |imgPrePath}}" style="width:100%;height:100%">
//                     <img *ngIf="hasExpired == true" src="assets/images/pic_membership_card1.png" style="width:100%;height:100%">
//                     <span class="pos-a fz-16" style="color:#fff;top:10px;left:5%;z-index:2">
//                     {{cuserWFCompData.memberCard.name}}</span>
//                     <span class="pos-a fz-16" style="color:#fff;top:10px;right:5%;z-index:2">
//                     {{cuserWFCompData.leaguerMemberCard.number}}</span>
//
//                     <div class="pos-a fz-16 memberCartMask disFlex align-center hor-center" *ngIf="hasExpired == true">
//                       <img src="assets/images/plaint.png" alt="" class="mg-r-10"/>
//                        会员卡已过期
//                     </div>
//
//                   </div>
//
//                   <div style="height:100%;position: relative;" *ngIf="hasMbCard == false">
//                     <span style="position: absolute;top:20px;left: 25px;color: #fff;font-size: 14px;">该用户无会员卡</span>
//                     <img src="assets/images/cardAdd.png" style="width:100%;height:100%">
//                   </div>
//                 </div>
//
//                 <div class="flex mg-l-30">
//                   <div>
//                     <label class="font-bold">项目折扣</label>
//                     <span class="mg-l-20  dib">
//                      {{cuserWFCompData.memberCard.prodDiscount|discountPipe}}
//                     </span>
//                   </div>
//                   <div>
//                     <label class="font-bold">商品折扣</label>
//                     <span class="mg-l-20 mg-t-5 dib">
//                      {{cuserWFCompData.memberCard.goodsDiscount|discountPipe}}
//
//                     </span>
//                   </div>
//                   <div>
//                     <label class="font-bold">次卡折扣</label>
//                     <span class="mg-l-20 mg-t-5 dib">
//                      {{cuserWFCompData.memberCard.prdCardDiscount|discountPipe}}
//                     </span>
//                   </div>
//                    <div>
//                     <label class="font-bold">套餐折扣</label>
//                     <span class="mg-l-20 mg-t-5 dib">
//                      {{cuserWFCompData.memberCard.packagePrjDiscount|discountPipe}}
//                     </span>
//                   </div>
//                   <div>
//                     <label class="font-bold">储值余额</label>
//                     <span class="mg-l-20 mg-t-5 dib">
//                     {{cuserWFCompData.leaguerMemberCard.balance == 0.0?"-":cuserWFCompData.leaguerMemberCard.balance |number:'1.2-2'}}
//                     </span>
//                   </div>
//                   <div>
//                     <label class="font-bold">到期时间</label>
//                     <span class="mg-l-20 mg-t-5 dib">{{cuserWFCompData.leaguerMemberCard.endTime| datetimePipeComp:hasMbCard}}</span>
//                   </div>
//                 </div>
//
//
//          </content>
//     </zm-card-box>
//     <!-- 选择会员 end -->
//   `,
//   styles: [`
//     .nameDiv {
//       display: inline-block;
//       width: 200px;
//       border: 2px solid#03a9f4;
//       border-radius: 6px;
//       // padding: 8px 10px;
//       padding-left:15px;
//       height:35px;
//       line-height: 31px;
//       position: relative;
//     }
//
//     .library{
//       max-width:600px;
//     }
//     .library span{
//       border:1px solid #03a9f4;
//       border-radius:5px;
//       font-size:12px;
//       padding:0 5px;
//       margin:8px 8px 0 0;
//       cursor:pointer;
//     }
//     .libraryActive{
//       background:#03a9f4;
//       color:#ffffff;
//     }
//   `],
// })
// export class CuserWFComp implements OnInit,OnChanges {
//   public libNum: number = 1;
//
//
//   private service: CuserWFCompService;
//   public viewData: CuserWFCompViewData = new CuserWFCompViewData();
//   public contentExpanded = false;
//
//   @Input() wFDataWraper: WFDataWraper;
//   public cuserWFCompData: CuserWFCompData;
//   public hasMbCard: boolean = false;//无会员卡
//   public hasExpired: boolean = false;//未过期
//
//   constructor(private wfDataWraperMgr: WFDataWraperMgr,
//               private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
//               private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
//               private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
//               private matDialog: MatDialog,) {
//     ZmModalMgr.getInstance().reset(matDialog);
//     this.service = new CuserWFCompService(this.storeLeaguerInfoSynDataHolder,
//       this.storeCardInfoSynDataHolder,
//       this.leaguerDetailSynDataHolder,);
//   }
//
//   ngOnInit(): void {
//     this.viewData = new CuserWFCompViewData();
//     this.service.initViewData((viewDataP: CuserWFCompViewData) => {
//       if (viewDataP) {
//         this.viewData = viewDataP;
//         if ((this.wFDataWraper.getWFTypeName() == Constants.CONSUMEWFNAME) && !this.wFDataWraper.getWorkFlowData()) {
//           this.wFDataWraper.isLeaguer = false;
//           this.setLeaguerData(this.viewData.defaultLeaguer);
//           this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
//         }
//       } else {
//         AppUtils.showError("提示", "加载数据失败");
//       }
//     });
//   }
//
//
// // 客户标签形象选中
//   libClick(n) {
//     this.libNum = n;
//   }
//
//
//   ngOnChanges(changes) {
//     //处理流程数据回填
//     if (this.wFDataWraper) {
//       this.cuserWFCompData = this.wFDataWraper.getCuserWFCompData();
//       let leaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
//       if (!AppUtils.isNullObj(leaguer)) {
//         this.cuserWFCompData.selectLeaguer = leaguer;
//         if (!AppUtils.isNullOrWhiteSpace(leaguer.name) && this.wFDataWraper.isLeaguer) {
//           this.viewData.hasLeaguer = true;
//           this.contentExpanded = true;
//         }
//         if (!AppUtils.isNullObj(leaguer.leaguerMemberCard)) {
//           this.cuserWFCompData.leaguerMemberCard = leaguer.leaguerMemberCard;
//           let cardId = leaguer.leaguerMemberCard.cardId;
//           if (!AppUtils.isNullOrWhiteSpace(cardId)) {
//             this.hasMbCard = true;
//             let cardState = leaguer.leaguerMemberCard.state;
//             cardState == MemberCardStateEnum.INVALID ? this.hasExpired = true : this.hasExpired = false;
//             if (this.viewData.memberCardMap) {
//               let memberCard = this.viewData.memberCardMap.get(cardId);
//               if (memberCard) {
//                 this.cuserWFCompData.memberCard = memberCard;
//               } else {
//                 this.cuserWFCompData.memberCard = new MembershipCard();
//               }
//             }
//           } else {
//             this.hasMbCard = false;
//           }
//         }
//       } else {
//         this.viewData.hasLeaguer = false;
//         this.cuserWFCompData.selectLeaguer = new LeaguerDetail();
//         this.cuserWFCompData.memberCard = new MembershipCard();
//         this.cuserWFCompData.leaguerMemberCard = new LeaguerMemberCard();
//         this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
//       }
//     }
//   }
//
//   /**选择会员回调*/
//   selectLeaguer(leaguer: Leaguer, isLeaguer: boolean) {
//     if (this.wFDataWraper.getCuserWFCompData().selectLeaguer && (this.wFDataWraper.getCuserWFCompData().selectLeaguer.id != leaguer.id)) {//是否已选择该会员
//       this.contentExpanded = true;
//       let isCardPrd = this.hasCardProduct();
//       if (isCardPrd) {
//         Popup.getInstance().open("提示", "切换会员将清除划卡项目，请确认", () => {
//           this.leaguerDetailSynDataHolder.getData(leaguer.id).then((leaguerDetail) => {
//             let leaguerDetailTmp = leaguerDetail.encryptLeaguerDetail();
//             if (!AppUtils.isNullObj(leaguerDetailTmp)) {
//               this.setLeaguerData(leaguerDetailTmp);
//               this.wFDataWraper.isLeaguer = isLeaguer;
//               this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
//             } else {
//               AppUtils.showError("提示", "设置会员失败");
//             }
//           })
//         });
//       } else {
//         this.leaguerDetailSynDataHolder.getData(leaguer.id).then((leaguerDetail) => {
//           let leaguerDetailTmp = leaguerDetail.encryptLeaguerDetail();
//           if (!AppUtils.isNullObj(leaguerDetailTmp)) {
//             this.setLeaguerData(leaguerDetailTmp);
//             this.wFDataWraper.isLeaguer = isLeaguer;
//             this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
//           } else {
//             AppUtils.showError("提示", "设置会员失败");
//           }
//         })
//       }
//     }
//   }
//
//   //是否已选次卡项目
//   hasCardProduct() {
//     let isCardPrd = false;
//     let list = this.wFDataWraper.getDelimitCardRecordsWFCompData().reduceList;
//     if (list.length > 0) {
//       list.filter((item) => {
//         if (item.payType == 1) {
//           isCardPrd = true;
//         }
//       });
//     }
//     return isCardPrd;
//   }
//
//   private setLeaguerData(leaguer: LeaguerDetail) {
//     this.viewData.hasLeaguer = true;
//     if (leaguer.leaguerMemberCard && leaguer.leaguerMemberCard.cardId) {
//       this.wFDataWraper.getCuserWFCompData().leaguerMemberCard = leaguer.leaguerMemberCard;
//       let memberCard = this.viewData.memberCardMap.get(leaguer.leaguerMemberCard.cardId);
//       if (memberCard) {
//         this.wFDataWraper.getCuserWFCompData().memberCard = memberCard;
//         this.viewData.selectMemberCard = memberCard;
//       }
//     } else {
//       this.wFDataWraper.getCuserWFCompData().memberCard = new MembershipCard();
//       this.wFDataWraper.getCuserWFCompData().leaguerMemberCard = new LeaguerMemberCard();
//       this.viewData.selectMemberCard = new MembershipCard();
//     }
//     this.wFDataWraper.getCuserWFCompData().selectLeaguer = leaguer;
//     this.wFDataWraper.leaguerId = leaguer.id;
//     this.wfDataWraperMgr.changeLeaguer(this.wFDataWraper);
//   }
//
//   /**选择会员模态框*/
//   selectCustomer(event): void {
//     event.stopPropagation();
//     if (!AppUtils.isNullObj(this.wFDataWraper.getWorkFlowData())
//       && !AppUtils.isNullObj(this.wFDataWraper.getWorkFlowData().appointInfo)
//       && (this.wFDataWraper.getWorkFlowData().appointInfo.appointId > 0)) {
//       AppUtils.showWarn("提示", "不能更换预约会员");
//     } else {
//       const selectLeaguerModal = ZmModalMgr.getInstance().newModal(CuserWFPopup, null, null);
//       this.viewData.showIndividual = (this.wFDataWraper.getWFTypeName() == Constants.CONSUMEWFNAME);
//       let data: CuserWFPopupViewData = CuserWFPopupViewData.fromParentComp(this.viewData);
//       selectLeaguerModal.componentInstance.data = data;
//       selectLeaguerModal.componentInstance.callBack = this.selectLeaguer.bind(this);
//     }
//   }
//
// }
//
// export class CuserWFCompService {
//
//   constructor(private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
//               private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
//               private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,) {
//   }
//
//   /**
//    * 初始化页面数据
//    * @param callback
//    */
//   public async initViewData(callback: (viewDataP: CuserWFCompViewData) => void) {
//     let viewDataTmp = new CuserWFCompViewData();
//
//     //请求storeLeaguerInfo 会员详情
//     let storeId = SessionUtil.getInstance().getStoreId();
//     let storeLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
//     if (!AppUtils.isNullObj(storeLeaguerInfo)) {
//       viewDataTmp.leaguerMap = storeLeaguerInfo.getValidLeaguerMap();
//       viewDataTmp.leaguerList = viewDataTmp.leaguerMap.values();
//       let nanId = AppUtils.format(Constants.LEAGUER_MALE_FORMAT, storeId);
//       let nvId = AppUtils.format(Constants.LEAGUER_FEMALE_FORMAT, storeId);
//       viewDataTmp.defaultNan = storeLeaguerInfo.getAllLeaguerMap().get(nanId);
//       viewDataTmp.defaultNv = storeLeaguerInfo.getAllLeaguerMap().get(nvId);
//       viewDataTmp.defaultLeaguer = await this.leaguerDetailSynDataHolder.getData(nvId);
//     }
//
//     //请求storeCardInfo 会员卡信息
//     let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
//     if (storeCardInfo) {
//       viewDataTmp.memberCardMap = storeCardInfo.getMemberCardMap();
//     }
//
//     callback(viewDataTmp);
//   }
//
// }
//
// export class CuserWFCompViewData {
//   public leaguerMap: ZmMap<Leaguer>;
//   public memberCardMap: ZmMap<MembershipCard>;
//   public leaguerList: Array<Leaguer> = new Array();
//   public defaultNan: Leaguer;
//   public defaultNv: Leaguer;
//   public defaultLeaguer: LeaguerDetail;//默认会员
//   public showIndividual: boolean = true;//显示散客
//
//   //选中的会员
//   public selectLeaguer: Leaguer = new Leaguer();
//   //选中的会员对应的会员卡类型信息
//   public selectMemberCard: MembershipCard = new MembershipCard();
//   public hasLeaguer: boolean = false;
//
// }
//
//
