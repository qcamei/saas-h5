import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {ChainDataQueryForm} from "../../../bsModule/chainDataSyn/apiData/ChainDataQueryForm";
import {GenericSelect} from "../../../comModule/bean/GenericSelect";
import {MemberCardSyn} from "../../../bsModule/chainDataSyn/data/MemberCardSyn";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PageResp} from "../../../comModule/PageResp";
import {AppUtils} from "../../../comModule/AppUtils";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChainDataSynMgr} from "../../../bsModule/chainDataSyn/ChainDataSynMgr";
import {StoreCardInfoMgr} from "../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {PullDataViewDataMgr} from "../pullViewDataMgr";
import {ChainDataStatusEnum} from "../../../bsModule/chainDataSyn/data/ChainDataStatusEnum";
import {MemberCardPullForm} from "../../../bsModule/storeCardInfo/apiData/MemberCardPullForm";
import {MemberCardBatchPullForm} from "../../../bsModule/storeCardInfo/apiData/MemberCardBatchPullForm";
import {MemberCardCancelForm} from "../../../bsModule/storeCardInfo/apiData/MemberCardCancelForm";
import {MemberCardBatchCancelForm} from "../../../bsModule/storeCardInfo/apiData/MemberCardBatchCancelForm";

@Component({
  selector: 'pull-memberCard',
  templateUrl: 'pullMemberCard.html',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class PullMemberCardPage implements OnInit {
  private viewDataSub: any;
  private service: PullMemberCardService;
  public viewData: PullMemberCardViewData;

  constructor(private chainDataSynMgr:ChainDataSynMgr,
              private storeCardInfoMgr:StoreCardInfoMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new PullMemberCardService(this.chainDataSynMgr,
      this.storeCardInfoMgr,
      this.pullDataViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.pullDataViewDataMgr.subscribePullMemberCardVD((viewDataP:PullMemberCardViewData) => {
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
      this.viewData.list.forEach((item:GenericSelect<MemberCardSyn>)=>{
        if(item.target.synStatus == ChainDataStatusEnum.NOT_HAVE){
          item.isSelected = true;
        }
      })
    }else{
      this.viewData.list.forEach((item:GenericSelect<MemberCardSyn>)=>{
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
    this.viewData.list.forEach((item:GenericSelect<MemberCardSyn>)=>{
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
    this.viewData.list.forEach((item:GenericSelect<MemberCardSyn>)=>{
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
    AppRouter.goChainMemberCardDetail(id);
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

export class PullMemberCardService{
  constructor(private chainDataSynMgr:ChainDataSynMgr,
              private storeCardInfoMgr:StoreCardInfoMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,){}

  public initViewData():void{
    let viewDataTmp = new PullMemberCardViewData();
    this.pullDataViewDataMgr.setPullMemberCardViewData(viewDataTmp);

    this.buildViewData();
  }

  public async buildViewData(){
    let viewDataTmp = new PullMemberCardViewData();

    let chainId = SessionUtil.getInstance().getChainId();
    let storeId = SessionUtil.getInstance().getStoreId();
    viewDataTmp.chainDataQueryForm.chainId = chainId;
    viewDataTmp.chainDataQueryForm.storeId = storeId;
    let pageResp: PageResp = await this.chainDataSynMgr.findChainMemberCard(viewDataTmp.chainDataQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.curPage = 1;
      viewDataTmp.recordCount = pageResp.totalCount;
      viewDataTmp.list = GenericSelect.fromList(pageResp.list);
    }

    viewDataTmp.loadingFinish = true;
    this.pullDataViewDataMgr.setPullMemberCardViewData(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewDataTmp: PullMemberCardViewData) {
    viewDataTmp.loadingFinish = false;
    viewDataTmp.allChecked = false;
    viewDataTmp.recordCount = 0;
    viewDataTmp.list = [];

    let pageResp: PageResp = await this.chainDataSynMgr.findChainMemberCard(viewDataTmp.chainDataQueryForm);
    viewDataTmp.curPage = curPage;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.list = GenericSelect.fromList(pageResp.list);

    viewDataTmp.loadingFinish = true;
    this.pullDataViewDataMgr.setPullMemberCardViewData(viewDataTmp);
  }

  /**
   * 获取
   * @param id
   * @returns {Promise<boolean>}
   */
  public pullData(id:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let memberCardPullForm = new MemberCardPullForm();
    memberCardPullForm.chainId = chainId;
    memberCardPullForm.id = id;
    return this.storeCardInfoMgr.pullMemberCardFromChain(storeId,memberCardPullForm);
  }

  /**
   * 批量获取
   * @param idArr
   * @returns {Promise<boolean>}
   */
  batchPullData(idArr:Array<string>):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let memberCardBatchPullForm = new MemberCardBatchPullForm();
    memberCardBatchPullForm.pullForms = idArr.map((id:string)=>{
      let memberCardPullForm = new MemberCardPullForm();
      memberCardPullForm.chainId = chainId;
      memberCardPullForm.id = id;
      return memberCardPullForm;
    })
    return this.storeCardInfoMgr.batchPullMemberCardFromChain(storeId,memberCardBatchPullForm);
  }

  /**
   * 取消获取
   * @param id
   * @returns {Promise<boolean>}
   */
  cancelData(id:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let memberCardCancelForm = new MemberCardCancelForm();
    memberCardCancelForm.chainId = chainId;
    memberCardCancelForm.id = id;
    return this.storeCardInfoMgr.cancelChainMemberCard(storeId,memberCardCancelForm);
  }

  /**
   * 批量取消获取
   * @param idArr
   * @returns {Promise<boolean>}
   */
  batchCancelData(idArr:Array<string>):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let memberCardBatchCancelForm = new MemberCardBatchCancelForm();
    memberCardBatchCancelForm.cancelForms = idArr.map((id:string)=>{
      let memberCardCancelForm = new MemberCardCancelForm();
      memberCardCancelForm.chainId = chainId;
      memberCardCancelForm.id = id;
      return memberCardCancelForm;
    })
    return this.storeCardInfoMgr.batchCancelChainMemberCard(storeId,memberCardBatchCancelForm);
  }

}

export class PullMemberCardViewData{
  public chainDataQueryForm:ChainDataQueryForm = new ChainDataQueryForm();
  public list:Array<GenericSelect<MemberCardSyn>> = new Array<GenericSelect<MemberCardSyn>>();
  public allChecked:boolean = false;

  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;
}
