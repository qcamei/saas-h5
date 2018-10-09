// import {Component, OnInit, OnDestroy} from "@angular/core";
// import {StoreMgr} from "../../bsModule/store/StoreMgr";
// import {BUserSynDataHolder} from "../../bsModule/buser/BUserSynDataHolder";
// import {AppUtils} from "../../comModule/AppUtils";
// import {SessionUtil} from "../../comModule/session/SessionUtil";
// import {BUser} from "../../bsModule/buser/apiData/BUser";
// import {AppRouter} from "../../comModule/AppRouter";
// import {Store} from "../../bsModule/store/apiData/Store";
// import {StoreAddApiForm} from "../../bsModule/store/apiData/StoreAddApiForm";
//
// /**
//  * 店铺管理 管理者暂无店铺 创建店铺页面
//  */
// @Component({
//   selector:'boss-add-store',
//   template:`
//             <view-body-comp [headerArr]="['暂无店铺，请先新增店铺']">
//
//   <div style="max-width:600px">
//
//     <zm-input-name label="店铺名称" placeholder="请输入店铺名称" maxlength="15"
//                    [(zmValue)]="viewData.addForm.name" [(zmPass)]="viewData.addForm.namePass"></zm-input-name>
//
//     <div class="form-group row mb-0">
//       <label class="col-form-label text-center col-md-2 px-0"><span class="text-danger"> *</span>区域</label>
//       <div class="col-md-10">
//         <city-select-comp [(citySetting)]="viewData.citySetting"></city-select-comp>
//       </div>
//     </div>
//
//     <zm-input-textarea [label]="'详细地址'" [placeholder]="'请输入详细地址'"
//                        [(text)]="viewData.addForm.address" [maxlength]="200"></zm-input-textarea>
//
//     <zm-input-tel label="预约电话"  placeholder="请输入预约电话" [(zmValue)]="viewData.addForm.tel" [(zmPass)]="viewData.addForm.telPass" [required]="true"></zm-input-tel>
//
//     <zm-input-textarea maxlength="200" [label]="'店铺介绍'" [placeholder]="'请输入店铺介绍'" [(text)]="viewData.addForm.descript"></zm-input-textarea>
//
//     <div fxLayout="row" fxLayoutAlign="end" style="margin-top: 20px;">
//       <zm-btn-large  notrepeatsubmit fxFlexAlign="end" [disabled]="!(viewData.addForm.namePass && viewData.addForm.telPass)" name="保存" (zmbtnClick)="addStore()"></zm-btn-large>
//     </div>
//   </div>
//
// </view-body-comp>
//
// `,
//   styles:[
//
//   ],
// })
//
// export class BossAddStorePage implements OnInit,OnDestroy{
//
//   private service: BossAddStoreService;
//   public viewData: BossAddStoreViewData = new BossAddStoreViewData();
//
//   constructor(private storeMgr:StoreMgr,
//               private buserSynDataHolder:BUserSynDataHolder){
//     this.service = new BossAddStoreService(this.storeMgr);
//   }
//
//   ngOnInit(): void {
//
//   }
//
//   ngOnDestroy(): void {
//
//   }
//
//   /**
//    * 添加店铺点击事件
//    */
//   async addStore(){
//     if(AppUtils.isNullOrWhiteSpace(this.viewData.addForm.name)){
//       AppUtils.showWarn("提示","请输入店铺名称");
//     }else if(AppUtils.isNullOrWhiteSpace(this.viewData.citySetting.join("/"))){
//       AppUtils.showWarn("提示","请选择区域");
//     }else if(AppUtils.isNullOrWhiteSpace(this.viewData.addForm.tel)){
//       AppUtils.showWarn("提示","请输入预约电话");
//     }else{
//       let userId = SessionUtil.getInstance().getUserId();
//       if(!AppUtils.isNullOrWhiteSpace(userId)){
//         let buser:BUser = await this.buserSynDataHolder.getData(userId);
//         if(!AppUtils.isNullObj(buser.id) && buser.roleSet && AppUtils.arrayContains(buser.roleSet,"0")){
//           this.viewData.addForm.bossId = userId;
//           this.viewData.addForm.area = this.viewData.citySetting.join("/");
//           AppUtils.showMask("加载中");
//           let store = await this.service.addStore(this.viewData.addForm);
//           if(store){
//             AppUtils.closeMask();
//             AppUtils.showSuccess("提示","新建成功");
//             AppRouter.goGuide();
//           }else{
//             AppUtils.closeMask();
//             AppUtils.showError("提示","新建失败");
//           }
//         }else{
//           AppUtils.showWarn("提示","非管理端暂无权限新建店铺");
//         }
//       }else{
//         AppRouter.goLogin();
//       }
//     }
//   }
//
// }
//
// export class BossAddStoreService{
//   constructor(private storeMgr:StoreMgr){}
//
//   /**
//    * 添加店铺
//    * @param addForm
//    */
//   public addStore(addForm):Promise<Store>{
//     return this.storeMgr.addStore(addForm);
//   }
//
// }
//
// export class BossAddStoreViewData{
//   public addForm:StoreAddApiForm = new StoreAddApiForm();
//   public citySetting:string[] = [];
// }
