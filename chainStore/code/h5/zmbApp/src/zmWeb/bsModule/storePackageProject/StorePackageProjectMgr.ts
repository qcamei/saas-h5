import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {StorePackageProject} from "./data/StorePackageProject";
import {MgrPool} from "../../comModule/MgrPool";

@Injectable()
export class StorePackageProjectMgr{

  public static getInstance():StorePackageProjectMgr{
    return MgrPool.getInstance().get("StorePackageProjectMgr",StorePackageProjectMgr);
  }

  private storePackageDao:StorePackageDao;

  constructor(){
    this.storePackageDao = new StorePackageDao();
  }

  public getStorePackageProject(storeId:string):Promise<StorePackageProject> {
    return this.storePackageDao.get(storeId);
  }


}

class StorePackageDao extends AsyncRestDao<StorePackageProject>{
  constructor(){
    var table:string = "storePackageProject";
    super(StorePackageProject, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
