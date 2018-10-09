import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 * 采用onPush刷新策略的页面调用该组件 必须在页面手动调用markForCheck()触发刷新后组件默认选中值才会生效 （ion-segment组件问题）
 * <zm-input-gender [(zmValue)]="viewData.addForm.sex"></zm-input-gender>
 */
@Component({
  selector:'zm-input-gender',
  template: `
              <!--<ion-list radio-group [(ngModel)]="zmValue">-->
                  <!--<ion-item>-->
                      <!--<ion-label>男</ion-label>-->
                      <!--<ion-radio [value]="1"></ion-radio>-->
                  <!--</ion-item>-->
                  <!--<ion-item>-->
                      <!--<ion-label>女</ion-label>-->
                      <!--<ion-radio [value]="2"></ion-radio>-->
                  <!--</ion-item>-->
              <!--</ion-list>-->
              
              
              <div w-100 fxLayout="row" fxLayoutAlign="space-between center">
                  <div >
                    性别<span style="color:red;">*</span>
                  </div>
                  <div style="width:100px;">
                    <ion-segment ion-text [(ngModel)]="zmValue" (ionChange)="select($event)" color="primary">
                      <ion-segment-button class="segment-button" [value]="1">
                        男
                      </ion-segment-button>
                      <ion-segment-button class="segment-button" [value]="2">
                        女
                      </ion-segment-button>
                    </ion-segment>
                  
                  </div>
                  
              </div>  
              
              <!--<select [(ngModel)]="zmValue">-->
                     <!--<option [value]="1">男</option>-->
                     <!--<option [value]="2">女</option>-->
                  <!--</select>-->
                <!--<div class="disFlex align-center">-->
                  <!--<label class="c-input-label">性别</label>-->
                  <!--<zm-input-radio  [radioList]="genderList" [(curValue)]="zmValue"></zm-input-radio>-->
                <!--</div>-->
                <!--<div class="c-input-error">-->
                <!--</div>-->
            `,
  styles:[`
.segment-button{
    height:2rem !important;
    line-height: 2rem !important;
}
`]
})

export class ZmInputGender{

  /**
   * zmValue 双向绑定
   */
  private zmValueTmp:any;
  @Output() zmValueChange = new EventEmitter();
  @Output() onChange = new EventEmitter();

  @Input()
  get zmValue():any {
    return this.zmValueTmp;
  }
  set zmValue(val:any) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);
  }

  select(event){
    this.zmValue = event.value;
    this.onChange.emit();
  }



/****************************组件生命周期*************************************/
  // constructor(){
  //   console.log("constructor==========chird")
  // }
  //
  // ngOnChanges(changes): void {
  //   console.log("ngOnchanges==========chird")
  // }
  //
  // ngOninit(){
  //   console.log("ngOninit==========chird")
  // }
  //
  // ngDoCheck(){
  //   console.log("ngDoCheck==========chird")
  // }
  //
  // ngAfterContentInit(){
  //   console.log("ngAfterContentInit==========chird")
  // }
  //
  // ngAfterContentChecked(){
  //   console.log("ngAfterContentChecked==========chird")
  // }
  //
  // ngAfterViewInit(){
  //   console.log("ngAfterViewInit==========chird")
  // }
  //
  // ngAfterViewChecked(){
  //   console.log("ngAfterViewChecked==========chird")
  // }
  //
  // ngDoDestory(){
  //   console.log("ngDoDestory==========chird")
  // }

}


