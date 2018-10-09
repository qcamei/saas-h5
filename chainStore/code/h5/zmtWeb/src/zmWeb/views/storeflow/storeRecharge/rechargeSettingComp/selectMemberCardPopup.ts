
import {Component, Input, Output, Inject} from '@angular/core';
import {MembershipCard} from "../../../../bsModule/storeCardInfo/data/MembershipCard";
import {RechargeSettingViewData} from "./rechargeSettingViewData";
import {AppUtils} from "../../../../comModule/AppUtils";
import {MAT_DIALOG_DATA} from "@angular/material";


/**
 * 设置会员卡模态框
 */
@Component({
  selector:'',
  template:
    `    
    <div animation-modal>
        <div mat-dialog-title>
          <span class="font-bold fz-16">设置会员卡</span>
        </div>
        <div mat-dialog-content>
              
               <ng-template #theadTemplate>
                  <th style="width:15%;">编号</th>
                  <th style="width:15%;">会员卡类名</th>
                  <th style="width:15%;">赠送金额</th>
                  <th style="width:11%;">项目折扣</th>
                  <th style="width:11%;">商品折扣</th>
                  <th style="width:11%;">次卡折扣</th>
                  <th style="width:11%;">套餐折扣</th>
               </ng-template>
              
               <ng-template #tbodyTemplate let-item="item">
                  <td style="width:16%;">{{item.number}}</td>
                  <td style="width:16%;">{{item.name}}</td>
                  <td style="width:16%;"><i class="fa fa-yen mg-r-5"></i>{{item.freeMoney | number:'1.2-2'}}</td>
                  <td style="width:11%;">{{item.prodDiscount|discountPipe}}</td>
                  <td style="width:11%;">{{item.goodsDiscount|discountPipe}}</td>
                  <td style="width:11%;">{{item.prdCardDiscount|discountPipe}}</td>
                  <td style="width:11%;">{{item.packagePrjDiscount|discountPipe}}</td>
               </ng-template>
              
               <zm-table-select-single [itemList]="data.memberCardList" (onSelected) = "onItemSelected($event)" [theadTemplate]="theadTemplate" [tbodyTemplate]="tbodyTemplate"  >
                  
               </zm-table-select-single>
        </div>
    </div>
     
  `,
  styles:[`

  `]
})
export class SelectMemberCardPopup{

  @Input() data:SelectMemberCardPopupViewData;
  @Output() action:any;
  itemActiveIndex:number = -1;

  private activeModal: any;
  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any){
    this.activeModal = dataInput.modalCtrl;
  }

  /**
   * 页面点击事件 关闭弹窗
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * 表格组件选中事件
   * @param membershipCardP
   */
  onItemSelected(membershipCardP:MembershipCard){
    if(!AppUtils.isNullObj(this.data.memberCard) && membershipCardP.id == this.data.memberCard.id){
      AppUtils.showWarn("提示","当前会员已设置该会员卡类型");
    }else{
      this.action(membershipCardP);
      this.activeModal.close();
    }
  }

  /*
 * 鼠标hover事件
 */
  itemActiveHover(index):void{
    this.itemActiveIndex = index;
  }

}

export class SelectMemberCardPopupViewData{
  public memberCardList:Array<MembershipCard>; //会员卡卡类型列表
  public memberCard:MembershipCard; //选择的会员卡种类

  public static fromComp(rechargeSettingViewData:RechargeSettingViewData):SelectMemberCardPopupViewData{
    let selectMemberCardPopupViewData = new SelectMemberCardPopupViewData();
    selectMemberCardPopupViewData.memberCardList = rechargeSettingViewData.memberCardList;
    selectMemberCardPopupViewData.memberCard = rechargeSettingViewData.memberCard;
    return selectMemberCardPopupViewData;
  }
}
