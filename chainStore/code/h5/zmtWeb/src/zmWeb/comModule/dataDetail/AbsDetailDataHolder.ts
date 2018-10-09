import {IntfDetailData} from "./IntfDetailData";
import {DataVersionEnum} from "./DataVersionEnum";
import {DataDetailCacheMgr} from "./DataDetailCacheMgr";

export abstract class AbsDetailDataHolder<T extends IntfDetailData>{

  public async getData(targetId:string, storeId:string):Promise<T> {
    let data:T = null;
    let version = await this.getDataVersion(storeId);
    data = DataDetailCacheMgr.getInstance().getData(this.getDataVersionEnum(),targetId,version);
    if (data == null) {
      data = await this.getMgr().get(targetId);
      if (data != null) {
        DataDetailCacheMgr.getInstance().putData(this.getDataVersionEnum(),targetId,version,data);
      }
    }
    return new Promise<T>(resolve=>{
      resolve(data);
    });
  }

  //获取店铺相关域的详情版本信息
  protected abstract getDataVersion(storeId:string):Promise<number>;

  //传入具体域的RestDao
  protected abstract getMgr();

  //获取详情数据的枚举
  public abstract getDataVersionEnum():DataVersionEnum;

}
