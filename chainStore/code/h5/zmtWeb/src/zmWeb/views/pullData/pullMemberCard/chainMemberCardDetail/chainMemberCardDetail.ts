import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../../comModule/AppUtils";
import {PullDataViewDataMgr} from "../../pullViewDataMgr";
import {ChainCardMgr} from "../../../../bsModule/chainCard/ChainCardMgr";
import {MembershipCardDetail} from "../../../../bsModule/chainCard/data/MembershipCardDetail";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";

@Component({
  template: `
    <view-body-comp [headerArr]="['总店数据','会员卡','查看详情']">
        <div style="width:50%;">
            <zm-table-detail>
              <tbody>
              <tr>
                <th class="bg-th">会员卡类名</th>
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
                <span class="mr-2">商品 {{viewData.memberCardDetail.goodsDiscount|discountPipe}}</span>
                <span class="mr-2">项目 {{viewData.memberCardDetail.prodDiscount|discountPipe}}</span>
                <span class="mr-2">次卡 {{viewData.memberCardDetail.prdCardDiscount|discountPipe}}</span>
                <span class="mr-2">套餐 {{viewData.memberCardDetail.packagePrjDiscount|discountPipe}}</span></td>
              </tr>
              <tr>
                <th class="bg-th">状态</th>
                <td>{{viewData.memberCardDetail.status==1?'启用':'停用'}}</td>
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
            </zm-table-detail>
        </div>
  </view-body-comp>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChainMemberCardDetailPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: ChainMemberCardDetailService;
  public viewData: ChainMemberCardDetailViewData;

  constructor(private chainCardMgr:ChainCardMgr,
              private pullDataViewDataMgr: PullDataViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
              this.service = new ChainMemberCardDetailService(this.chainCardMgr,this.pullDataViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.pullDataViewDataMgr.subscribeMemberCardDetailVD((viewDataP: ChainMemberCardDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.service.initViewData(id);
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

}

class ChainMemberCardDetailService {

  constructor(private chainCardMgr:ChainCardMgr,
              private pullDataViewDataMgr: PullDataViewDataMgr,) {}

  public initViewData(mbCardId: string): void {
    this.pullDataViewDataMgr.setMemberCardDetailViewData(new ChainMemberCardDetailViewData());

    this.buildViewData(mbCardId).then((viewDataTmp: ChainMemberCardDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: ChainMemberCardDetailViewData) {
    this.pullDataViewDataMgr.setMemberCardDetailViewData(viewDataP);
  }

  public async buildViewData(mbCardId: string): Promise<ChainMemberCardDetailViewData> {
    let viewDataTmp: ChainMemberCardDetailViewData = new ChainMemberCardDetailViewData();
    let chainId = SessionUtil.getInstance().getChainId();
    let membershipCardDetail: MembershipCardDetail = await this.chainCardMgr.findMemberCardDetail(mbCardId,chainId);
    if (membershipCardDetail) {
      viewDataTmp.memberCardDetail = membershipCardDetail;
    }
    return new Promise<ChainMemberCardDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

}

export class ChainMemberCardDetailViewData {
  memberCardDetail: MembershipCardDetail = new MembershipCardDetail();

}
