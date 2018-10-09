//  <zmbLeaguerSelect [(selectedLeaguer)]="viewData.leaguer"></zmbLeaguerSelect>
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit,
  Output
} from "@angular/core";
import {Leaguer} from "../../../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {AppUtils} from "../../../../../comModule/AppUtils";
import {AppRouter} from "../../../../zmComUtils/AppRouter";
import {TimeSlot} from "../../../../zmComp/form/date/timeSlot/TimeSlot";
import {TimeSlotHelper} from "../../../../zmComp/form/date/timeSlot/TimeSlotHelper";

@Component({
  selector: 'zmbLeaguerSelect',
  template: `
    <div>
      <zm-workFlow-title [title]="'选择客户'" [required]="true" [showBorder]="isLeaguerExist()" (zmWorkFlowClick)="goLeaguerSelectPage()"></zm-workFlow-title>
      <zmbLeaguerInfo *ngIf="isLeaguerExist()" [leaguer]="selectedLeaguer"></zmbLeaguerInfo>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class LeaguerSelectComp implements OnInit, OnDestroy {


  /**
   * selectedLeaguer 双向绑定
   */
  private selectedLeaguerTmp: Leaguer; //选中的客户
  @Output() selectedLeaguerChange = new EventEmitter();

  @Input()
  get selectedLeaguer() {
    return this.selectedLeaguerTmp;
  }

  set selectedLeaguer(val) {
    this.selectedLeaguerTmp = val;
    this.selectedLeaguerChange.emit(this.selectedLeaguerTmp);
  }

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  goLeaguerSelectPage() {
    AppRouter.getInstance().goLeaguerSelect(this.selectedCallback.bind(this));
  }

  selectedCallback(leaguerP: Leaguer) {
    if (!AppUtils.isNullObj(leaguerP)) {
      this.selectedLeaguer = leaguerP;
      this.cdRef.markForCheck();
    }
  }

  isLeaguerExist(): boolean{
    return !AppUtils.isNullObj(this.selectedLeaguerTmp);
  }

}
