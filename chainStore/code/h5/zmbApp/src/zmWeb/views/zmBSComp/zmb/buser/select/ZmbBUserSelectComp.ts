import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit,
  Output
} from "@angular/core";
import {AppRouter} from "../../../../zmComUtils/AppRouter";
import {AppUtils} from "../../../../../comModule/AppUtils";
import {BUser} from "../../../../../bsModule/buser/data/BUser";

@Component({
  selector: 'zmbBUserSelect',
  template: `
    <div>
      <zm-workFlow-title [title]="'选择跟进人员'" [required]="true" [showBorder]="isBUserExit()" (zmWorkFlowClick)="goBuserSelectPage()"></zm-workFlow-title>
      <zmbBuser *ngIf="isBUserExit()" [buser]="buser"></zmbBuser>
    </div>
  `
})


export class ZmbBUserSelectComp implements OnInit, OnDestroy {


  /**
   * selectedBUser 双向绑定
   */
  private buser: BUser; //选中的buser
  @Output() selectedBUserChange = new EventEmitter();

  @Input()
  get selectedBUser() {
    return this.buser;
  }

  set selectedBUser(val) {
    this.buser = val;
    this.selectedBUserChange.emit(this.selectedBUser);
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  isNullDefaultAddress() {
  }

  goBuserSelectPage() {
    AppRouter.getInstance().goBuserSelect(this.selectedBUserCb.bind(this));
  }

  selectedBUserCb(buserP: BUser) {
    if (!AppUtils.isNullObj(buserP)) {
      this.selectedBUser = buserP;
    }
  }

  isBUserExit(): boolean{
    return !AppUtils.isNullObj(this.selectedBUser);
  }

}
