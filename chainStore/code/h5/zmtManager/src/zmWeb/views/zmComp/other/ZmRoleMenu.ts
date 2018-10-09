import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {StoreMenu} from "../../../bsModule/storeMenu/data/StoreMenu";
import {FirstMenu} from "../../../bsModule/storeMenu/data/FirstMenu";
import {SecondMenu} from "../../../bsModule/storeMenu/data/SecondMenu";
import {AppUtils} from "../../../comModule/AppUtils";

@Component({
  selector: 'zm_role_menu',
  template: ` 
      <div class="d-flex">
      <label class="col-md-2 col-form-label text-center px-0"><span class="text-danger">*</span>功能模块</label>
         <div class="align-center  c-input-group mg-l-10">
         
            <div class="col-sm-10 form-control" >
              <div *ngFor="let firstMenu of firstMenuList;let i = index">
                <p>{{firstMenu.name}}</p>
                <span *ngFor="let secondMenu of firstMenu.secondMenuList;let i = index" class="dib" style="width: 32%;margin-bottom: 20px;">
                  <zm_list_checkbox  [(zmValue)]="firstMenu.secondMenuList[i]" (click)="getPermSet()">
                    <content class="mg-l-15 cur-hand">{{secondMenu.name}}</content>
                  </zm_list_checkbox>
                </span>
              </div>
            </div>
        </div>
      </div>
        
            `,
  styles: [`
       
        `]
})

export class ZmRoleMenu implements OnInit {

  @Input() storeMenu: StoreMenu = new StoreMenu();
  @Input() permSet: Array<number> = new Array<number>();
  @Output() callback: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();

  firstMenuList: Array<FirstMenuVD> = new Array<FirstMenuVD>();

  constructor() {
  }


  ngOnInit() {
    if (this.storeMenu && this.storeMenu.firstMenuMap) {
      let firstMenuList = this.storeMenu.getFirstMenuList();
      firstMenuList.forEach((item) => {
        let target = FirstMenuVD.fromFirstMenu(item);
        this.firstMenuList.push(target);
      })
    }

    let targetList = this.getSecondMenuList();
    if (this.permSet && this.permSet.length > 0) {
      targetList.forEach((item) => {
        if (AppUtils.arrayContains(this.permSet, item.perm)) {
          item.checked = true;
        }
      })
    }
  }

  getPermSet() {
    let pemSet = new Array<number>();
    let targetList = this.getSecondMenuList();

    targetList.forEach((secondMenu: SecondMenu) => {
      if (secondMenu.checked) {
        pemSet.push(secondMenu.perm);
      }
    });
    this.callback.emit(pemSet);
  }

  private getSecondMenuList() {
    let targetList = new Array<SecondMenu>();
    this.firstMenuList.forEach((firstMenu: FirstMenuVD) => {
      firstMenu.secondMenuList.forEach((secondMenu: SecondMenu) => {
        targetList = targetList.concat(secondMenu);
      })
    });
    return targetList;
  }
}

class FirstMenuVD {
  name: string;
  secondMenuList: Array<SecondMenu>;

  checked: boolean = false;

  constructor() {
  }

  public static fromFirstMenu(firstMenu: FirstMenu) {
    let target = new FirstMenuVD();
    target.name = firstMenu.name;
    target.secondMenuList = firstMenu.getSecondMenuList();
    return target;
  }
}
