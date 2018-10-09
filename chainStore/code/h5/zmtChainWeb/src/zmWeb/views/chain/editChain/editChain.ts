import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {ChainViewDataMgr} from "../ChainViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {MainViewDataMgr} from "../../main/MainViewDataMgr";
import {PermService} from "../../permService";
import {ActivatedRoute} from "@angular/router";
import {Chain} from "../../../bsModule/chain/data/Chain";
import {ChainUpdateInfoForm} from "../../../bsModule/chain/apiData/ChainUpdateInfoForm";

/**
 * 店铺管理首页 编辑店铺
 */
@Component({
  selector: 'edit-chain',
  templateUrl: 'editChain.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditChainPage implements OnInit,OnDestroy {

  private viewDataSub: any;
  private paramsSub: any;
  private service: EditChainService;
  public viewData: EditChainViewData;

  constructor(private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private permService: PermService,
              private chainViewDataMgr: ChainViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private route: ActivatedRoute) {
    this.service = new EditChainService(this.chainMgr, this.chainSynDataHolder, this.chainViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chainViewDataMgr.subscribeEditChainVD((viewDataP: EditChainViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let chainId = params['chainId'];
      this.service.initViewData(chainId);
    });
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
    this.paramsSub.unsubscribe();
  }

  public async updateChainInfo() {
    let updateData: ChainUpdateInfoForm = this.buildUpdateData();
    let checkSucess = this.checkForm(updateData);

    if (checkSucess) {
      let success = await this.service.updateChainInfo(updateData);
      if (success) {
        await this.permService.refreshPermData();
        AppUtils.showSuccess("提示", "修改成功");
        MainViewDataMgr.getInstance().notifyDataChanged();
        AppRouter.goChainList();
      } else {
        AppUtils.showError("提示", "修改失败");
      }
    }

  }

  private buildUpdateData() {
    let updateData: ChainUpdateInfoForm = new ChainUpdateInfoForm();
    AppUtils.copy(updateData, this.viewData.chain);
    updateData.chainId = this.viewData.chain.id;
    updateData.area = this.viewData.citySetting.join("/");
    return updateData;
  }

  private checkForm(updateData: ChainUpdateInfoForm): boolean {
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(updateData.name)
      || AppUtils.isNullOrWhiteSpace(updateData.contactNumber)
      || AppUtils.isNullObj(this.viewData.citySetting)
      || AppUtils.isNullObj(updateData.contacts)) {
      AppUtils.showWarn("提示", "必填项未填写");
      checkSuccess = false;
    }
    return checkSuccess;
  }

}

export class EditChainService {
  constructor(private chainMgr: ChainMgr,
              private chainSynDataHolder: ChainSynDataHolder,
              private chainViewDataMgr: ChainViewDataMgr) {
  }

  public initViewData(chainId): void {
    this.chainViewDataMgr.setEditChainViewData(new EditChainViewData());

    this.buildViewData(chainId, (viewDataP: EditChainViewData) => {
      this.handleViewData(viewDataP);
    })
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP) {
    this.chainViewDataMgr.setEditChainViewData(viewDataP);
  }

  /**
   * 请求店铺信息 组装viewData数据
   * @param chainId
   * @param callbackP
   */
  public buildViewData(chainId, callbackP: (viewDataP: EditChainViewData) => void) {
    let viewDataTmp = new EditChainViewData();

    this.chainSynDataHolder.getData(chainId).then(function (chain) {
      if (!AppUtils.isNullObj(chain)) {
        viewDataTmp.chain = chain;
        viewDataTmp.citySetting = chain.area.split("/");
        callbackP(viewDataTmp);
      } else {
        AppUtils.showError("提示", "加载失败");
      }
    });
  }

  /**
   * 修改店铺信息
   * @param updateData
   */
  public updateChainInfo(updateData: ChainUpdateInfoForm): Promise<boolean> {
    return this.chainMgr.updateChainInfo(updateData);
  }

}

export class EditChainViewData {
  public chain: Chain = new Chain();
  public citySetting: string[] = [];
}
