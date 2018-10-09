import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {HomeViewDataMgr} from "../HomeViewDataMgr";
import {UserPermData} from "../../../comModule/session/SessionData";
import {AppRouter} from "../../../comModule/AppRouter";

/**
 * 首页
 */
@Component({
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomePage implements OnInit,OnDestroy {

  private service: HomeService;
  public viewData: HomeViewData;


  constructor(private cdRef: ChangeDetectorRef) {
    this.service = new HomeService();
  }

  private isInited: boolean = false;

  ngOnInit(): void {

    HomeViewDataMgr.getInstance().onDataChanged(new HomeViewData(), (viewDataTmp: HomeViewData) => {
      this.viewData = viewDataTmp;
      this.cdRef.markForCheck();
    });
    //切换店铺刷新首页
    HomeViewDataMgr.getInstance().onInformDataChanged(() => {
      this.service.initViewData();
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if (this.isInited) {
      HomeViewDataMgr.getInstance().onViewDestroy();
    }
  }

  goLibraryList() {
    if (this.viewData.buserPermData.isSellProductAdmin) {
      AppRouter.goLibraryList();
    }else {
      AppUtils.showWarn("提示", "抱歉,您没有该权限");
    }
  }

  goClerkManage() {
    if (this.viewData.buserPermData.isChainClerkAdmin) {
      AppRouter.goFindClerk();
    } else {
      AppUtils.showWarn("提示", "抱歉,您没有该权限");
    }

  }

  goStoreManage() {
    if (this.viewData.buserPermData.isChainAdmin) {
      AppRouter.goChainList();
    } else {
      AppUtils.showWarn("提示", "抱歉,您没有该权限");
    }
  }

  goMemCardManage() {
    if (this.viewData.buserPermData.isCardAdmin) {
      AppRouter.goMemberCardList();
    } else {
      AppUtils.showWarn("提示", "抱歉,您没有该权限");
    }
  }

}

export class HomeViewData {
  chainId: string;
  buserPermData: UserPermData = new UserPermData();
  list: Array<any> = new Array();
}

export class HomeService {
  constructor() {
  }


  public initViewData() {

    let viewDataTmp = new HomeViewData();
    let chainId = SessionUtil.getInstance().getChainId();
    if (!AppUtils.isNullObj(chainId)) {
      viewDataTmp.chainId = chainId;
      viewDataTmp.buserPermData = SessionUtil.getInstance().getUserPermData();
      //页面没数据状态
      HomeViewDataMgr.getInstance().setHomeViewData(viewDataTmp);
    }

  }
}

