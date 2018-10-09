import {Component, Inject, Input, Output} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";
import {FollowClerk} from "../../addIncomPay/AddIncomePay";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {ClerkInfo} from "../../../../bsModule/storeClerkInfo/data/ClerkInfo";


/**
 * 选择跟进人员 模态框
 */
@Component({
  selector: 'select-followClerk',
  template: `
    <div>
      <div mat-dialog-title>
        <h4 class="modal-title fz-16 font-bold">选择跟进人员</h4>
      </div>
      <mat-dialog-content fusePerfectScrollbar>
        <div class="disFlex">
          <div class="flex">
            <zm-search-box [label]=" '跟进人员查询'" [placeholder]="'请输入姓名/手机号'" [(zmValue)]="viewData.queryParam"
                           (callBack)="queryFollowClerk()"></zm-search-box>
          </div>
        </div>

        <ng-template #theadTemplate>
          <th style="width:30%">姓名</th>
          <th style="width:50%">手机号</th>
        </ng-template>

        <ng-template #tbodyTemplate let-item="item">
          <td style="width:30%;">{{item.name}}</td>
          <td style="width:50%">{{item.phone}}</td>
        </ng-template>
        <zm-table-select-single [itemList]="viewData.clerkListShow" (onSelected)="onItemSelected($event)"
                                [tbodyTemplate]="tbodyTemplate" [theadTemplate]="theadTemplate">
        </zm-table-select-single>
      </mat-dialog-content>
    </div>
  `,
  styles: [`
  `]
})

export class IncomePayBuserPopup {
  private service: IncomePayUserPopupService;
  public viewData: IncomePayUserPopupViewData = new IncomePayUserPopupViewData();
  itemActiveIndex: number;

  @Input() clerkMap: ZmMap<FollowClerk>;
  @Input() clerkListShow: Array<FollowClerk>;
  @Output() callBack: (clerk) => FollowClerk;

  private activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataInput: any,) {
    this.activeModal = dataInput.modalCtrl;
    this.service = new IncomePayUserPopupService();
  }

  ngOnInit(): void {
    this.viewData.clerkListShow = this.clerkListShow;
    this.viewData.clerkMap = this.clerkMap;
  }


  closeModal() {
    this.activeModal.close();
  }

  /**
   * 查询跟进人员 页面点击事件
   */
  queryFollowClerk() {
    let queryParam = AppUtils.trimBlank(this.viewData.queryParam);
    this.service.queryClerk(this.viewData, queryParam);
  }

  /**
   * 表格组件选中的跟进人员
   * @param clerk
   */
  onItemSelected(clerk: FollowClerk) {
    this.callBack(clerk);
    this.closeModal();
  }

  /**
   * 选择跟进人员 点击事件
   * @param clerkId
   */
  selectFollowClerk(clerkId) {
    let selectClerk = this.clerkMap.get(clerkId);
    // this.viewData.queryParam = selectClerk.name;
    //输出选中的会员
    this.callBack(selectClerk);
    this.closeModal();
  }

  /*
    * 鼠标hover事件
    */
  itemActiveHover(index): void {
    this.itemActiveIndex = index;
  }

}

export class IncomePayUserPopupService {
  constructor() {
  }

  /**
   * 过滤跟进人员
   * @param data
   * @param queryParam
   */
  public queryClerk(data, queryParam) {
    if (!AppUtils.isNullOrWhiteSpace(queryParam)) {
      let clerks = data.clerkMap.values();
      data.clerkListShow = this.filterClerk(clerks, queryParam);
    } else {
      data.clerkListShow = data.clerkMap.values();
    }
  }

  private filterClerk(clerks: Array<FollowClerk>, queryParam) {
    let clerkList: Array<FollowClerk> = new Array<FollowClerk>();
    clerkList = clerks.filter((item) => {
      if ((item.name.indexOf(queryParam) > -1) || (item.phone.indexOf(queryParam) > -1)) {
        return true;
      } else {
        return false;
      }
    });
    return clerkList;
  }
}

export class IncomePayUserPopupViewData {
  public clerkMap: ZmMap<FollowClerk>;
  //查询参数
  public queryParam = "";
  //页面显示数据
  public clerkListShow: Array<FollowClerk> = new Array<FollowClerk>();

  constructor() {
  }

}
