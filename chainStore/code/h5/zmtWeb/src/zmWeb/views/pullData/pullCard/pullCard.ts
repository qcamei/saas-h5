import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {ChainDataQueryForm} from "../../../bsModule/chainDataSyn/apiData/ChainDataQueryForm";
import {GenericSelect} from "../../../comModule/bean/GenericSelect";
import {ProductCardSyn} from "../../../bsModule/chainDataSyn/data/ProductCardSyn";
import {PrdCardType} from "../../../bsModule/chainCard/data/PrdCardType";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppRouter} from "../../../comModule/AppRouter";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {PullDataViewDataMgr} from "../pullViewDataMgr";
import {ChainDataSynMgr} from "../../../bsModule/chainDataSyn/ChainDataSynMgr";
import {ChainCardMgr} from "../../../bsModule/chainCard/ChainCardMgr";
import {PageResp} from "../../../comModule/PageResp";
import {ChainDataStatusEnum} from "../../../bsModule/chainDataSyn/data/ChainDataStatusEnum";
import {ChainCard} from "../../../bsModule/chainCard/data/ChainCard";
import {StoreCardInfoMgr} from "../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {CardPullForm} from "../../../bsModule/storeCardInfo/apiData/CardPullForm";
import {CardBatchPullForm} from "../../../bsModule/storeCardInfo/apiData/CardBatchPullForm";
import {CardCancelForm} from "../../../bsModule/storeCardInfo/apiData/CardCancelForm";
import {CardBatchCancelForm} from "../../../bsModule/storeCardInfo/apiData/CardBatchCancelForm";

@Component({
  selector: 'pull-card',
  templateUrl: 'pullCard.html',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class PullCardPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private service: PullCardService;
  public viewData: PullCardViewData;

  constructor(private chainDataSynMgr:ChainDataSynMgr,
              private chainCardMgr:ChainCardMgr,
              private storeCardInfoMgr:StoreCardInfoMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new PullCardService(this.chainDataSynMgr,
      this.chainCardMgr,
      this.storeCardInfoMgr,
      this.pullDataViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.pullDataViewDataMgr.subscribePullCardVD((viewDataP:PullCardViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 全选/反选
   * @param isSelected
   */
  checkAll(isSelected:boolean){
    if(isSelected){
      this.viewData.list.forEach((item:GenericSelect<ProductCardSyn>)=>{
        if(item.target.synStatus == ChainDataStatusEnum.NOT_HAVE){
          item.isSelected = true;
        }
      })
    }else{
      this.viewData.list.forEach((item:GenericSelect<ProductCardSyn>)=>{
        item.isSelected = false;
      })
    }
  }

  /**
   * 获取
   * @param id
   */
  pullData(id:string){
    this.service.pullData(id).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","获取成功");
        this.getPageData(1);
      }else{
        AppUtils.showError("提示","获取失败");
      }
    })
  }

  /**
   * 批量获取
   */
  batchPullData(){
    let idArr = [];
    this.viewData.list.forEach((item:GenericSelect<ProductCardSyn>)=>{
      if(item.isSelected){
        idArr.push(item.target.id);
      }
    });
    if(idArr.length > 0){
      this.service.batchPullData(idArr).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","获取成功");
          this.getPageData(1);
        }else{
          AppUtils.showError("提示","获取失败");
        }
      })
    }else{
      AppUtils.showWarn("提示","请选择获取项");
    }
  }

  /**
   * 取消获取
   * @param id
   */
  cancelData(id){
    this.service.cancelData(id).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","取消获取成功");
        this.getPageData(1);
      }else{
        AppUtils.showError("提示","取消获取失败");
      }
    })
  }

  /**
   * 批量取消获取
   */
  batchCancelData(){
    let idArr = [];
    this.viewData.list.forEach((item:GenericSelect<ProductCardSyn>)=>{
      if(item.isSelected){
        idArr.push(item.target.id);
      }
    });
    if(idArr.length > 0){
      this.service.batchCancelData(idArr).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","取消获取成功");
          this.getPageData(1);
        }else{
          AppUtils.showError("提示","取消获取失败");
        }
      })
    }else{
      AppUtils.showWarn("提示","请选择取消项");
    }
  }

  /**
   * 跳转详情
   * @param id
   */
  goDetail(id){
    AppRouter.goChainCardDetail(id);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    if(!AppUtils.isNullObj(this.viewData.chainDataQueryForm.numberOrName)){
      this.viewData.chainDataQueryForm.numberOrName = AppUtils.isNullOrWhiteSpace(this.viewData.chainDataQueryForm.numberOrName)?'':AppUtils.trimBlank(this.viewData.chainDataQueryForm.numberOrName);
    }
    this.service.getPageData(curPage,this.viewData);
  }

}

export class PullCardService{
  constructor(private chainDataSynMgr:ChainDataSynMgr,
              private chainCardMgr:ChainCardMgr,
              private storeCardInfoMgr:StoreCardInfoMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,){}

  public initViewData():void{
    let viewDataTmp = new PullCardViewData();
    this.pullDataViewDataMgr.setPullCardViewData(viewDataTmp);

    this.buildViewData();
  }

  public async buildViewData(){
    let viewDataTmp = new PullCardViewData();

    let chainId = SessionUtil.getInstance().getChainId();
    let chainCard:ChainCard = await this.chainCardMgr.get(chainId);
    if(!AppUtils.isNullObj(chainCard)){
      let typeMap = ZmMap.fromMap(PrdCardType,"id",chainCard.prdCardTypeMap);
      viewDataTmp.typeList = typeMap.values();
    }

    viewDataTmp.chainDataQueryForm.chainId = chainId;
    let storeId = SessionUtil.getInstance().getStoreId();
    viewDataTmp.chainDataQueryForm.storeId = storeId;
    let pageResp: PageResp = await this.chainDataSynMgr.findChainProductCard(viewDataTmp.chainDataQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.curPage = 1;
      viewDataTmp.recordCount = pageResp.totalCount;
      viewDataTmp.list = GenericSelect.fromList(pageResp.list);
    }

    viewDataTmp.loadingFinish = true;
    this.pullDataViewDataMgr.setPullCardViewData(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewDataTmp: PullCardViewData) {
    viewDataTmp.loadingFinish = false;
    viewDataTmp.allChecked = false;
    viewDataTmp.recordCount = 0;
    viewDataTmp.list = [];

    let pageResp: PageResp = await this.chainDataSynMgr.findChainProductCard(viewDataTmp.chainDataQueryForm);
    viewDataTmp.curPage = curPage;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.list = GenericSelect.fromList(pageResp.list);

    viewDataTmp.loadingFinish = true;
    this.pullDataViewDataMgr.setPullCardViewData(viewDataTmp);
  }

  /**
   * 获取
   * @param id
   * @returns {Promise<boolean>}
   */
  public pullData(id:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let cardPullForm = new CardPullForm();
    cardPullForm.chainId = chainId;
    cardPullForm.id = id;
    return this.storeCardInfoMgr.pullCardFromChain(storeId,cardPullForm);
  }

  /**
   * 批量获取
   * @param idArr
   * @returns {Promise<boolean>}
   */
  batchPullData(idArr:Array<string>):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let cardBatchPullForm = new CardBatchPullForm();
    cardBatchPullForm.pullForms = idArr.map((id:string)=>{
      let cardPullForm = new CardPullForm();
      cardPullForm.chainId = chainId;
      cardPullForm.id = id;
      return cardPullForm;
    })
    return this.storeCardInfoMgr.batchPullCardFromChain(storeId,cardBatchPullForm);
  }

  /**
   * 取消获取
   * @param id
   * @returns {Promise<boolean>}
   */
  cancelData(id:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let cardCancelForm = new CardCancelForm();
    cardCancelForm.chainId = chainId;
    cardCancelForm.id = id;
    return this.storeCardInfoMgr.cancelChainCard(storeId,cardCancelForm);
  }

  /**
   * 批量取消获取
   * @param idArr
   * @returns {Promise<boolean>}
   */
  batchCancelData(idArr:Array<string>):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let cardBatchCancelForm = new CardBatchCancelForm();
    cardBatchCancelForm.cancelForms = idArr.map((id:string)=>{
      let cardCancelForm = new CardCancelForm();
      cardCancelForm.chainId = chainId;
      cardCancelForm.id = id;
      return cardCancelForm;
    })
    return this.storeCardInfoMgr.batchCancelChainCard(storeId,cardBatchCancelForm);
  }

}

export class PullCardViewData{
  public chainDataQueryForm:ChainDataQueryForm = new ChainDataQueryForm();
  public list:Array<GenericSelect<ProductCardSyn>> = new Array<GenericSelect<ProductCardSyn>>();
  public typeList: Array<PrdCardType> = new Array<PrdCardType>();
  public allChecked:boolean = false;

  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;
}
