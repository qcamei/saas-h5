import {Component, OnInit, Input, OnChanges} from "@angular/core";

import {ServicePersonPopupCompViewData,
  StaffData, ServicePersonPopup
} from "./servicePersonPopupComp/servicePersonPopupComp";
import {AppointDataWraper, ProductData, ServicePersonCompData} from "../../addAppointWraper/AddAppointDataWraper";
import {BUserCacheMgr} from "../../../../bsModule/buser/BUserCacheMgr";
import {AppointDataWraperMgr} from "../../addAppointWraper/AddAppointDataWraperMgr";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ZmMap, AppUtils} from "../../../../comModule/AppUtils";
import {ClerkInfo} from "../../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {BUser} from "../../../../bsModule/buser/apiData/BUser";
import {StoreClerkInfoSynDataHolder} from "../../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";

/**
 * 选择服务人员组件
 */
@Component({
  selector: 'servicePerson-comp',
  template: `

       <zm-card  [expanded]="productList.length>0" [withCollapse]="true" [textBold]="true" [header]="'选择服务人员'">
                <table class="scrollTable table table-bordered text-center mg-b-0 mg-t-20 zmFullWidth" >
                    <thead>
                      <th style="width:10%;">序号</th>
                      <th style="width:10%;">类型</th>
                      <th style="width:10%;">名称</th>
                      <th style="width:10%;">结算方式</th>
                      <th style="width:20%;">服务人员</th>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of productList;let i = index">
                          <td style="width:10%;">{{i+1}}</td>
                          <td style="width:10%;">{{item.type|orderItemTypePipeComp}}</td>
                          <td style="width:10%;">{{item.name}}</td>
                          <td style="width:10%;">{{item.payType==0?"现结":"划卡"}}</td>
                          <td style="width:20%;padding:0 30px;" class="pos-r cur-hand" (click)="selectServicePerson(item)">
                            {{item.buserName}}
                            <img class="pos-a" src="assets/images/icon/icon_Add.png"  style="right:20px;top: 50%; margin-top:-12px;"/>
                          
                          </td>
                        </tr>
                    </tbody>
                </table>
        </zm-card>
  `,
  styleUrls: ['servicePersonComp.scss'],
})

export class ServicePersonComp implements OnInit,OnChanges {

  private service: ServicePersonCompService;
  public viewData: ServicePersonCompViewData = new ServicePersonCompViewData();
  public staffName: string;
  public contentExpanded = false;


  @Input() appointWraper: AppointDataWraper;
  productList: Array<ProductData>;
  servicePersonCompData: ServicePersonCompData;

  constructor(private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserCacheMgr: BUserCacheMgr,
              public matDialog: MatDialog,
              private appointDataWraperMgr: AppointDataWraperMgr,) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new ServicePersonCompService(this.storeClerkInfoSynDataHolder, this.buserCacheMgr);
  }

  ngOnInit(): void {

    if(this.productList.length>0){
      this.toggleContent();
    }

    if (this.appointWraper) {
      if (this.appointWraper.getProductCompData().productList) {
        this.productList = this.appointWraper.getProductCompData().productList;
      }
      this.servicePersonCompData = this.appointWraper.getServicePersonCompData();
    }
  }

  ngOnChanges(): void {
    if (this.appointWraper && this.appointWraper.getProductCompData().productList) {
      this.productList = this.appointWraper.getProductCompData().productList;
      this.servicePersonCompData = this.appointWraper.getServicePersonCompData();
    }
    if (this.productList && this.viewData && this.viewData.flag == false) {
      this.service.initViewData((viewDataTmp: ServicePersonCompViewData) => {
        if (viewDataTmp) {
          this.viewData = viewDataTmp;
        }
      });
    }
  }

  toggleContent(): void {
    this.contentExpanded = !this.contentExpanded;
  }


  //打开模态框
  selectServicePerson(item: ProductData) {
    // const selectLeaguerModal = this.modalService.open(ServicePersonPopup, {size: 'lg',backdrop:'static'});
    // let data: ServicePersonPopupCompViewData = ServicePersonPopupCompViewData.fromParentComp(this.viewData);
    // selectLeaguerModal.componentInstance.data = data;
    // selectLeaguerModal.componentInstance.product = item;
    // selectLeaguerModal.componentInstance.callBack = this.selectStaff.bind(this, item);

    let modalData = ServicePersonPopupCompViewData.fromParentComp(this.viewData);
    modalData["product"] = item;
    let callBack = this.selectStaff.bind(this, item);

    ZmModalMgr.getInstance().newLgModal(ServicePersonPopup,modalData,callBack);

  }

  /**
   * 选择服务人员回调
   */
  selectStaff(item: ProductData, selectStaffList: Array<StaffData>) {

    let buserNameArray = new Array<string>();
    let buserIdArray = new Array<string>();
    for (let i in selectStaffList) {
      let staffData = selectStaffList[i];
      buserNameArray.push(staffData.name);
      buserIdArray.push(staffData.id);
    }
    item.buserId = buserIdArray;
    item.buserName = buserNameArray.join("、");

    let productCompData = this.appointWraper.getProductCompData();
    let productList = productCompData.productList;
    for (let i in productList) {
      let selectProduct: ProductData = productList[i];
      if (selectProduct.id == item.id) {
        selectProduct = item;
        break;
      }
    }
    this.servicePersonCompData.productList = productList;
    AppUtils.showSuccess("提示","选择服务人员成功");
    this.appointDataWraperMgr.refreshWraper(this.appointWraper);

  }

}

export class ServicePersonCompService {
  constructor(private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserCacheMgr: BUserCacheMgr) {
  }

  /**
   * @param callback
   */
  public async initViewData(callback: (viewDataP: ServicePersonCompViewData) => void) {
    let viewDataTmp = new ServicePersonCompViewData();

    //请求storeClerkInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);

    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    if (storeClerkInfo) {
      viewDataTmp.clerkMap = storeClerkInfo.getValidClerkMap();
      viewDataTmp.roleMap = storeClerkInfo.getRoleMap();
    }

    //请求所有员工信息
    let clerkIdArray = new Array<string>();
    if (viewDataTmp.clerkMap) {
      clerkIdArray = viewDataTmp.clerkMap.keys();
      let buserMap = await this.buserCacheMgr.getList(clerkIdArray);
      viewDataTmp.buserMap = buserMap;

      let staffDataList = this.bulidShowData(viewDataTmp, clerkIdArray);
      viewDataTmp.staffDataList = staffDataList;
      viewDataTmp.staffDataListShow = staffDataList;
      viewDataTmp.flag = true;
    }
    callback(viewDataTmp);
  }

  /**
   * 组装员工显示数据
   */
  private bulidShowData(viewDataTmp:ServicePersonCompViewData,clerkIdArray:Array<string>): Array<StaffData> {
    let staffDataList: Array<StaffData> = new Array<StaffData>();
    for (let i = 0; i < clerkIdArray.length; i++) {
      let staffData = new StaffData();
      staffData.id = clerkIdArray[i];
      let buser = viewDataTmp.buserMap.get(clerkIdArray[i]);
      if (buser) {
        staffData.name = buser.name;
      }
      let clerkId = clerkIdArray[i];
      let roleName = this.getRoleName(viewDataTmp,clerkId);
      staffData.roleName = roleName;
      staffDataList.push(staffData);
    }
    return staffDataList;
  }

  /**
   * 获取员工岗位名称
   * @param viewDataTmp
   * @param clerkId:string
   */
  private getRoleName(viewDataTmp,clerkId){
    let clerkInfo = viewDataTmp.clerkMap.get(clerkId);
    let roleSet = clerkInfo.roleSet;
    let roleNameArr = [];
    if (roleSet) {
      for (let i = 0; i < roleSet.length; i++){
        let storeAdminRole = viewDataTmp.roleMap.get(roleSet[i]);
        if (storeAdminRole) {
          roleNameArr.push(storeAdminRole.name);
        }
      }
      return roleNameArr.join("、");
    } else {
      return roleNameArr.join("-");
    }
  }

}

export class ServicePersonCompViewData {
  public clerkMap: ZmMap<ClerkInfo>;
  public roleMap: ZmMap<StoreAdminRole>;
  public buserMap: ZmMap<BUser>;

  //服务人员列表项
  public staffDataList: Array<StaffData> = new Array();//原始组装数据
  public staffDataListShow: Array<StaffData> = new Array();//显示组装数据

  //选中的服务人员列表
  public selectStaffList: Array<StaffData> = new Array();
  public selectStaffListTmp: Array<StaffData> = new Array();

  public selectStaffMap: ZmMap<StaffData> = new ZmMap<StaffData>();//原始

  //查询参数
  public queryParam: string;
  public flag: boolean = false;//数据是否初始化

}
