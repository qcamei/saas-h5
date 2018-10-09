import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../../comModule/AppUtils";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {AppRouter} from "../../../../comModule/AppRouter";
import {MembershipCardDetailCacheDataHolder} from "../../../../bsModule/chainCard/MemCardDetailCacheDataHolder";
import {MembershipCardDetail} from "../../../../bsModule/chainCard/data/MembershipCardDetail";
import {Store} from "../../../../bsModule/store/data/Store";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";

@Component({
  template: `
    <view-body-comp [headerArr]="['返回','查看会员卡']">
      
            <zm_table_detail>
              <tbody>
              <tr>
                <th class="bg-th" style="width: 200px">会员卡类名</th>
                <td>{{viewData.memberCardDetail.name}}</td>
              </tr>
              <tr>
                <th class="bg-th">会员卡编号</th>
                <td>{{viewData.memberCardDetail.number}}</td>
              </tr>
              <tr>
                <th class="bg-th">开卡赠送金额</th>
                <td><i class="fa fa-yen mr-1"></i>{{viewData.memberCardDetail.freeMoney|number:'1.2-2'}}</td>
              </tr>
              <tr>
                <th class="bg-th">折扣</th>
                <td>
                <span class="mr-4">商品 {{viewData.memberCardDetail.goodsDiscount|discountPipe}}</span>
                <span class="mr-4">项目 {{viewData.memberCardDetail.prodDiscount|discountPipe}}</span>
                <span class="mr-4">次卡 {{viewData.memberCardDetail.prdCardDiscount|discountPipe}}</span>
                <span class="mr-4">套餐 {{viewData.memberCardDetail.packagePrjDiscount|discountPipe}}</span></td>
              </tr>
              <tr>
                <th class="bg-th">适用门店</th>
                <td>{{viewData.applyStoreName?viewData.applyStoreName:"-"}}</td>
              </tr>
              <tr>
                <th class="bg-th">状态</th>
                <td>{{viewData.memberCardDetail.status | memCardStatePipe}}</td>
              </tr>
              <tr>
                <th class="bg-th">会员卡图片</th>
                <td>
                  <img *ngIf="viewData.memberCardDetail.imgPath" height="168" width="340" src="{{viewData.memberCardDetail.imgPath|imgPrePath}}" />
                </td>
              </tr>
              <tr>
                <th class="bg-th">备注</th>
                <td>{{viewData.memberCardDetail.descript?viewData.memberCardDetail.descript:"-"}}</td>
              </tr>
              </tbody>
            </zm_table_detail>
            <div fxLayout="row" fxLayoutAlign="end" style="width: 100%;margin-top:20px;">
                 <zm_btn_large *ngIf="viewData.memberCardDetail.status == 1" name="编辑"  (zmbtnClick)="goEditPage(viewData.memberCardDetail.id)"></zm_btn_large>
            </div>
  </view-body-comp>
  
       `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MemberCardDetailPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: MemberCardDetailService;
  public viewData: MemberCardDetailViewData;

  constructor(private chainCardViewDataMgr: ChainCardViewDataMgr,
              private membershipCardDetailCacheDataHolder: MembershipCardDetailCacheDataHolder,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new MemberCardDetailService(
      this.chainCardViewDataMgr,
      this.membershipCardDetailCacheDataHolder,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainCardViewDataMgr.subscribeMemberCardDetailVD((viewDataP: MemberCardDetailViewData) => {
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

  goEditPage(memCardDetailId) {
    AppRouter.goEditMemberCard(memCardDetailId)
  }
}


export class MemberCardDetailViewData {
  memberCardDetail: MembershipCardDetail = new MembershipCardDetail();
  applyStoreName: string;
}


class MemberCardDetailService {

  constructor(private chainCardViewDataMgr: ChainCardViewDataMgr,
              private membershipCardDetailCacheDataHolder: MembershipCardDetailCacheDataHolder,
              private storeMgr: StoreMgr) {
  }

  public initViewData(mbCardId: string): void {
    this.chainCardViewDataMgr.setMemberCardDetailViewData(new MemberCardDetailViewData());

    this.buildViewData(mbCardId).then((viewDataTmp: MemberCardDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: MemberCardDetailViewData) {
    this.chainCardViewDataMgr.setMemberCardDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId:string
   * @param mbCardId:string
   * @returns Promise<MemberCardDetailViewData>
   */
  public async buildViewData(mbCardId: string): Promise<MemberCardDetailViewData> {
    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: MemberCardDetailViewData = new MemberCardDetailViewData();
    let membershipCardDetail: MembershipCardDetail = await this.membershipCardDetailCacheDataHolder.getData(mbCardId);
    if (membershipCardDetail) {
      viewDataTmp.memberCardDetail = membershipCardDetail;
    }
    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    let storeList = new Array<Store>();
    if (pageResp) {
      storeList = pageResp.list;
    }
    let ids = viewDataTmp.memberCardDetail.applyStoreIds;
    let storeListTmp = new Array<Store>();
    if (ids) {
      for (let id of ids) {
        storeList.forEach((item) => {
          if (item.id == id) {
            storeListTmp.push(item);
          }
        });
      }
    }
    let arr = new Array<string>();
    arr = storeListTmp.map((item) => {
      return item.name;
    });
    viewDataTmp.applyStoreName = arr.join("、");
    return new Promise<MemberCardDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


}
