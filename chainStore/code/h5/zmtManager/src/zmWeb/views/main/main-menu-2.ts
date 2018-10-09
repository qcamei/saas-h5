import {UserPermData} from "../../comModule/UserData";
export class MenuBuilder{

  public static buildMenu(userPermData:UserPermData){
    let sideBarMenu = {
      //常用
      common:[

      ],
      //管理
      manage:[
        {
          title: '账号管理',
          img:'icon-staff',
          selected:false,
          permission:true,
          children: [
            {
              title: '账号列表',
              link: '/main/buser/buserList/0',
              selected:false,
              permission:true
            }
            ]
        },
        {
          title: '仪器管理',
          img:'icon-device',
          selected:false,
          permission:true,
          children: [
            {
              title: '绑定商户',
              link: '/main/mngDevice/buserBindDeviceList',
              selected:false,
              permission:true
            },{
              title: '所有仪器管理',
              link: '/main/mngDevice/allDeviceList',
              selected:false,
              permission:true
            },
          ]
        },
        {
          title: '会员等级',
          img:'icon-vip',
          selected:false,
          permission:true,
          children: [
            {
              title: '等级列表',
              link:'/main/vipLevel/vipLevelList',
              selected:false,
              permission:true
            },
            {
              title: '等级分类',
              link:'/main/vipLevelType/vipLevelTypeList',
              selected:false,
              permission:true
            }
          ],
        },
        {
          title: '收费管理',
          img:'icon-commission',
          selected:false,
          permission:true,
          children: [
            {
              title: '收费列表',
              link:'/main/charge/chargeList',
              selected:false,
              permission:true
            },

          ],
        },
        // {
        //   title: '商品管理',
        //   img:'icon-commodity',
        //   selected:false,
        //   permission:userPermData.isGoodsAdmin,
        //   children: [
        //     {
        //       title: '商品列表',
        //       link:'/main/storeGoods/storeGoodsList',
        //       selected:false,
        //       permission:true
        //     },
        //     {
        //       title: '商品分类',
        //       link:'/main/storeGoods/goodsClassify',
        //       selected:false,
        //       permission:true
        //     },
        //   ],
        // },
        // {
        //   title: '卡包管理',
        //   img:'icon-card',
        //   selected:false,
        //   permission:userPermData.isCardAdmin,
        //   children: [
        //     {
        //       title: '会员卡',
        //       link: '/main/storeCardInfo/memberCardList',
        //       selected:false,
        //       permission:true
        //     },
        //     {
        //       title: '次卡',
        //       link: '/main/storeCardInfo/productCardList',
        //       selected:false,
        //       permission:true
        //     }
        //   ],
        // },
        // {
        //   title: '店铺管理',
        //   img:'icon-store',
        //   selected:false,
        //   permission:true,
        //   children: [
        //     {
        //       title: '店铺列表',
        //       link:'/main/store/findStore',
        //       selected:false,
        //       permission:userPermData.isBoss,
        //     },
        //     {
        //       title: '加入店铺',
        //       link:'/main/store/applyStore',
        //       selected:false,
        //       permission:!userPermData.isBoss,
        //     },
        //   ],
        // },
        // {
        //   title: '员工管理',
        //   img:'icon-staff',
        //   selected:false,
        //   permission:userPermData.isClerkAdmin,
        //   children: [
        //     {
        //       title: '员工信息',
        //       link: '/main/storeClerkInfo/findClerk',
        //       selected:false,
        //       permission:true
        //     },
        //     {
        //       title: '岗位管理',
        //       link: '/main/storeClerkInfo/manageRole',
        //       selected:false,
        //       permission:true
        //     },
        //   ],
        // },
        // {
        //   title: '提成管理',
        //   img:'icon-commission',
        //   selected:false,
        //   permission:userPermData.isBonusAdmin,
        //   children: [
        //     {
        //       title: '提成列表',
        //       link: '/main/bonus/bonusList',
        //       selected:false,
        //       permission:true
        //     },
        //   ],
        // },
      ],
      //首页
      // other:[
      //   {
      //     title: '首页',
      //     img:'icon-home',
      //     selected:false,
      //     permission:true,
      //     link: '/main/home/home',
      //     children:[]
      //   },
      // ]
    };

    return sideBarMenu;
  }

}

