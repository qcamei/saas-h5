import {Component, Input, OnInit, Inject} from '@angular/core';
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {MAT_DIALOG_DATA} from "@angular/material";
import {PackageProjectDetail} from "../../../../bsModule/chainPackageProject/data/PackageProjectDetail";
import {PackageProjectType} from "../../../../bsModule/chainPackageProject/data/PackageProjectType";


@Component({
  selector: 'ngxx-modal',
  template: `

<div animation-modal>
      <h2 mat-dialog-title>
         套餐详情
      </h2>
      <mat-dialog-content>
            <zm_table_detail>
              <tbody style="text-align: center">
              <tr>
                <th>套餐名称</th>
                <td>{{packageDetail && packageDetail.name?packageDetail.name:"-"}}</td>
              </tr>
              <tr>
                <th>套餐编号</th>
                <td>{{packageDetail && packageDetail.number?packageDetail.number:"-"}}</td>
              </tr>
              <tr>
                <th>套餐分类</th>
                <td>{{packageDetail && packageDetail.typeId?(packageDetail.typeId |packageTypePipe:packageTypeMap):"-"}}</td>
              </tr>
              <tr>
                <th>售价</th>
                <td><span class="fa fa-yen mg-r-5 fz-12" ></span>{{packageDetail && packageDetail.sellPrice?packageDetail.sellPrice:"-"}}</td>
              </tr>
              <tr>
                <th>成本</th>
                <td><span class="fa fa-yen mg-r-5 fz-12" ></span>{{packageDetail && packageDetail.cost?packageDetail.cost:"-"}}</td>
              </tr>
              <tr>
                <th>状态</th>
                <td>{{packageDetail && packageDetail.state?(packageDetail.state|statePipe):"-"}}</td>
              </tr>
              <tr>
                <th>套餐介绍</th>
                <td class="c-spd-td">{{packageDetail && packageDetail.descript?packageDetail.descript:"-"}}</td>
              </tr>
              </tbody>
            </zm_table_detail>
      
      </mat-dialog-content>
      <mat-dialog-actions fxLayout="row" fxLayoutAlign="end">
            <zm_btn_md  (click)="closeModal()" name="确定"></zm_btn_md>
      </mat-dialog-actions>
</div>


  `,
  styles: [`
  
  
  `],
})
export class PackageDetailModalComponent implements OnInit {

  @Input() packageDetail:PackageProjectDetail;
  @Input() packageTypeMap:ZmMap<PackageProjectType>;

  private activeModal: any;
  constructor( @Inject(MAT_DIALOG_DATA) public dataInput:any) {
    this.activeModal = dataInput.modalCtrl;
  }

  ngOnInit() {
    if (AppUtils.isNullObj(this.packageDetail)) {
      this.packageDetail = new PackageProjectDetail();
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}

