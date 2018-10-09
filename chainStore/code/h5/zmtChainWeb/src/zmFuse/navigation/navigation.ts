import {FuseNavigation} from "../../@fuse/types/fuse-navigation";

export const navigation: FuseNavigation[] = [

  {
    "id": "other", "title": "工作区", "type": "group", "icon": "apps",
    "children": [
      {
        "id": "首页",
        "title": "首页",
        "type": "item",
        "icon": "icon-home",
        "url": "/main/home/home"
      }]
  },

  {
    "id": "manage", "title": "管理", "type": "group", "icon": "apps",
    "children": [
      {
        "id": "店铺管理", "title": "店铺管理", "type": "collapsable", "icon": "icon-store",
        "children": [{
          "id": "店铺列表",
          "title": "店铺列表",
          "type": "item",
          "url": "/main/chain/storeList"
        },
          {
            "id": '新建店铺',
            "title": "新建店铺",
            "type": "item",
            "url":'/main/chain/addChain'
          }]
      },
      {
        "id": "员工管理", "title": "员工管理", "type": "collapsable", "icon": "icon-staff",
        "children": [{
          "id": "员工列表",
          "title": "员工列表",
          "type": "item",
          "url": "/main/chainClerk/findClerk"
        },
          {
            "id": "岗位管理",
            "title": "岗位管理",
            "type": "item",
            "url": "/main/chainClerk/manageRole"
          }]
      },

      {
        "id": "产品管理", "title": "产品库管理", "type": "collapsable", "icon": "icon-store",
        "children": [{
          "id": "产品库管理",
          "title": "产品库管理",
          "type": "item",
          "url": "/main/productionLibrary/libraryList"
        },
          {
            "id": "项目管理",
            "title": "项目管理",
            "type": "item",
            "url": "/main/chainProduct/productInfoList"
          },
          {
            "id": "套餐管理",
            "title": "套餐管理",
            "type": "item",
            "url": "/main/chainPackageProject/packageList"
          },
          {
            "id": "商品列表",
            "title": "商品列表",
            "type": "item",
            "url": "/main/chainGoods/goodsList"
          },
          {
            "id": "次卡列表",
            "title": "次卡列表",
            "type": "item",
            "url": "/main/chainCard/productCardList"
          },
        ]
      },

      {
        "id": "会员卡管理", "title": "会员卡管理", "type": "collapsable", "icon": "icon-card",
        "children": [{
          "id": "会员卡列表",
          "title": "会员卡列表",
          "type": "item",
          "url": "/main/chainCard/memberCardList"
        }]
      },
    ]
  },
  {
    "id": "dataReport", "title": "数据统计", "type": "group", "icon": "apps",
    "children": [
      {
        "id": "门店统计",
        "title": "门店统计",
        "type": "item",
        "icon": "icon-home",
        "url": "/main/dataReport/storeStatistics"
      },
      {
        "id": "财务统计",
        "title": "财务统计",
        "type": "item",
        "icon": "icon-home",
        "url": "/main/dataReport/financeReport"
      }
    ]
  },

  ];

export const navIcon = [
  {
    "name": "icon-home",
    "url": "/assets/images/sideBarSvg/icon-home.svg"
  }
 ];
