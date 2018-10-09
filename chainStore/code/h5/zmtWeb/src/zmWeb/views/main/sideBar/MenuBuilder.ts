import {UserPermData} from "../../../comModule/session/SessionData";
import {StoreVipLevelEnum} from "../../../bsModule/buser/data/StoreVipLevelEnum";

export class MenuBuilder{

  public static buildMenu(userPermData:UserPermData,vipLevel:number,hasStore:boolean){
    let sideBarMenu = {
      //常用
      common:[
        {
          title: '项目管理',
          img:'icon-project',
          selected:false,
          permission:userPermData.isProductAdmin,
          children: [
            {
              title: '项目列表',
              link:'/main/storeProductInfo/productInfoList',
              selected:false,
              permission:true
            },
            {
              title: '项目分类',
              link:'/main/storeProductInfo/productType',
              selected:false,
              permission:true
            }
          ],
        },
        {
          title: '商品管理',
          img:'icon-commodity',
          selected:false,
          permission:userPermData.isGoodsAdmin,
          children: [
            {
              title: '商品列表',
              link:'/main/storeGoods/storeGoodsList',
              selected:false,
              permission:true
            },
            {
              title: '商品分类',
              link:'/main/storeGoods/goodsClassify',
              selected:false,
              permission:true
            },
          ],
        },
        {
          title: '套餐管理',
          img:'icon-package',
          selected:false,
          permission:userPermData.isPackageAdmin,
          children: [
            {
              title: '套餐列表',
              link:'/main/storePackageProject/packageList',
              selected:false,
              permission:true
            },
            {
              title: '套餐分类',
              link:'/main/storePackageProject/packageType',
              selected:false,
              permission:true
            },
          ],
        },
        {
          title: '次卡管理',
          img:'icon-card',
          selected:false,
          permission:userPermData.isCardAdmin,
          children: [
            {
              title: '次卡列表',
              link: '/main/storeCardInfo/productCard/list',
              selected:false,
              permission:true
            },
            {
              title: '次卡分类',
              link: '/main/storeCardInfo/productCard/typeList',
              selected:false,
              permission:true
            }
          ],
        },
        {
          title: '会员卡管理',
          img:'icon-card',
          selected:false,
          permission:userPermData.isCardAdmin,
          children: [
            {
              title: '会员卡列表',
              link: '/main/storeCardInfo/memberCard/list',
              selected:false,
              permission:true
            }
          ],
        },
      ],
      //管理
      manage:[
        {
          title: '店铺管理',
          img:'icon-store',
          selected:false,
          permission:userPermData.isBoss && userPermData.roleEnum != 2,
          children: [
            {
              title: '店铺列表',
              link:'/main/store/findStore',
              selected:false,
              permission:userPermData.isBoss,
            }
          ],
        },
        {
          title: '管理设置',
          img:'icon-set',
          link:'/main/settings/index',
          selected:false,
          permission:userPermData.isStoreConfigAdmin && hasStore,
          children: [
          ],
        },
        {
          title: '员工管理',
          img:'icon-staff',
          selected:false,
          permission:userPermData.isClerkAdmin,
          children: [
            {
              title: '员工信息',
              link: '/main/storeClerkInfo/findClerk/0',
              selected:false,
              permission:true
            },
            {
              title: '岗位管理',
              link: '/main/storeClerkInfo/manageRole',
              selected:false,
              permission:userPermData.isClerkAdmin
            },
          ],
        },
        {
          title: '提成管理',
          img:'icon-commission',
          selected:false,
          permission:userPermData.isBonusAdmin,
          children: [
            {
              title: '提成列表',
              link: '/main/bonus/bonusList',
              selected:false,
              permission:true
            },
          ],
        },
        {
          title: '仪器管理',
          img:'icon-device',
          selected:false,
          permission:vipLevel==StoreVipLevelEnum.HonKonUser && userPermData.isDeviceAdmin,
          children: [
            {
              title: '仪器列表',
              link: '/main/buserDevice/storeDeviceList',
              selected:false,
              permission:true
            },
          ]
        }
      ],
      // 统计
      statistics:[
        {
          title: '店务统计',
          img:'icon-commission',
          selected:false,
          permission:userPermData.isReportAdmin,
          children: [
            {
              title: '财务统计',
              link:'/main/shopStatistic/financial',
              selected:false,
              permission:true
            },
            {
              title: '交易流水',
              link:'/main/shopStatistic/transaction',
              selected:false,
              permission:true
            },

          ],
        },
        {
          title: '会员统计',
          img:'icon-card',
          selected:false,
          permission:userPermData.isReportAdmin,
          children: [
            {
              title: '会员统计',
              link:'/main/shopStatistic/menberStatic',
              selected:false,
              permission:true
            },
            {
              title: '次卡统计',
              link:'/main/shopStatistic/carInfoStatic',
              selected:false,
              permission:true
            },

          ],
        },

        {
          title: '产品统计',
          img:'icon-project',
          selected:false,
          permission:userPermData.isReportAdmin,
          children: [
            {
              title: '产品统计',
              link:'/main/shopStatistic/productStatic',
              selected:false,
              permission:true
            },


          ],
        },

      ],
      //店务
      other:[

        {
          title: '总店数据',
          img:'icon-data',
          selected:false,
          permission:userPermData.showSynData,
          link: '/main/pullData/pull',
          children:[]
        },
        {
          title: '店务服务',
          img:'icon-operation',
          selected:false,
          permission:userPermData.isAppointmentAdmin||userPermData.isRechargeAdmin||userPermData.isPurchaseAdmin||userPermData.isOrderAdmin,
          children: [
            {
              title: '预约列表',
              link: '/main/appointment/appointmentList',
              selected:false,
              permission:userPermData.isAppointmentAdmin,
            },
            {
              title: '会员充值',
              link: '/main/membershipRecharge/list',
              selected:false,
              permission:userPermData.isRechargeAdmin,
            },
            {
              title: '开单列表',
              link: '/main/bill/billList',
              selected:false,
              permission:userPermData.isPurchaseAdmin,
            },
            {
              title: '订单列表',
              link: '/main/order/orderList',
              selected:false,
              permission:userPermData.isOrderAdmin,
            },
          ],
        },

        {
          title: '收支记账',
          img:'icon-incomepay',
          selected:false,
          permission:userPermData.isIncomePayAdmin,
          children: [
            {
              title: '收支列表',
              link: '/main/incomePay/incomePayList',
              selected:false,
              permission:true,
            },
            {
              title: '收支分类',
              link: '/main/incomePay/incomePayType',
              selected:false,
              permission:true,
            }

          ],
        },
        {
          title: '商城订单',
          img:'icon-incomepay',
          selected:false,
          permission:true,
          children: [
            {
              title: '订单列表',
              link: '/main/shopping/shoppingOrder',
              selected:false,
              permission:true,
            },
          ],
        },

        {
          title: '交班日结',
          img:'icon-incomepay',
          selected:false,
          permission:userPermData.isDaySnapshotAdmin,
          children: [
            {
              title: '交班日结',
              link: '/main/checkDay/checkDayHand',
              selected:false,
              permission:true,
            },
            {
              title: '日结列表',
              link: '/main/checkDay/checkDayList',
              selected:false,
              permission:true,
            },
          ],
        },

        {
          title: '操作日志',
          img:'icon-incomepay',
          selected:false,
          permission:userPermData.isOplogAdmin,
          children: [
            {
              title: '日志列表',
              link: '/main/oplog/oplogList',
              selected:false,
              permission:true,
            },
          ],
        },

        {
          title: '欠款管理',
          img:'icon-arrears',
          selected:false,
          permission:userPermData.isArrearageAdmin,
          children: [
            {
              title: '欠款列表',
              link: '/main/arrearages/arrearagesList',
              selected:false,
              permission:true
            },
          ],
        },
        {
          title: '会员管理',
          img:'icon-customer',
          selected:false,
          permission:userPermData.isLeaguerAdmin,
          children: [
            {
              'title': '会员列表',
              'link': '/main/storeLeaguerInfo/findLeaguer',
              selected:false,
              permission:true
            },
            {
              'title': '会员分析',
              'link': '/main/storeLeaguerInfo/leaguerAnalysis',
              selected:false,
              permission:true
            },
          ],
        },

      ],

      default:[
        {
          title: '首页',
          img:'icon-home',
          selected:false,
          permission:true,
          link: '/main/home/home',
          children:[]
        },
        {
          title: '使用引导',
          img:'icon-guide',
          selected:false,
          permission:true,
          link: '/main/guide/guide',
          children:[]
        },
      ]
    };

    return sideBarMenu;
  }

}



export class MenuData{
  constructor(){
  }

  title:string;
  img:string;
  selected:boolean;
  permission:boolean;
  link:string;
  children:Array<SubMenuData>;
}

export class SubMenuData{
  constructor(){
  }
  title:string;
  img:string;
  selected:boolean;
  permission:boolean;
  link:string;
}
