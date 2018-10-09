import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit,
  Output
} from "@angular/core";
import {AppUtils} from "../../../../../comModule/AppUtils";
import {OpenWFItem} from "../openWFItem/OpenWFItem";

@Component({
  selector: 'zmbDataSelect',
  template: `
    <div>
      <zm-workFlow-title [title]="title" [required]="true" [showBorder]="isDataExit()" (zmWorkFlowClick)="goDataSelectListPage()"></zm-workFlow-title>
      <div *ngIf="isDataExit()">
      <!--<zmbBuser *ngFor="dataTmp" [dataTmp]="dataTmp"></zmbBuser>-->
      </div>
    </div>
  `
})


export class ZmbOpenWFSelectComp implements OnInit, OnDestroy {


  /**
   * data 双向绑定
   */
  private dataTmp: Array<OpenWFItem>; //选中的dataTmp
  @Input() title: string = "";
  @Output() dataChange = new EventEmitter();

  @Input()
  get data() {
    return this.dataTmp;
  }

  set data(val) {
    this.dataTmp = val;
    this.dataChange.emit(this.data);
  }

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  isNullDefaultAddress() {
  }

  goDataSelectListPage() {
    // AppRouter.getInstance().goAddressSelectListPage(this.selectedCallback.bind(this));
  }

  isDataExit(): boolean{
    return !AppUtils.isEmpty(this.data);
  }

}
