import { Component,Input,} from "@angular/core";
// 2018.3.2
// <view-Figure [loadingFinish]="viewData.loadingFinish" [dataBank]="viewData.prdInfoListShow" [FigureImg]="'noData'"></view-Figure>-->
@Component({
  selector:'view-Figure',
  template:
    `
    <div *ngIf="loadingFinish && dataBank.length == 0" class="text-center disFlex hor-center align-center"
         style="border: 1px solid #e9ecef;border-top: none;height: calc(100vh - 350px);">
      <div style="">
        <img src="assets/images/{{FigureImg}}.png" height="220" width="220"/>
        <h4 class="font-bold fz-18">没有数据</h4>
      </div>
    </div>
   `
})
export class ViewFigure{
  @Input() loadingFinish;
  @Input() dataBank;
  @Input() FigureImg;
  constructor(){}

}
