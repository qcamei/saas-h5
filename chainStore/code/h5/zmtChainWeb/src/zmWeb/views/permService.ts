import {SessionUtil} from "../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../comModule/AppUtils";
import {Injectable} from "@angular/core";
import {ChainClerkSynDataHolder} from "../bsModule/chainClerk/ChainClerkSynDataHolder";
import {ChainUserSynDataHolder} from "../bsModule/chainUser/ChainUserSynDataHolder";
import {ChainUser} from "../bsModule/chainUser/data/ChainUser";
import {ChainSynDataHolder} from "../bsModule/chain/ChainSynDataHolder";
import {CurrentChain, UserPermData} from "../comModule/session/SessionData";
import {ChainAdminUtil} from "./main/ChainAdminUtil";
import {Chain} from "../bsModule/chain/data/Chain";
import {ChainStoreUserRelative} from "../bsModule/chainUser/data/ChainStoreUserRelative";
import {ChainClerk} from "../bsModule/chainClerk/data/ChainClerk";

@Injectable()
export class PermService{

  constructor(
              private chainSynDataHolder:ChainSynDataHolder,
              private chainUserSynDataHolder:ChainUserSynDataHolder,
              private chainClerkSynDataHolder:ChainClerkSynDataHolder){}

  /**
   * 刷新用户店铺、权限数据
   */
  public async refreshPermData(){
    let userId = SessionUtil.getInstance().getUserId();
    let chainUser:ChainUser = await this.chainUserSynDataHolder.getData(userId);
    let chainSU = new ChainStoreUserRelative();
    if(chainUser){
      let chainSUMap:ZmMap<ChainStoreUserRelative> = chainUser.getChainSUMap();
      if(chainSUMap){
        chainSU = chainSUMap.values()[0];//1个连锁店的情况
      }
    }

    let userPermData:UserPermData = new UserPermData();
    if(chainUser && chainSU){
      let chainId = chainSU.chainId;
      let chain:Chain = await this.chainSynDataHolder.getData(chainId);
      if(!AppUtils.isNullObj(chain)){
        let currentChain = CurrentChain.newInstance(chain.id,chain.name,chain.bossId);
        SessionUtil.getInstance().setCurrentChain(currentChain);

        if(chain.bossId==userId){//老板
          userPermData = ChainAdminUtil.buildBossUserPermData();
          SessionUtil.getInstance().setUserPermData(userPermData);
        }else{
          let chainClerk:ChainClerk = await this.chainClerkSynDataHolder.getData(chain.id);
          userPermData = ChainAdminUtil.buildUserPermData(chainClerk);
          SessionUtil.getInstance().setUserPermData(userPermData);
        }
      }else{//无连锁店
        userPermData = ChainAdminUtil.buildNoChainUserPermData(chainSU);
        SessionUtil.getInstance().setUserPermData(userPermData);
      }
    }
  }

}
