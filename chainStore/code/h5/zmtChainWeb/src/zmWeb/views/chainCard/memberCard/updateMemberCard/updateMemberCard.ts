import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainCardMgr} from "../../../../bsModule/chainCard/chainCardMgr";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {ChainCardUpdateApiForm} from "../../../../bsModule/chainCard/apiData/ChainCardUpdateApiForm";
import {ChainCardUpdateType} from "../../../../bsModule/chainCard/apiData/ChainCardUpdateType";
import {ChainCard} from "../../../../bsModule/chainCard/data/ChainCard";
import {UpdMembershipCard} from "../../../../bsModule/chainCard/apiData/UpdMembershipCard";
import {ChooseCardModal} from "../../Comp/ChooseImgComp/ChooseCardModal.Component";
import {AppRouter} from "../../../../comModule/AppRouter";
import {ChainCardSynDataHolder} from "../../../../bsModule/chainCard/chainCardSynDataHolder";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {CardStatusEnum} from "../../../../bsModule/chainCard/data/CardStatusEnum";
import {MembershipCardDetail} from "../../../../bsModule/chainCard/data/MembershipCardDetail";
import {MembershipCardDetailCacheDataHolder} from "../../../../bsModule/chainCard/MemCardDetailCacheDataHolder";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";

@Component({
  selector: 'page-storeCard-updateMemberCard',
  templateUrl: 'updateMemberCard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UpdateMemberCardPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: UpdateMemberCardService;
  public viewData: UpdateMemberCardViewData;


  constructor(private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardMgr: ChainCardMgr,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private membershipCardDetailCacheDataHolder:MembershipCardDetailCacheDataHolder,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new UpdateMemberCardService(this.chainCardSynDataHolder, this.chainCardMgr, this.chainCardViewDataMgr,this.membershipCardDetailCacheDataHolder,this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainCardViewDataMgr.subscribeUpdateMemberCardVD((viewDataP: UpdateMemberCardViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let mbCardId = params['mbCardId'];
      this.service.initViewData(mbCardId);
    });

  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.paramsSub.unsubscribe();
    }

  }

  /**
   * 选择图片
   */
  showMemCardModal() {
    let imageArr = new Array<string>();
    for (let i = 1; i < 7; i++) {
      let imageStr = `img/logo/card/pic_membership_card${i}.png`;
      imageArr.push(imageStr);
    }

    let modalData = {imageList:imageArr};
    let tmp = this;
    let callBack = (imgUrl) => {
      if (imgUrl != null) {
        tmp.viewData.imgUrl = imgUrl;
      }
      tmp.cdRef.markForCheck();
    };
    ZmModalMgr.getInstance().newLgModal(ChooseCardModal,modalData,callBack);
  }

  /**number唯一性*/
  checkNumber() {
    if (!AppUtils.isNullOrWhiteSpace(this.viewData.defaultNumber)){
      let number = this.viewData.memberCardDetail.number;
      let numberList: Array<string> = this.viewData.numberList;

      if(this.viewData.defaultNumber != number){
        if(AppUtils.arrayContains(numberList,this.viewData.defaultNumber)) {
          this.viewData.isExitNumber = true;
        } else {
          this.viewData.isExitNumber = false;
        }
      }

      if(this.viewData.defaultNumber.match("^\\s*[\\w-]+\\s*$")){
        this.viewData.notRightNumber = false;
      }else{
        this.viewData.notRightNumber = true;
      }
    }
  }

  /**
   * 分配
   */
  public selectStore() {
    let modalData = {storeList:this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList:Array<StoreVD>) => {
      tmp.getSelectedStore(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp,modalData,callBack);
  }

  private getSelectedStore(storeList:Array<StoreVD>){
    this.viewData.selectStoreList = new Array();
    this.viewData.selectStoreList = storeList;
    this.viewData.selectStoreIds =  this.viewData.selectStoreList.map((item)=>{
      return item.id;
    });
    this.service.handleViewData(this.viewData);
  }

  removeStore(){
    this.viewData.selectStoreIds =  this.viewData.selectStoreList.map((item)=>{
      return item.id;
    });
  }

  /**
   * 编辑会员卡  点击事件
   * @param prdId:number
   */
  public async updateMemberCard(mdCardId: string) {
    let checkSuccess = this.checkForm();
    if(checkSuccess){
      let formData: UpdMembershipCard = this.getUpdateMemberCardForm(mdCardId);
      let success = await this.service.updateMemberCard(formData);
      this.handleResult(success);
    }

  }

  private getUpdateMemberCardForm(mdCardId:string){
    let formData: UpdMembershipCard = new UpdMembershipCard();
    this.viewData.state === true ? this.viewData.memberCardDetail.status = CardStatusEnum.OPEN : this.viewData.memberCardDetail.status = CardStatusEnum.CLOSE;
    this.viewData.memberCardDetail.imgPath = this.viewData.imgUrl;
    this.viewData.memberCardDetail.number = this.viewData.defaultNumber;
    AppUtils.copy(formData, this.viewData.memberCardDetail);
    formData.id = mdCardId;
    formData.applyStoreIds = this.viewData.selectStoreIds;
    return formData;
  }

  private checkForm():boolean{
    this.checkNumber();
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.defaultNumber)
      || AppUtils.isNullObj(this.viewData.memberCardDetail.freeMoney)
      || AppUtils.isNullOrWhiteSpace(this.viewData.memberCardDetail.name)
      || AppUtils.isNullObj(this.viewData.memberCardDetail.goodsDiscount)
      || AppUtils.isNullObj(this.viewData.memberCardDetail.prodDiscount)
      || AppUtils.isNullObj(this.viewData.memberCardDetail.prdCardDiscount)
      || AppUtils.isNullObj(this.viewData.memberCardDetail.packagePrjDiscount)
      || this.viewData.isExitNumber == true){
      AppUtils.showWarn("提示", "必填项未按要求填写");
      checkSuccess = false;
    }
    return checkSuccess;
  }

  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.EDIT_SUCCESS);
      AppRouter.goMemberCardList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.EDIT_ERROR);
    }
  }

}


export class UpdateMemberCardViewData {
  public memberCardDetail: MembershipCardDetail = new MembershipCardDetail();

  public storeList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds:Array<string> = new Array<string>();

  public state: boolean;//上下架状态
  public imgUrl: string;//选择图片路径

  public numberList: Array<string> = new Array<string>();//编号列表
  public isExitNumber:boolean = false;
  public notRightNumber:boolean = false;
  public defaultNumber:string;
  public defaultNumberPass:boolean;
}


class UpdateMemberCardService {

  constructor(private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardMgr: ChainCardMgr,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private membershipCardDetailCacheDataHolder:MembershipCardDetailCacheDataHolder,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(mbCardId: string): void {
    this.chainCardViewDataMgr.setUpdateMemberCardViewData(new UpdateMemberCardViewData());

    this.buildViewData(mbCardId).then((viewDataTmp: UpdateMemberCardViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: UpdateMemberCardViewData) {
    this.chainCardViewDataMgr.setUpdateMemberCardViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId:string
   * @param mbCardId:string
   * @returns Promise<UpdateMemberCardViewData>
   */
  public async buildViewData(mbCardId: string): Promise<UpdateMemberCardViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: UpdateMemberCardViewData = new UpdateMemberCardViewData();

    let chainCard: ChainCard = await this.chainCardSynDataHolder.getData(chainId);
    let memCardList = chainCard.getMemberCardMap().values();
    if (chainCard && memCardList) {
      viewDataTmp.numberList = this.bulidMbCardNumberList(memCardList);
    }

    let targetMbCard: MembershipCardDetail = await this.membershipCardDetailCacheDataHolder.getData(mbCardId);
    if (targetMbCard) {
      viewDataTmp.memberCardDetail = targetMbCard;
      targetMbCard.status == CardStatusEnum.OPEN ? viewDataTmp.state = true : viewDataTmp.state = false;
      viewDataTmp.imgUrl = targetMbCard.imgPath;
      viewDataTmp.defaultNumber = targetMbCard.number;
    }

    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    if(pageResp){
      viewDataTmp.storeList = pageResp.list.map((store)=>{
        return StoreVD.fromStore(store);
      });
    }
    if(viewDataTmp.memberCardDetail){
      viewDataTmp.selectStoreList = this.getSelectStoreList(viewDataTmp.storeList,viewDataTmp.memberCardDetail.applyStoreIds);
      viewDataTmp.selectStoreIds = viewDataTmp.selectStoreList.map((item)=>{
        return item.id;
      });
    }

    return new Promise<UpdateMemberCardViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private getSelectStoreList(storeList:Array<StoreVD>,applyStoreIds:Array<string>){
    let storeListTmp = new Array<StoreVD>();
    if(applyStoreIds){
      for(let id of applyStoreIds){
        storeList.forEach((item)=>{
          if(item.id == id){
            item.checked = true;
            storeListTmp.push(item);
          }
        });
      }
    }
    return storeListTmp;
  }

  /**
   * 会员卡编号列表
   * 新建时保证编号唯一性
   */
  private bulidMbCardNumberList(memCardList):Array<string>{
    let mbCardNumberList = new Array<string>();
    for (let mbCard of memCardList) {
      mbCardNumberList.push(mbCard.number);
    }
    return mbCardNumberList;
  }

  public updateMemberCard(formData: UpdMembershipCard): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let updateForm = new ChainCardUpdateApiForm();
    updateForm.updateType = ChainCardUpdateType.UpdMembershipCard;
    updateForm.updMembershipCard = formData;//formData
    return new Promise<boolean>(resolve => {
      this.chainCardMgr.updateChainCard(chainId, updateForm).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }


}
