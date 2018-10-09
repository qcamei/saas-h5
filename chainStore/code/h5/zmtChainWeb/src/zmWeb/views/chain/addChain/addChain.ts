import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {ChainViewDataMgr} from "../ChainViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppRouter} from "../../../comModule/AppRouter";
import {CurrentChain} from "../../../comModule/session/SessionData";
import {MainViewDataMgr} from "../../main/MainViewDataMgr";
import {Chain} from "../../../bsModule/chain/data/Chain";
import {ChainAddForm} from "../../../bsModule/chain/apiData/ChainAddForm";
import {PermService} from "../../permService";

/**
 * 创建连锁店
 */
@Component({
  selector:'add-chain',
  templateUrl:'addChain.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddChainPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: AddChainService;
  public viewData: AddChainViewData;

  constructor(private chainMgr:ChainMgr,
              private permService:PermService,
              private chainViewDataMgr:ChainViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new AddChainService(this.chainMgr,this.chainViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chainViewDataMgr.subscribeAddChainVD((viewDataP:AddChainViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 添加店铺 页面点击事件
   */
  public async addChain(){
    let checkSuccess =  this.checkForm();
    if(checkSuccess){
      this.viewData.addForm.area = this.viewData.citySetting.join("/");
      AppUtils.showMask("加载中");
      let chain = await this.service.addChain(this.viewData.addForm);
      this.handleResult(chain);
    }
  }

  private async handleResult(chain:Chain){
    if(!AppUtils.isNullObj(chain)){
      let currentChain = CurrentChain.newInstance(chain.id,chain.name,chain.bossId);
      SessionUtil.getInstance().setCurrentChain(currentChain);

      await this.permService.refreshPermData();

      let userPermData = SessionUtil.getInstance().getUserPermData();
      console.log(userPermData);
      AppUtils.closeMask();
      AppUtils.showSuccess("提示","新建成功");
      MainViewDataMgr.getInstance().notifyDataChanged();
      AppRouter.goHome();
    }else{
      AppUtils.closeMask();
      AppUtils.showError("提示","新建失败");
    }
  }

  private checkForm():boolean{
      let checkSuccess = true;
      if (AppUtils.isNullOrWhiteSpace(this.viewData.addForm.name)
        || AppUtils.isNullOrWhiteSpace(this.viewData.citySetting.join("/"))
        || AppUtils.isNullOrWhiteSpace(this.viewData.addForm.contacts)
        || AppUtils.isNullOrWhiteSpace(this.viewData.addForm.contactNumber)){
        AppUtils.showWarn("提示", "必填项未按要求填写");
        checkSuccess = false;
      }
      return checkSuccess;
    }
}

export class AddChainService{

  constructor(private chainMgr:ChainMgr,private chainViewDataMgr:ChainViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new AddChainViewData();
    this.chainViewDataMgr.setAddChainViewData(viewDataTmp);
  }

  /**
   * 添加店铺
   * @param addForm
   */
  public addChain(addForm:ChainAddForm):Promise<Chain>{
    return this.chainMgr.addChain(addForm);
  }

}

export class AddChainViewData{
  public addForm:ChainAddForm = new ChainAddForm();
  public citySetting:string[] = [];
}
