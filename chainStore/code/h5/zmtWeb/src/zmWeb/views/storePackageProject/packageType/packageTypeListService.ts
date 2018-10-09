import {BusinessUtil} from "../../common/Util/BusinessUtil";
import {StorePackageProjectMgr} from "../../../bsModule/storePackageProject/StorePackageProjectMgr";
import {StorePackageProjectViewDataMgr} from "../StorePackageProjectViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {PackageProjectTypeRemoveForm} from "../../../bsModule/storePackageProject/apiData/PackageProjectTypeRemoveForm";

export class PackageTypeListService {

  constructor(private storePackageProjectMgr: StorePackageProjectMgr,
              private storePackageProjectViewDataMgr: StorePackageProjectViewDataMgr,) {
  }

  public initViewData() {
    this.storePackageProjectViewDataMgr.setPackageTypeListViewData(new PackageTypeListViewData());

    this.buildViewData().then(
      (viewDataTmp: PackageTypeListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: PackageTypeListViewData) {
    this.storePackageProjectViewDataMgr.setPackageTypeListViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param storeId:string
   * @returns Promise<PackageTypeListViewData>
   */
  public async buildViewData(): Promise<PackageTypeListViewData> {
    return new Promise<PackageTypeListViewData>(resolve => {
      let storeId = SessionUtil.getInstance().getStoreId();
      let packageTypeListTmp: Array<PackageProjectType> = new Array<PackageProjectType>();

      let viewDataTmp: PackageTypeListViewData = new PackageTypeListViewData();
      this.storePackageProjectMgr.getStorePackageProject(storeId).then(
        (storePackageProject) => {
          packageTypeListTmp = storePackageProject.getValidPackageTypeMap().values();
          viewDataTmp.packageTypeList = packageTypeListTmp;//原始数据

          packageTypeListTmp = BusinessUtil.sortListObject(packageTypeListTmp);//排序
          viewDataTmp.packageTypeListTmp = packageTypeListTmp;
          viewDataTmp.recordCount = packageTypeListTmp.length;
          viewDataTmp.packageTypeListShow = AppUtils.getPageData(1, packageTypeListTmp);
          viewDataTmp.loadingFinish = true;
          resolve(viewDataTmp);
        });
    });

  }

  /**
   * 根据名称查询分类列表
   * @param storeId:string
   * @param name:string
   * @param handleCallBack:(packageTypeListTmp:Array<PrdType>)
   **/

  public queryTypeListReq(viewData, name: string, handleCallBack: (viewDataTmp: PackageTypeListViewData) => void) {
    let packageTypeListTmp: Array<PackageProjectType> = viewData.packageTypeList;
    let viewDataTmp: PackageTypeListViewData = new PackageTypeListViewData();
    packageTypeListTmp = this.filterListByName(name, packageTypeListTmp);
    packageTypeListTmp = BusinessUtil.sortListObject(packageTypeListTmp);//排序

    viewDataTmp.packageTypeListTmp = packageTypeListTmp;
    viewDataTmp.recordCount = packageTypeListTmp.length;
    viewDataTmp.packageTypeListShow = AppUtils.getPageData(1, packageTypeListTmp);
    handleCallBack(viewDataTmp);
  }

  /**根据名称过滤分类列表*/
  private filterListByName(name, packageTypeListTmp) {
    packageTypeListTmp = packageTypeListTmp.filter(itemTmp => {
      if (itemTmp.name == name || (itemTmp.name && itemTmp.name.indexOf(name) > -1)) {
        return true;
      } else {
        return false;
      }
    });
    return packageTypeListTmp;
  }

  /**
   * 删除套餐分类
   */
  public deleteType(removeData: PackageProjectTypeRemoveForm) {
    return new Promise<boolean>(resolve => {
      this.storePackageProjectMgr.deletePackageProjectType(removeData).then(
        (success) => {
          resolve(success);
        });

    });
  }

}


export class PackageTypeListViewData {
  public packageTypeList: Array<PackageProjectType> = new Array<PackageProjectType>();//原始数据
  public packageTypeListTmp: Array<PackageProjectType> = new Array<PackageProjectType>();//临时数据
  public recordCount: number;//分页记录数
  public loadingFinish: boolean = false;

  public packageTypeListShow: Array<PackageProjectType> = new Array<PackageProjectType>();//显示数据

  public typeName: string = "";//查询输入框的值

  public curPage = 1;

}
