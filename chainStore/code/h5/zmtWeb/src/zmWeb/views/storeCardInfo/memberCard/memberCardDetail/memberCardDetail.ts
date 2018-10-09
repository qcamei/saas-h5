import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../../comModule/AppUtils";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";
import {MembershipCardDetail} from "../../../../bsModule/MembershipCardDetail/data/MembershipCardDetail";
import {MembershipCardDetailCacheDataHolder} from "../../../../bsModule/MembershipCardDetail/MemCardDetailCacheDataHolder";
import {AppRouter} from "../../../../comModule/AppRouter";

@Component({
  template: `
    <view-body-comp [headerArr]="['返回','查看会员卡']">
      
            <zm-table-detail>
              <tbody>
              <tr>
                <th>会员卡类名</th>
                <td>{{viewData.memberCardDetail.name}}</td>
              </tr>
              <tr>
                <th>会员卡编号</th>
                <td>{{viewData.memberCardDetail.number}}</td>
              </tr>
              <tr>
                <th>开卡赠送金额</th>
                <td><i class="fa fa-yen mr-1"></i>{{viewData.memberCardDetail.freeMoney|number:'1.2-2'}}</td>
              </tr>
              <tr>
                <th>折扣</th>
                <td>
                <span class="mr-8">商品{{viewData.memberCardDetail.goodsDiscount|discountPipe}}</span>
                <span class="mr-8">项目{{viewData.memberCardDetail.prodDiscount|discountPipe}}</span>
                <span class="mr-8">次卡{{viewData.memberCardDetail.prdCardDiscount|discountPipe}}</span>
                <span class="mr-8">套餐{{viewData.memberCardDetail.packagePrjDiscount|discountPipe}}</span></td>
              </tr>
              <tr>
                <th>状态</th>
                <td>{{viewData.memberCardDetail.status | memCardStatePipe}}</td>
              </tr>
              <tr>
                <th>会员卡图片</th>
                <td>
                  <img *ngIf="viewData.memberCardDetail.imgPath" height="168" width="340" src="{{viewData.memberCardDetail.imgPath|imgPrePath}}" />
                </td>
              </tr>
              <tr>
                <th>备注</th>
                <td>{{viewData.memberCardDetail.descript?viewData.memberCardDetail.descript:"-"}}</td>
              </tr>
              </tbody>
            </zm-table-detail>
            <div fxLayout="row" fxLayoutAlign="end" style="width: 100%;margin-top:20px;">
                 <zm-btn-large *ngIf="viewData.memberCardDetail.origin==0 && viewData.memberCardDetail.status == 2" name="编辑"  (zmbtnClick)="goEditPage(viewData.memberCardDetail.id)"></zm-btn-large>
            </div>
  </view-body-comp>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MemberCardDetailPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: MemberCardDetailService;
  public viewData: MemberCardDetailViewData;

  constructor(
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private membershipCardDetailCacheDataHolder:MembershipCardDetailCacheDataHolder,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new MemberCardDetailService(this.storeCardInfoViewDataMgr,this.membershipCardDetailCacheDataHolder);
  }

  ngOnInit() {
    this.viewDataSub = this.storeCardInfoViewDataMgr.subscribeMemberCardDetailVD((viewDataP: MemberCardDetailViewData) => {
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

  goEditPage(memCardDetailId){
    AppRouter.goEditMemberCard(memCardDetailId)
  }
}


export class MemberCardDetailViewData {
  memberCardDetail: MembershipCardDetail = new MembershipCardDetail();

}


class MemberCardDetailService {

  constructor(
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private membershipCardDetailCacheDataHolder:MembershipCardDetailCacheDataHolder) {
  }

  public initViewData(mbCardId: string): void {
    this.storeCardInfoViewDataMgr.setMemberCardDetailViewData(new MemberCardDetailViewData());

    this.buildViewData(mbCardId).then((viewDataTmp: MemberCardDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: MemberCardDetailViewData) {
    this.storeCardInfoViewDataMgr.setMemberCardDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId:string
   * @param mbCardId:string
   * @returns Promise<MemberCardDetailViewData>
   */
  public async buildViewData(mbCardId: string): Promise<MemberCardDetailViewData> {
    let viewDataTmp: MemberCardDetailViewData = new MemberCardDetailViewData();
    let membershipCardDetail: MembershipCardDetail = await this.membershipCardDetailCacheDataHolder.getData(mbCardId);
    if (membershipCardDetail) {
      viewDataTmp.memberCardDetail = membershipCardDetail;
    }
    return new Promise<MemberCardDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


}
