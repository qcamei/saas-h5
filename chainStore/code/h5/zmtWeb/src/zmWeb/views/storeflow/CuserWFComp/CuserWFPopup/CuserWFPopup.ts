import {Component, Input, Output, Inject} from "@angular/core";
import {Leaguer} from "../../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {ZmMap, AppUtils} from "../../../../comModule/AppUtils";
import {AppRouter} from "../../../../comModule/AppRouter";
import {CuserWFCompViewData} from "../CuserWFComp";
import {OutsiderEnum} from "../../../../bsModule/storeLeaguerInfo/data/OutsiderEnum";
import {MAT_DIALOG_DATA} from "@angular/material";
import {RadioItem} from "../../../zmComp/form/ZmInputRadio";

/**
 * 选择会员模态框
 */
@Component({
  selector: 'select-leaguer',
  template: `
      <div mat-dialog-title>
           
          <div>
              <h4 class="my-8 modal-title fz-16 font-bold">选择会员</h4>
              <div fxLayout="row" fxLayoutAlign="space-between center">
                  <zm-search-box [label]=" '会员查询'" class="flex" [placeholder]="'输入会员姓名/手机号'" [(zmValue)]="viewData.queryParam" (callBack)="queryLeaguer()"></zm-search-box>
                  <zm-btn-new *ngIf="fromPage == 2" [name]="'新增会员'" (zmbtnClick)="addLeaguerEv()"></zm-btn-new>
                  <zm-btn-new *ngIf="fromPage == 3" [name]="'新增会员'" (zmbtnClick)="addLeaguerEv()"></zm-btn-new>
              </div>
         </div>
         <div *ngIf="data.showIndividual">
            <div fxLayout="row " fxLayoutAlign="start center">
              <h4 class="my-0 modal-title fz-16 font-bold mr-8">选择散客</h4>
              <zm-input-radio [radioList]="radioList" [(curValue)]="radioValue" (onChange)="selectIndividual()"></zm-input-radio>
            </div>
                
          </div>
      </div>
      <mat-dialog-content fusePerfectScrollbar>
       
        
        <ng-template #theadTemplate>
            <th style="width:30%;" >姓名</th>
            <th style="width:50%;">手机号</th>
        </ng-template>
           
        <ng-template #tbodyTemplate let-item="item" >
           <td style="width:30%;" >{{item.name}}</td>
           <td style="width:50%" >{{item.phone}}</td>
        </ng-template>
        <zm-table-select-single [itemList]="data.leaguerListShow" (onSelected) = "onItemSelected($event)"
        [tbodyTemplate]="tbodyTemplate" [theadTemplate]="theadTemplate" fusePerfectScrollbar></zm-table-select-single>
      </mat-dialog-content>
  `,
  styles: [`
`]
})

export class CuserWFPopup {

  public radioList = [new RadioItem("散客女", 1), new RadioItem("散客男", 0)];
  public radioValue = this.radioList[0];
  private service: CuserWFPopupService;
  public viewData: CuserWFPopupViewData = new CuserWFPopupViewData();
  public itemActiveIndex: number = -1;

  @Input() data: CuserWFPopupViewData;
  @Output() callBack: any;
  fromPage: number;//AddLeaguerFromPageFlag

  private activeModal: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataInput: any) {
    this.activeModal = dataInput.modalCtrl;
    this.fromPage = dataInput.modalData.fromPage;
    this.service = new CuserWFPopupService();
  }


  ngOnInit() {
    if (this.data.defaultNan.checked == true) {
      this.radioValue = this.radioList[1];
    } else if (this.data.defaultNv.checked == true) {
      this.radioValue = this.radioList[0];
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  /**
   * 选择散客
   */
  selectIndividual() {
    let leaguer = null;
    if (this.radioValue.value == OutsiderEnum.Girl) {
      this.data.defaultNv.checked = true;
      this.data.defaultNan.checked = false;
      leaguer = this.data.defaultNv;
    } else {
      this.data.defaultNan.checked = true;
      this.data.defaultNv.checked = false;
      leaguer = this.data.defaultNan;
    }
    this.closeModal();
    this.callBack(leaguer, false);
  }

  addLeaguerEv() {
    AppRouter.goAddLeaguer(this.fromPage);
    this.closeModal();
  }

  /**
   * 查询会员 页面点击事件
   */
  public queryLeaguer() {
    let queryParam = AppUtils.trimBlank(this.viewData.queryParam);
    this.service.queryLeaguer(this.data, queryParam);
  }

  /**
   * 表格组件选中的会员
   * @param leaguer
   */
  onItemSelected(leaguer: Leaguer) {
    this.closeModal();
    this.callBack(leaguer, true);
  }

}

export class CuserWFPopupService {
  constructor() {
  }

  /**
   * 过滤会员
   * @param viewData
   * @param queryParam
   */
  public queryLeaguer(data, queryParam) {
    if (!AppUtils.isNullOrWhiteSpace(queryParam)) {
      let leaguers = data.leaguerMap.values();
      data.leaguerListShow = this.filterLeaguer(leaguers, queryParam);
    } else {
      data.leaguerListShow = data.leaguerData;
    }
  }

  /**根据查询条件过滤会员列表*/
  private filterLeaguer(leaguers: Array<Leaguer>, queryParam: string) {
    let leaguerList: Array<Leaguer> = new Array<Leaguer>();
    leaguerList = leaguers.filter((item) => {
      if ((item.name.indexOf(queryParam) > -1) || (item.phone.indexOf(queryParam) > -1)) {
        return true;
      } else {
        return false;
      }
    });
    return leaguerList;
  }
}

export class CuserWFPopupViewData {
  public leaguerMap: ZmMap<Leaguer>;
  public leaguerData: Array<Leaguer>;//传入数据
  public defaultNan: Leaguer;
  public defaultNv: Leaguer;
  public showIndividual: boolean;//显示散客

  //查询参数
  public queryParam = "";
  //页面显示数据
  public leaguerListShow: Array<Leaguer> = new Array<Leaguer>();

  public static fromParentComp(viewData: CuserWFCompViewData) {
    let selectedCompViewData = new CuserWFPopupViewData();
    selectedCompViewData.leaguerMap = viewData.leaguerMap;
    selectedCompViewData.leaguerData = viewData.leaguerList;
    selectedCompViewData.leaguerListShow = viewData.leaguerList;
    selectedCompViewData.defaultNan = viewData.defaultNan;
    selectedCompViewData.defaultNv = viewData.defaultNv;
    selectedCompViewData.showIndividual = viewData.showIndividual;
    return selectedCompViewData;
  }

}
