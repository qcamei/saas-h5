import {Component, ChangeDetectionStrategy, OnInit, OnDestroy} from "@angular/core";

import {UserPermData} from "../../../comModule/session/SessionData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Router} from "@angular/router";
import {GoodsLeadModal} from "../modal/GoodsLeadModal";
import {setPopup} from "../popup/setPopup";

@Component({
  selector: 'settings',
  templateUrl: 'settings.html',
  styleUrls: ['settings.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPage implements OnInit,OnDestroy {

  constructor() {
  }

  private userPermData: UserPermData = new UserPermData();

  ngOnInit(): void {
    this.userPermData = SessionUtil.getInstance().getUserPermData();
  }

  ngOnDestroy(): void {

  }

  // setLeaguer() {
  //   if (this.userPermData.isLeaguerAdmin) {
  //     this.router.navigate(["/main/settings/setLeaguer"]);
  //   } else {
  //     const activeModal = this.modalService.open(setPopup, {size: 'lg', backdrop: 'static'});
  //     activeModal.componentInstance.btnText = "";
  //     activeModal.componentInstance.confirmBtn = "好的";
  //     activeModal.componentInstance.title = "提示";
  //     activeModal.componentInstance.setContent = "您没有会员管理权限进行此操作，请联系管理员吧。";
  //   }
  // }

}

