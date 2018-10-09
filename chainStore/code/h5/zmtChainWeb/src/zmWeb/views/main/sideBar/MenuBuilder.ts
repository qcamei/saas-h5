import {UserPermData} from "../../../comModule/session/SessionData";

export class MenuBuilder {

  public static buildMenu(userPermData: UserPermData) {
    let sideBarMenu = {
      //管理
      manage: [
        {
          title: '店铺管理',
          img: 'home-store',
          selected: false,
          permission: userPermData.isChainAdmin,
          children: [
            {
              title: '店铺列表',
              link: '/main/chain/storeList',
              selected: false,
              permission: userPermData.isChainAdmin
            }
            // },
            // {
            //   title: '新建店铺',
            //   link:'/main/chain/addChain',
            //   selected:false,
            //   permission:userPermData.isChainAdmin,
            // }
          ],
        },
        {
          title: '员工管理',
          img: 'home-staff',
          selected: false,
          permission: userPermData.isChainClerkAdmin,
          children: [
            {
              title: '员工列表',
              link: '/main/chainClerk/findClerk',
              selected: false,
              permission: true
            },
            {
              title: '岗位管理',
              link: '/main/chainClerk/manageRole',
              selected: false,
              permission: true
            }
          ],
        },
        {
          title: '产品管理',
          img: 'home-production',
          selected: false,
          permission: userPermData.isSellProductAdmin,
          children: [
            {
              title: '产品库管理',
              link: '/main/productionLibrary/libraryList',
              selected: false,
              permission: userPermData.isSellProductAdmin
            },
            {
              title: '项目管理',
              selected: false,
              link: '/main/chainProduct/productInfoList',
              permission: userPermData.isSellProductAdmin,
            },
            {
              title: '套餐管理',
              selected: false,
              link: '/main/chainPackageProject/packageList',
              permission: userPermData.isSellProductAdmin,
            },
            {
              title: '商品管理',
              selected: false,
              link: '/main/chainGoods/goodsList',
              permission: userPermData.isSellProductAdmin,
            },
            {
              title: '次卡管理',
              selected: false,
              link: '/main/chainCard/productCard/list',
              permission: userPermData.isSellProductAdmin,
            },
          ],
        },
        {
          title: '会员卡管理',
          img: 'home-vip',
          selected: false,
          permission: userPermData.isCardAdmin,
          children: [
            {
              title: '会员卡列表',
              link: '/main/chainCard/memberCard/list',
              selected: false,
              permission: userPermData.isCardAdmin,
            }
          ],
        },
      ],
      other: [
        {
          title: '首页',
          img: 'icon-home',
          selected: true,
          permission: true,
          link: '/main/home/home',
          children: []
        }
      ],
      dataReport: [
        {
          title: '店务统计',
          img: 'icon-commission',
          selected: true,
          permission: true,
          children: [
            {
              title: '门店统计',
              link: '/main/dataReport/storeStatistics',
              selected: false,
              permission: true,
            },
            {
              title: '财务统计',
              link: '/main/dataReport/financeReport',
              selected: false,
              permission: true,
            },
            {
              title: '交易流水',
              link: '/main/dataReport/transactionFlow',
              selected: false,
              permission: true,
            }
          ]
        },
        {
          title: '会员统计',
          img: 'icon-card',
          selected: true,
          permission: true,
          children: [
            {
              title: '会员统计',
              link: '/main/dataReport/memberStatistics',
              selected: false,
              permission: true,
            },
            {
              title: '次卡统计',
              link: '/main/dataReport/cardStatistic',
              selected: false,
              permission: true,
            }
          ]
        },
        {
          title: '产品统计',
          img: 'icon-card',
          selected: true,
          permission: true,
          children: [

            {
              title: '产品统计',
              link: '/main/dataReport/productStatistics',
              selected: false,
              permission: true,
            }
          ]
        }
      ]
    };

    return sideBarMenu;
  }

}


export class MenuData {
  constructor() {
  }

  title: string;
  img: string;
  selected: boolean;
  permission: boolean;
  link: string;
  children: Array<SubMenuData>;
}

export class SubMenuData {
  constructor() {
  }

  title: string;
  img: string;
  selected: boolean;
  permission: boolean;
  link: string;
}
