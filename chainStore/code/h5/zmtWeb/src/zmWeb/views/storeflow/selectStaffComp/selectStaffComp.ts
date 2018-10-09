import {Component, OnInit, OnDestroy, Inject} from "@angular/core";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BonusTypeEnum} from "../../../bsModule/workFlow/data/BonusTypeEnum";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {MAT_DIALOG_DATA} from "@angular/material";
/**
 * 选择服务人员公共组件 与开单收银流程无关组件
 */
@Component({
  selector:'select-staff-comp',
    template:
  `    
    
     <div animation-modal>
            <h2 mat-dialog-title>
               设置服务人员提成
            </h2>
            <mat-dialog-content fusePerfectScrollbar>
            
                 <zm-search-box [label]=" '员工查询'" [placeholder]="'请输入员工姓名'" [(zmValue)]="viewData.queryParam" (callBack)="findStaff()"></zm-search-box>
                 <div  fxLayout="row wrap" fxLayoutAlign="start center"  class="zmFullWidth">
			   
                      <div fxFlex="1 1 38%"  fxFlexAlign="start">
                                 <ng-template #theadTemplate>
                                    <th style="width:auto">员工姓名</th>
                                    <th style="width:40%;">岗位</th>
                                 </ng-template>
                                 
                                 <ng-template #tbodyTemplate let-item="item">
                                      <td style="width:auto">{{item.name}}</td>
                                      <td style="width:40%;">{{item.roleName}}</td>
                                 </ng-template> 
                        
                                 <zm-table-select-single [itemList]=" viewData.staffList" (onSelected) = "selectStaff($event)"  [tbodyTemplate]="tbodyTemplate"  [theadTemplate]="theadTemplate" ></zm-table-select-single>
                      </div>
                      <div fxFlex="1 1 auto" style="text-align: center"><img src="assets/images/direction.png" alt=""/></div>
                      <div fxFlex="1 1 58%" >
                               <zm-table>
                                  <thead>
                                    <th style="width:10%;">序号</th>
                                    <th style="width:15%;">员工姓名</th>
                                    <th style="width:20%;">业绩金额</th>
                                    <th style="width:15%;">提成类型</th>
                                    <th style="width:15%;">提成比例</th>
                                    <th style="width:15%;">提成金额</th>
                                    <th style="width:10%;">操作</th>
                                  </thead>
                                  <tbody style="height:400px;overflow: auto;">
                                    <tr *ngFor="let item of viewData.selectStaffList;let i=index;">
                                      <td  style="width:10%;text-align: center">{{i+1}}</td>
                                      <td style="width:15%;text-align: center">{{item.name}}</td>
                                      <td style="width:20%;">
                                        <div class="w-100-p" style="position:relative;">
                                          <i class="fa fa-pencil " style="position:absolute;left:0;top:0;color:#4678fa;"></i>
                                          <input type="number" placeholder="点击输入"  oninput="if(value.length>8)value=value.slice(0,8)"  style="width:90px;border:none;" class="pl-12 text-center" [(ngModel)]="item.amount" (change)="changeAmount($event,item)">
                                        </div>
                                      </td>
                                      <td style="width:15%;">
                                      
                                        <select class="c-modal-se" style="padding:0;" [(ngModel)]="item.bonusType" (ngModelChange)="changeBonuseType($event,item)">
                                          <option [value]="0">固定提成</option>
                                          <option [value]="1">比例提成</option>
                                        </select>
                                      </td>
                                      <td style="width:15%;">
                                        <div>              
                                          <div *ngIf="item.bonusType ==1" style="position:relative;">
                                            <i class="fa fa-pencil" style="position:absolute;left:0;top:0;color:#4678fa;top:0;"></i>
                                            <input type="number" autofocus  oninput="if(value<0 || value>100){value=null} else {value=value.slice(0,4)}" style="width:40px;border:none;" class="pl-12  text-center" [(ngModel)]="item.percentage" (change)="changePercente($event,item)">
                                            <span style="margin-top:2px">%</span>
                                          </div>
                                          <div *ngIf="item.bonusType ==0" class="pd-r-20 pd-l-20" style="width: 100%; text-align: center">-</div>
                                        </div>
                                      </td>
                                      <td style="width:15%;">
                                          <div class="w-100-p" *ngIf="item.bonusType == 0" style="position:relative;" >
                                            <i class="fa fa-pencil " style="position:absolute;left:0;top:0;color:#4678fa;top:0;"></i>
                                            <input type="number" [min]="0" style="width:70px;border:none;text-align: center" class="pl-12 text-center" [(ngModel)]="item.cost" (change)="changeCost($event,item)">
                                          </div>
                                          <div *ngIf="item.bonusType ==1" class="pd-r-10 pd-l-10" style="width: 100%; text-align: center">{{item.cost}}</div>
                                    </td>
                                      <td style="width:10%;color:#4678fa;cursor:pointer;text-align: center"(click)="deleteItem(i)">删除</td>
                                    </tr>
                                    <div *ngIf="viewData.selectStaffList.length == 0" style="margin-top:175px;text-align: center">请在左边选择服务人员添加</div>  
                                  </tbody>
                                </zm-table>
                      </div>
                </div>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                <zm-btn-md [stroked]="true" (click)="closeModal()" name="取消"></zm-btn-md>
                <zm-btn-md [stroked]="false" (click)="confirm()" name="确定"></zm-btn-md>
            </mat-dialog-actions>
      </div>
    
  `,
})

export class SelectStaffComp implements OnInit,OnDestroy{
  private service: SelectStaffCompService;
  public viewData: SelectStaffCompViewData = new SelectStaffCompViewData();
  itemActiveIndex:number;
  data:Array<StaffData>;
  amount:number;//业绩金额
  action:any;
  editPercent:boolean = false;

  private activeModal: any;
  constructor(private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              @Inject(MAT_DIALOG_DATA) public dataInput:any){
    this.activeModal = dataInput.modalCtrl;

    this.service = new SelectStaffCompService(this.storeClerkInfoSynDataHolder,this.buserMgr);

  }

  ngOnInit(): void {
    this.service.initViewData((viewData:SelectStaffCompViewData) => {
      if(viewData){
        this.viewData = viewData;
        if(this.data && this.data instanceof Array){
          for(let i=0;i<this.data.length;i++){
            let staffData = this.data[i];
            this.viewData.selectStaffList.push(staffData);
            this.viewData.selectStaffMap.put(staffData.id,staffData);
          }
          //业绩金额
          if(this.amount){
            this.viewData.staffList.forEach((item)=>{
              item.amount = this.amount;
            });
            this.viewData.selectStaffList.forEach((item)=>{
              item.amount = this.amount;
            })
          }
        }
      }
    });
  }

  ngOnDestroy(): void {

  }

  closeModal() {
    this.activeModal.close();
  }

  confirm():void{
    this.action(this.viewData.selectStaffList);
    this.closeModal();
  }

  /**
   * 页面点击事件 根据名称过滤服务人员
   */
  findStaff(){
    let queryParam = AppUtils.trimBlank(this.viewData.queryParam);
    this.viewData.staffList = this.viewData.staffDataList.filter((item) => {
      if(item.name.indexOf(queryParam) > -1){
        return true;
      }else{
        return false;
      }
    })
  }

  /**
   * 选择服务人员hover
   * @param item
   */
  itemActiveHover(index) {
    this.itemActiveIndex = index;
  }
  /**
   * 选择服务人员
   * @param item
   */
  selectStaff(item:StaffData){
    if(this.viewData.selectStaffMap.contains(item.id)){
      AppUtils.showWarn("提示","已选择该服务人员");
    }else{
      this.viewData.selectStaffList.push(item);
      this.viewData.selectStaffMap.put(item.id,item);
    }
  }

  /**
   * 删除选中的服务人员
   * @param index
   */
  deleteItem(index){
    this.viewData.selectStaffList.splice(index,1);
    this.viewData.selectStaffMap.clear();
    this.viewData.selectStaffList.forEach((item=>{
      this.viewData.selectStaffMap.put(item.id,item);
    }))
  }

  /**
   * 业绩金额
   * @param e
   * @param staffData
   */
  changeAmount(e,staffData:StaffData){
    let price = parseFloat(e.target.value);
    if(price < 0){
      price = 0;
    }
    staffData.amount = AppUtils.roundPoint(price,2);
    if(staffData.bonusType == BonusTypeEnum.PercentBonus){
      if(staffData.percentage){
        let percentage:number = parseFloat((staffData.percentage/100).toFixed(2));
        staffData.cost = price*percentage;
      }
    }
  }

  /**
   * 提成比例
   * @param e
   * @param staffData
   */
  changePercente(e,staffData:StaffData){
    let percentage = e.target.value;
    percentage = percentage > 100?100:percentage;
    percentage = percentage < 0?0:percentage;
    staffData.percentage = percentage;
    if(staffData.bonusType == BonusTypeEnum.PercentBonus){
      if(staffData.amount && percentage){
        let percentage1:number = AppUtils.roundPoint(percentage/100,3);
        staffData.percentage = percentage;
        staffData.cost = AppUtils.roundPoint(staffData.amount*percentage1,2);
      }
    }
  }

  /**
   * 选择提成类型
   */
  changeBonuseType(e,staffData:StaffData){
    let value = e;
    staffData.cost = 0;
    if(value == BonusTypeEnum.FixedBonus){
      staffData.percentage = 0;
      this.editPercent = true;
    }else{
      this.editPercent = false;
      if(staffData.amount && staffData.percentage){
        let percentage:number = parseFloat((staffData.percentage/100).toFixed(2));
        staffData.cost = staffData.amount*percentage;
      }
    }

  }

  /**
   * 修改cost
   * @param e
   * @param staffData
   */
  changeCost(e,staffData:StaffData) {
    let cost = parseFloat(e.target.value);
    if(cost < 0){
      cost = 0;
    }
    staffData.cost = AppUtils.roundPoint(cost,2);
  }

}

export class SelectStaffCompService{

  constructor(private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,private buserMgr:BUserMgr){}

  /**
   * @param callback
   */
  public async initViewData(callback:(viewDataP:SelectStaffCompViewData) => void){
    let viewDataTmp = new SelectStaffCompViewData();
    //请求storeClerkInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.clerkMap = storeClerkInfo.getValidClerkMap();
    viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

    //请求所有员工信息
    let clerkIdArray = viewDataTmp.clerkMap.keys();
    let buserList = await this.buserMgr.findByMultitId(clerkIdArray);
    this.buildBuserMap(buserList, viewDataTmp);

    //组装显示数据
    let keys = viewDataTmp.clerkMap.keys();
    for(let i=0;i<keys.length;i++){
      let staffData = new StaffData();
      staffData.id = keys[i];
      staffData.name = viewDataTmp.buserMap.get(keys[i]).name;
      staffData.amount = 0;
      staffData.bonusType = BonusTypeEnum.FixedBonus;
      staffData.percentage = 0;
      staffData.cost = 0;

      let clerkInfo = viewDataTmp.clerkMap.get(keys[i]);
      let roleSet = clerkInfo.roleSet;
      if(roleSet){
        let roleNameArr = [];
        for(let i=0;i<roleSet.length;i++){
          let storeAdminRole = viewDataTmp.roleMap.get(roleSet[i]);
          if(storeAdminRole){
            roleNameArr.push(storeAdminRole.name);
          }
        }
        staffData.roleName = roleNameArr.join("、");
      }else{
        staffData.roleName = "-";
      }
      viewDataTmp.staffDataList.push(staffData);
      viewDataTmp.staffList.push(staffData);
    }
    callback(viewDataTmp);
  }

  /**
   * 组装员工详情
   * @param buserList
   * @param viewDataTmp
   */
  private buildBuserMap(buserList: Array<BUser>, viewDataTmp: SelectStaffCompViewData) {
    let buserMap = new ZmMap<BUser>();
    for (let i = 0; i < buserList.length; i++) {
      buserMap.put(buserList[i].id, buserList[i]);
    }
    viewDataTmp.buserMap = buserMap;
  }

}

export class SelectStaffCompViewData{
  //员工map
  public clerkMap: ZmMap<ClerkInfo>;
  //角色map
  public roleMap: ZmMap<StoreAdminRole>;
  //店铺所有员工详情map
  public buserMap: ZmMap<BUser>;
  //服务人员列表项
  public staffDataList:Array<StaffData> = new Array();
  public staffList:Array<StaffData> = new Array();
  //选中的服务人员列表
  public selectStaffList:Array<StaffData> = new Array();
  public selectStaffMap: ZmMap<StaffData> = new ZmMap<StaffData>();

  //查询参数
  public queryParam:string = "";


}

export class StaffData{
  id:string;//员工id
  name:string;//员工姓名
  roleName:string;//员工岗位
  amount:number;// 业绩金额
  bonusType:number;//提成类型 BonusTypeEnum 固定提成 比例提成
  percentage:number;// 提成比例
  cost:number;// 提成金额
}
