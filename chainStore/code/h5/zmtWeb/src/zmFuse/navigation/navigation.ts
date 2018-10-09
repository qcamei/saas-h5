import {FuseNavigation} from "../../@fuse/types/fuse-navigation";

export const navigation: FuseNavigation[] = [
  {
    "id": "other", "title": "店务", "type": "group", "icon": "apps",
    "children": [
      {"id": "首页", "title": "首页", "type": "item", "icon": "icon-home", "url": "/main/home/home"},
      {"id": "使用引导", "title": "使用引导", "type": "item", "icon": "icon-guide", "url": "/main/guide/guide"},
      {
        "id": "店务服务",
        "title": "店务服务",
        "type": "collapsable",
        "icon": "icon-operation",
        "children": [{
          "id": "预约列表",
          "title": "预约列表",
          "type": "item",
          "url": "/main/appointment/appointmentList"
        },
        {"id": "会员充值", "title": "会员充值", "type": "item", "url": "/main/membershipRecharge/list"},
         {
          "id": "开单列表",
          "title": "开单列表",
          "type": "item",
          "url": "/main/bill/billList"
        },
        {"id": "订单列表", "title": "订单列表", "type": "item", "url": "/main/order/orderList"}]
      },
      ]
  }, {
    "id": "common",
    "title": "常用",
    "type": "group",
    "icon": "apps",
    "children": [{
      "id": "会员管理",
      "title": "会员管理",
      "type": "collapsable",
      "icon": "icon-customer",
      "children": [{"id": "会员列表", "title": "会员列表", "type": "item", "url": "/main/storeLeaguerInfo/findLeaguer"}]
    }, {
      "id": "数据统计",
      "title": "数据统计",
      "type": "collapsable",
      "icon": "icon-data",
      "children": [{
        "id": "会员统计",
        "title": "会员统计",
        "type": "item",
        "url": "/main/dataReport/leaguerReport"
      }, {"id": "销售统计", "title": "销售统计", "type": "item", "url": "/main/dataReport/consumeReport"}]
    }]
  }, {
    "id": "manage",
    "title": "管理",
    "type": "group",
    "icon": "apps",
    "children": [{
      "id": "项目管理",
      "title": "项目管理",
      "type": "collapsable",
      "icon": "icon-project",
      "children": [{
        "id": "项目列表",
        "title": "项目列表",
        "type": "item",
        "url": "/main/storeProductInfo/productInfoList"
      }, {"id": "项目分类", "title": "项目分类", "type": "item", "url": "/main/storeProductInfo/productType"}]
    }, {
      "id": "套餐管理",
      "title": "套餐管理",
      "type": "collapsable",
      "icon": "icon-project",
      "children": [{
        "id": "套餐列表",
        "title": "套餐列表",
        "type": "item",
        "url": "/main/storePackageProject/packageList"
      }, {"id": "套餐分类", "title": "套餐分类", "type": "item", "url": "/main/storePackageProject/packageType"}]
    }, {
      "id": "商品管理",
      "title": "商品管理",
      "type": "collapsable",
      "icon": "icon-commodity",
      "children": [{
        "id": "商品列表",
        "title": "商品列表",
        "type": "item",
        "url": "/main/storeGoods/storeGoodsList"
      }, {"id": "商品分类", "title": "商品分类", "type": "item", "url": "/main/storeGoods/goodsClassify"}]
    }, {
      "id": "次卡管理",
      "title": "次卡管理",
      "type": "collapsable",
      "icon": "icon-card",
      "children": [{
        "id": "次卡列表",
        "title": "次卡列表",
        "type": "item",
        "url": "/main/storeCardInfo/productCardList"
      }, {"id": "次卡分类", "title": "次卡分类", "type": "item", "url": "/main/storeCardInfo/productCardTypeList"}]
    }, {
      "id": "会员卡管理",
      "title": "会员卡管理",
      "type": "collapsable",
      "icon": "icon-card",
      "children": [{"id": "会员卡列表", "title": "会员卡列表", "type": "item", "url": "/main/storeCardInfo/memberCardList"}]
    }, {
      "id": "仪器管理",
      "title": "仪器管理",
      "type": "collapsable",
      "icon": "icon-device",
      "children": [{"id": "仪器列表", "title": "仪器列表", "type": "item", "url": "/main/buserDevice/storeDeviceList"}]
    }, {
      "id": "店铺管理",
      "title": "店铺管理",
      "type": "collapsable",
      "icon": "icon-store",
      "children": [{"id": "店铺列表", "title": "店铺列表", "type": "item", "url": "/main/store/findStore"}]
    }, {
      "id": "员工管理",
      "title": "员工管理",
      "type": "collapsable",
      "icon": "icon-staff",
      "children": [{
        "id": "员工信息",
        "title": "员工信息",
        "type": "item",
        "url": "/main/storeClerkInfo/findClerk/0"
      }, {"id": "岗位管理", "title": "岗位管理", "type": "item", "url": "/main/storeClerkInfo/manageRole"}]
    }, {
      "id": "提成管理",
      "title": "提成管理",
      "type": "collapsable",
      "icon": "icon-commission",
      "children": [{"id": "提成列表", "title": "提成列表", "type": "item", "url": "/main/bonus/bonusList"}]
    }, {
      "id": "欠款管理",
      "title": "欠款管理",
      "type": "collapsable",
      "icon": "icon-arrears",
      "children": [{"id": "欠款列表", "title": "欠款列表", "type": "item", "url": "/main/arrearages/arrearagesList"}]
    }, {"id": "管理设置", "title": "管理设置", "type": "collapsable", "icon": "icon-set", "children": []}]
  }];
export const navIcon = [{"name": "icon-home", "url": "/assets/images/sideBarSvg/icon-home.svg"}, {
  "name": "icon-guide",
  "url": "/assets/images/sideBarSvg/icon-guide.svg"
}, {
  "name": "icon-operation",
  "url": "/assets/images/sideBarSvg/icon-operation.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-customer",
  "url": "/assets/images/sideBarSvg/icon-customer.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-data",
  "url": "/assets/images/sideBarSvg/icon-data.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-project",
  "url": "/assets/images/sideBarSvg/icon-project.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-project",
  "url": "/assets/images/sideBarSvg/icon-project.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-commodity",
  "url": "/assets/images/sideBarSvg/icon-commodity.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-card",
  "url": "/assets/images/sideBarSvg/icon-card.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-card",
  "url": "/assets/images/sideBarSvg/icon-card.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-device",
  "url": "/assets/images/sideBarSvg/icon-device.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-store",
  "url": "/assets/images/sideBarSvg/icon-store.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-staff",
  "url": "/assets/images/sideBarSvg/icon-staff.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-commission",
  "url": "/assets/images/sideBarSvg/icon-commission.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-arrears",
  "url": "/assets/images/sideBarSvg/icon-arrears.svg"
}, {"url": "/assets/images/sideBarSvg/undefined.svg"}, {
  "name": "icon-set",
  "url": "/assets/images/sideBarSvg/icon-set.svg"
}];
//
// export const navigation: FuseNavigation[] = [
//   {
//     id       : 'applications',
//     title    : 'Applications',
//     translate: 'NAV.APPLICATIONS',
//     type     : 'group',
//     icon     : 'apps',
//     children : [
//       {
//         id       : 'dashboards',
//         title    : 'Dashboards',
//         translate: 'NAV.DASHBOARDS',
//         type     : 'collapsable',
//         icon     : 'dashboard',
//         children : [
//           {
//             id   : 'analytics',
//             title: 'Analytics',
//             type : 'item',
//             url  : '/apps/dashboards/analytics'
//           },
//           {
//             id   : 'project',
//             title: 'Project',
//             type : 'item',
//             url  : '/apps/dashboards/project'
//           }
//         ]
//       },
//       {
//         id       : 'calendar',
//         title    : 'Calendar',
//         translate: 'NAV.CALENDAR',
//         type     : 'item',
//         icon     : 'today',
//         url      : '/apps/calendar'
//       },
//       {
//         id       : 'e-commerce',
//         title    : 'E-Commerce',
//         translate: 'NAV.ECOMMERCE',
//         type     : 'collapsable',
//         icon     : 'shopping_cart',
//         children : [
//           {
//             id   : 'dashboard',
//             title: 'Dashboard',
//             type : 'item',
//             url  : '/apps/e-commerce/dashboard'
//           },
//           {
//             id        : 'products',
//             title     : 'Products',
//             type      : 'item',
//             url       : '/apps/e-commerce/products',
//             exactMatch: true
//           },
//           {
//             id        : 'productDetail',
//             title     : 'Product Detail',
//             type      : 'item',
//             url       : '/apps/e-commerce/products/1/printed-dress',
//             exactMatch: true
//           },
//           {
//             id        : 'orders',
//             title     : 'Orders',
//             type      : 'item',
//             url       : '/apps/e-commerce/orders',
//             exactMatch: true
//           },
//           {
//             id        : 'orderDetail',
//             title     : 'Order Detail',
//             type      : 'item',
//             url       : '/apps/e-commerce/orders/1',
//             exactMatch: true
//           }
//         ]
//       },
//       {
//         id       : 'academy',
//         title    : 'Academy',
//         translate: 'NAV.ACADEMY',
//         type     : 'item',
//         icon     : 'school',
//         url      : '/apps/academy'
//       },
//       {
//         id       : 'mail',
//         title    : 'Mail',
//         translate: 'NAV.MAIL.TITLE',
//         type     : 'item',
//         icon     : 'email',
//         url      : '/apps/mail',
//         badge    : {
//           title    : '25',
//           translate: 'NAV.MAIL.BADGE',
//           bg       : '#F44336',
//           fg       : '#FFFFFF'
//         }
//       },
//       {
//         id       : 'mail-ngrx',
//         title    : 'Mail Ngrx',
//         translate: 'NAV.MAIL_NGRX.TITLE',
//         type     : 'item',
//         icon     : 'email',
//         url      : '/apps/mail-ngrx',
//         badge    : {
//           title    : '13',
//           translate: 'NAV.MAIL_NGRX.BADGE',
//           bg       : '#EC0C8E',
//           fg       : '#FFFFFF'
//         }
//       },
//       {
//         id       : 'chat',
//         title    : 'Chat',
//         translate: 'NAV.CHAT',
//         type     : 'item',
//         icon     : 'chat',
//         url      : '/apps/chat',
//         badge    : {
//           title: '13',
//           bg   : '#09d261',
//           fg   : '#FFFFFF'
//         }
//       },
//       {
//         id       : 'file-manager',
//         title    : 'File Manager',
//         translate: 'NAV.FILE_MANAGER',
//         type     : 'item',
//         icon     : 'folder',
//         url      : '/apps/file-manager'
//       },
//       {
//         id       : 'contacts',
//         title    : 'Contacts',
//         translate: 'NAV.CONTACTS',
//         type     : 'item',
//         icon     : 'account_box',
//         url      : '/apps/contacts'
//       },
//       {
//         id       : 'to-do',
//         title    : 'To-Do',
//         translate: 'NAV.TODO',
//         type     : 'item',
//         icon     : 'check_box',
//         url      : '/apps/todo',
//         badge    : {
//           title: '3',
//           bg   : '#FF6F00',
//           fg   : '#FFFFFF'
//         }
//       },
//       {
//         id       : 'scrumboard',
//         title    : 'Scrumboard',
//         translate: 'NAV.SCRUMBOARD',
//         type     : 'item',
//         icon     : 'assessment',
//         url      : '/apps/scrumboard'
//       }
//     ]
//   },
//   {
//     id      : 'pages',
//     title   : 'Pages',
//     type    : 'group',
//     icon    : 'pages',
//     children: [
//       {
//         id      : 'authentication',
//         title   : 'Authentication',
//         type    : 'collapsable',
//         icon    : 'lock',
//         badge   : {
//           title: '10',
//           bg   : '#525e8a',
//           fg   : '#FFFFFF'
//         },
//         children: [
//           {
//             id   : 'login',
//             title: 'Login',
//             type : 'item',
//             url  : '/pages/auth/login'
//           },
//           {
//             id   : 'login-v2',
//             title: 'Login v2',
//             type : 'item',
//             url  : '/pages/auth/login-2'
//           },
//           {
//             id   : 'register',
//             title: 'Register',
//             type : 'item',
//             url  : '/pages/auth/register'
//           },
//           {
//             id   : 'register-v2',
//             title: 'Register v2',
//             type : 'item',
//             url  : '/pages/auth/register-2'
//           },
//           {
//             id   : 'forgot-password',
//             title: 'Forgot Password',
//             type : 'item',
//             url  : '/pages/auth/forgot-password'
//           },
//           {
//             id   : 'forgot-password-v2',
//             title: 'Forgot Password v2',
//             type : 'item',
//             url  : '/pages/auth/forgot-password-2'
//           },
//           {
//             id   : 'reset-password',
//             title: 'Reset Password',
//             type : 'item',
//             url  : '/pages/auth/reset-password'
//           },
//           {
//             id   : 'reset-password-v2',
//             title: 'Reset Password v2',
//             type : 'item',
//             url  : '/pages/auth/reset-password-2'
//           },
//           {
//             id   : 'lock-screen',
//             title: 'Lock Screen',
//             type : 'item',
//             url  : '/pages/auth/lock'
//           },
//           {
//             id   : 'mail-confirmation',
//             title: 'Mail Confirmation',
//             type : 'item',
//             url  : '/pages/auth/mail-confirm'
//           }
//         ]
//       },
//       {
//         id   : 'coming-soon',
//         title: 'Coming Soon',
//         type : 'item',
//         icon : 'alarm',
//         url  : '/pages/coming-soon'
//       },
//       {
//         id      : 'errors',
//         title   : 'Errors',
//         type    : 'collapsable',
//         icon    : 'error',
//         children: [
//           {
//             id   : '404',
//             title: '404',
//             type : 'item',
//             url  : '/pages/errors/error-404'
//           },
//           {
//             id   : '500',
//             title: '500',
//             type : 'item',
//             url  : '/pages/errors/error-500'
//           }
//         ]
//       },
//       {
//         id      : 'invoice',
//         title   : 'Invoice',
//         type    : 'collapsable',
//         icon    : 'receipt',
//         children: [
//           {
//             id   : 'modern',
//             title: 'Modern',
//             type : 'item',
//             url  : '/pages/invoices/modern'
//           },
//           {
//             id   : 'compact',
//             title: 'Compact',
//             type : 'item',
//             url  : '/pages/invoices/compact'
//           }
//         ]
//       },
//       {
//         id   : 'maintenance',
//         title: 'Maintenance',
//         type : 'item',
//         icon : 'build',
//         url  : '/pages/maintenance'
//       },
//       {
//         id      : 'pricing',
//         title   : 'Pricing',
//         type    : 'collapsable',
//         icon    : 'attach_money',
//         children: [
//           {
//             id   : 'style-1',
//             title: 'Style 1',
//             type : 'item',
//             url  : '/pages/pricing/style-1'
//           },
//           {
//             id   : 'style-2',
//             title: 'Style 2',
//             type : 'item',
//             url  : '/pages/pricing/style-2'
//           },
//           {
//             id   : 'style-3',
//             title: 'Style 3',
//             type : 'item',
//             url  : '/pages/pricing/style-3'
//           }
//         ]
//       },
//       {
//         id   : 'profile',
//         title: 'Profile',
//         type : 'item',
//         icon : 'person',
//         url  : '/pages/profile'
//       },
//       {
//         id   : 'search',
//         title: 'Search',
//         type : 'item',
//         icon : 'search',
//         url  : '/pages/search'
//       },
//       {
//         id   : 'faq',
//         title: 'Faq',
//         type : 'item',
//         icon : 'help',
//         url  : '/pages/faq'
//       },
//       {
//         id   : 'knowledge-base',
//         title: 'Knowledge Base',
//         type : 'item',
//         icon : 'import_contacts',
//         url  : '/pages/knowledge-base'
//       }
//     ]
//   },
//   {
//     id      : 'user-interface',
//     title   : 'User Interface',
//     type    : 'group',
//     icon    : 'web',
//     children: [
//       {
//         id   : 'forms',
//         title: 'Forms',
//         type : 'item',
//         icon : 'web_asset',
//         url  : '/ui/forms'
//       },
//       {
//         id   : 'icons',
//         title: 'Icons',
//         type : 'item',
//         icon : 'photo',
//         url  : '/ui/icons'
//       },
//       {
//         id   : 'typography',
//         title: 'Typography',
//         type : 'item',
//         icon : 'text_fields',
//         url  : '/ui/typography'
//       },
//       {
//         id   : 'helper-classes',
//         title: 'Helper Classes',
//         type : 'item',
//         icon : 'help',
//         url  : '/ui/helper-classes'
//       },
//       {
//         id      : 'page-layouts',
//         title   : 'Page Layouts',
//         type    : 'collapsable',
//         icon    : 'view_quilt',
//         children: [
//           {
//             id      : 'carded',
//             title   : 'Carded',
//             type    : 'collapsable',
//             badge   : {
//               title: '12',
//               bg   : '#525e8a',
//               fg   : '#FFFFFF'
//             },
//             children: [
//               {
//                 id   : 'full-width-1',
//                 title: 'Full Width #1',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/full-width-1'
//               },
//               {
//                 id   : 'full-width-2',
//                 title: 'Full Width #2',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/full-width-2'
//               },
//               {
//                 id   : 'full-width-tabbed-1',
//                 title: 'Full Width Tabbed #1',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/full-width-tabbed-1'
//               },
//               {
//                 id   : 'full-width-tabbed-2',
//                 title: 'Full Width Tabbed #2',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/full-width-tabbed-2'
//               },
//               {
//                 id   : 'left-sidebar-1',
//                 title: 'Left Sidebar #1',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/left-sidebar-1'
//               },
//               {
//                 id   : 'left-sidebar-2',
//                 title: 'Left Sidebar #2',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/left-sidebar-2'
//               },
//               {
//                 id   : 'left-sidebar-tabbed-1',
//                 title: 'Left Sidebar Tabbed #1',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/left-sidebar-tabbed-1'
//               },
//               {
//                 id   : 'left-sidebar-tabbed-2',
//                 title: 'Left Sidebar Tabbed #2',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/left-sidebar-tabbed-2'
//               },
//               {
//                 id   : 'right-sidebar-1',
//                 title: 'Right Sidebar #1',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/right-sidebar-1'
//               },
//               {
//                 id   : 'right-sidebar-2',
//                 title: 'Right Sidebar #2',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/right-sidebar-2'
//               },
//               {
//                 id   : 'right-sidebar-tabbed-1',
//                 title: 'Right Sidebar Tabbed #1',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/right-sidebar-tabbed-1'
//               },
//               {
//                 id   : 'right-sidebar-tabbed-2',
//                 title: 'Right Sidebar Tabbed #2',
//                 type : 'item',
//                 url  : '/ui/page-layouts/carded/right-sidebar-tabbed-2'
//               }
//             ]
//           },
//           {
//             id      : 'simple',
//             title   : 'Simple',
//             type    : 'collapsable',
//             badge   : {
//               title: '10',
//               bg   : '#525e8a',
//               fg   : '#FFFFFF'
//             },
//             children: [
//               {
//                 id   : 'full-width-1',
//                 title: 'Full Width #1',
//                 type : 'item',
//                 url  : '/ui/page-layouts/simple/full-width-1'
//               },
//               {
//                 id   : 'full-width-tabbed-1',
//                 title: 'Full Width Tabbed #1',
//                 type : 'item',
//                 url  : '/ui/page-layouts/simple/full-width-tabbed-1'
//               },
//               {
//                 id   : 'left-sidebar-1',
//                 title: 'Left Sidebar #1',
//                 type : 'item',
//                 url  : '/ui/page-layouts/simple/left-sidebar-1'
//               },
//               {
//                 id   : 'left-sidebar-2',
//                 title: 'Left Sidebar #2',
//                 type : 'item',
//                 url  : '/ui/page-layouts/simple/left-sidebar-2'
//               },
//               {
//                 id   : 'left-sidebar-3',
//                 title: 'Left Sidebar #3',
//                 type : 'item',
//                 url  : '/ui/page-layouts/simple/left-sidebar-3'
//               },
//               {
//                 id   : 'left-sidebar-4',
//                 title: 'Left Sidebar #4',
//                 type : 'item',
//                 url  : '/ui/page-layouts/simple/left-sidebar-4'
//               },
//               {
//                 id   : 'right-sidebar-1',
//                 title: 'Right Sidebar #1',
//                 type : 'item',
//                 url  : '/ui/page-layouts/simple/right-sidebar-1'
//               },
//               {
//                 id   : 'right-sidebar-2',
//                 title: 'Right Sidebar #2',
//                 type : 'item',
//                 url  : '/ui/page-layouts/simple/right-sidebar-2'
//               },
//               {
//                 id   : 'right-sidebar-3',
//                 title: 'Right Sidebar #3',
//                 type : 'item',
//                 url  : '/ui/page-layouts/simple/right-sidebar-3'
//               },
//               {
//                 id   : 'right-sidebar-4',
//                 title: 'Right Sidebar #4',
//                 type : 'item',
//                 url  : '/ui/page-layouts/simple/right-sidebar-4'
//               }
//             ]
//           },
//           {
//             id   : 'blank',
//             title: 'Blank',
//             type : 'item',
//             url  : '/ui/page-layouts/blank'
//           }
//         ]
//       },
//       {
//         id   : 'colors',
//         title: 'Colors',
//         type : 'item',
//         icon : 'color_lens',
//         url  : '/ui/colors'
//       }
//     ]
//   },
//   {
//     id      : 'angular-material-elements',
//     title   : 'Angular Material Elements',
//     type    : 'group',
//     icon    : 'layers',
//     children: [
//       {
//         id      : 'form-controls',
//         title   : 'Form Controls',
//         type    : 'collapsable',
//         icon    : 'layers',
//         children: [
//           {
//             id   : 'autocomplete',
//             title: 'Autocomplete',
//             type : 'item',
//             url  : '/angular-material-elements/autocomplete'
//           },
//           {
//             id   : 'checkbox',
//             title: 'Checkbox',
//             type : 'item',
//             url  : '/angular-material-elements/checkbox'
//           },
//           {
//             id   : 'datepicker',
//             title: 'Datepicker',
//             type : 'item',
//             url  : '/angular-material-elements/datepicker'
//           },
//           {
//             id   : 'form-field',
//             title: 'Form field',
//             type : 'item',
//             url  : '/angular-material-elements/form-field'
//           },
//           {
//             id   : 'input',
//             title: 'Input',
//             type : 'item',
//             url  : '/angular-material-elements/input'
//           },
//           {
//             id   : 'radio-button',
//             title: 'Radio button',
//             type : 'item',
//             url  : '/angular-material-elements/radio-button'
//           },
//           {
//             id   : 'select',
//             title: 'Select',
//             type : 'item',
//             url  : '/angular-material-elements/select'
//           },
//           {
//             id   : 'slider',
//             title: 'Slider',
//             type : 'item',
//             url  : '/angular-material-elements/slider'
//           },
//           {
//             id   : 'slide-toggle',
//             title: 'Slide toggle',
//             type : 'item',
//             url  : '/angular-material-elements/slide-toggle'
//           }
//         ]
//       },
//       {
//         id      : 'navigation',
//         title   : 'Navigation',
//         type    : 'collapsable',
//         icon    : 'layers',
//         children: [
//           {
//             id   : 'menu',
//             title: 'Menu',
//             type : 'item',
//             url  : '/angular-material-elements/menu'
//           },
//           {
//             id   : 'sidenav',
//             title: 'Sidebar',
//             type : 'item',
//             url  : '/angular-material-elements/sidenav'
//           },
//           {
//             id   : 'toolbar',
//             title: 'Toolbar',
//             type : 'item',
//             url  : '/angular-material-elements/toolbar'
//           }
//         ]
//       },
//       {
//         id      : 'layout',
//         title   : 'Layout',
//         type    : 'collapsable',
//         icon    : 'layers',
//         children: [
//           {
//             id   : 'badge',
//             title: 'Badge',
//             type : 'item',
//             url  : '/angular-material-elements/badge'
//           },
//           {
//             id   : 'bottom-sheet',
//             title: 'Bottom Sheet',
//             type : 'item',
//             url  : '/angular-material-elements/bottom-sheet'
//           },
//           {
//             id   : 'card',
//             title: 'Card',
//             type : 'item',
//             url  : '/angular-material-elements/card'
//           },
//           {
//             id   : 'divider',
//             title: 'Divider',
//             type : 'item',
//             url  : '/angular-material-elements/divider'
//           },
//           {
//             id   : 'elevation',
//             title: 'Elevation',
//             type : 'item',
//             url  : '/angular-material-elements/elevation'
//           },
//           {
//             id   : 'expansion-panel',
//             title: 'Expansion Panel',
//             type : 'item',
//             url  : '/angular-material-elements/expansion-panel'
//           },
//           {
//             id   : 'grid-list',
//             title: 'Grid list',
//             type : 'item',
//             url  : '/angular-material-elements/grid-list'
//           },
//           {
//             id   : 'list',
//             title: 'List',
//             type : 'item',
//             url  : '/angular-material-elements/list'
//           },
//           {
//             id   : 'stepper',
//             title: 'Stepper',
//             type : 'item',
//             url  : '/angular-material-elements/stepper'
//           },
//           {
//             id   : 'tabs',
//             title: 'Tabs',
//             type : 'item',
//             url  : '/angular-material-elements/tabs'
//           },
//           {
//             id   : 'tree',
//             title: 'Tree',
//             type : 'item',
//             url  : '/angular-material-elements/tree'
//           }
//         ]
//       },
//       {
//         id      : 'buttons-indicators',
//         title   : 'Buttons & Indicators',
//         type    : 'collapsable',
//         icon    : 'layers',
//         children: [
//           {
//             id   : 'button',
//             title: 'Button',
//             type : 'item',
//             url  : '/angular-material-elements/button'
//           },
//           {
//             id   : 'button-toggle',
//             title: 'Button toggle',
//             type : 'item',
//             url  : '/angular-material-elements/button-toggle'
//           },
//           {
//             id   : 'chips',
//             title: 'Chips',
//             type : 'item',
//             url  : '/angular-material-elements/chips'
//           },
//           {
//             id   : 'icon',
//             title: 'icon',
//             type : 'item',
//             url  : '/angular-material-elements/icon'
//           },
//           {
//             id   : 'progress-spinner',
//             title: 'Progress spinner',
//             type : 'item',
//             url  : '/angular-material-elements/progress-spinner'
//           },
//           {
//             id   : 'progress-bar',
//             title: 'Progress bar',
//             type : 'item',
//             url  : '/angular-material-elements/progress-bar'
//           }
//         ]
//       },
//       {
//         id      : 'popups-modals',
//         title   : 'Popups & Modals',
//         type    : 'collapsable',
//         icon    : 'layers',
//         children: [
//           {
//             id   : 'dialog',
//             title: 'Dialog',
//             type : 'item',
//             url  : '/angular-material-elements/dialog'
//           },
//           {
//             id   : 'snackbar',
//             title: 'Snackbar',
//             type : 'item',
//             url  : '/angular-material-elements/snackbar'
//           },
//           {
//             id   : 'tooltip',
//             title: 'Tooltip',
//             type : 'item',
//             url  : '/angular-material-elements/tooltip'
//           }
//         ]
//       },
//       {
//         id      : 'data-table',
//         title   : 'Data table',
//         type    : 'collapsable',
//         icon    : 'layers',
//         children: [
//           {
//             id   : 'paginator',
//             title: 'Paginator',
//             type : 'item',
//             url  : '/angular-material-elements/paginator'
//           },
//           {
//             id   : 'sort-header',
//             title: 'Sort header',
//             type : 'item',
//             url  : '/angular-material-elements/sort-header'
//           },
//           {
//             id   : 'table',
//             title: 'Table',
//             type : 'item',
//             url  : '/angular-material-elements/table'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id      : 'documentation',
//     title   : 'Documentation',
//     icon    : 'import_contacts',
//     type    : 'group',
//     children: [
//       {
//         id   : 'changelog',
//         title: 'Changelog',
//         type : 'item',
//         icon : 'update',
//         url  : '/documentation/changelog',
//         badge: {
//           title: '6.1.1',
//           bg   : '#EC0C8E',
//           fg   : '#FFFFFF'
//         }
//       },
//       {
//         id      : 'getting-started',
//         title   : 'Getting Started',
//         type    : 'collapsable',
//         icon    : 'import_contacts',
//         children: [
//           {
//             id   : 'introduction',
//             title: 'Introduction',
//             type : 'item',
//             url  : '/documentation/getting-started/introduction'
//           },
//           {
//             id   : 'installation',
//             title: 'Installation',
//             type : 'item',
//             url  : '/documentation/getting-started/installation'
//           }
//         ]
//       },
//       {
//         id      : 'working-with-fuse',
//         title   : 'Working with Fuse',
//         type    : 'collapsable',
//         icon    : 'import_contacts',
//         children: [
//           {
//             id   : 'server',
//             title: 'Server',
//             type : 'item',
//             url  : '/documentation/working-with-fuse/server'
//           },
//           {
//             id   : 'production',
//             title: 'Production',
//             type : 'item',
//             url  : '/documentation/working-with-fuse/production'
//           },
//           {
//             id   : 'directory-structure',
//             title: 'Directory Structure',
//             type : 'item',
//             url  : '/documentation/working-with-fuse/directory-structure'
//           },
//           {
//             id   : 'updating-fuse',
//             title: 'Updating Fuse',
//             type : 'item',
//             url  : '/documentation/working-with-fuse/updating-fuse'
//           },
//           {
//             id   : 'multi-language',
//             title: 'Multi Language',
//             type : 'item',
//             url  : '/documentation/working-with-fuse/multi-language'
//           },
//           {
//             id   : 'theme-layouts',
//             title: 'Theme Layouts',
//             type : 'item',
//             url  : '/documentation/working-with-fuse/theme-layouts'
//           },
//           {
//             id   : 'page-layouts',
//             title: 'Page Layouts',
//             type : 'item',
//             url  : '/documentation/working-with-fuse/page-layouts'
//           }
//         ]
//       },
//       {
//         id      : 'components',
//         title   : 'Components',
//         type    : 'collapsable',
//         icon    : 'import_contacts',
//         children: [
//           {
//             id   : 'cards',
//             title: 'Cards',
//             type : 'item',
//             url  : '/documentation/components/cards'
//           },
//           {
//             id   : 'countdown',
//             title: 'Countdown',
//             type : 'item',
//             url  : '/documentation/components/countdown'
//           },
//           {
//             id   : 'highlight',
//             title: 'Highlight',
//             type : 'item',
//             url  : '/documentation/components/highlight'
//           },
//           {
//             id   : 'material-color-picker',
//             title: 'Material Color Picker',
//             type : 'item',
//             url  : '/documentation/components/material-color-picker'
//           },
//           {
//             id   : 'navigation',
//             title: 'Navigation',
//             type : 'item',
//             url  : '/documentation/components/navigation'
//           },
//           {
//             id   : 'search-bar',
//             title: 'Search Bar',
//             type : 'item',
//             url  : '/documentation/components/search-bar'
//           },
//           {
//             id   : 'sidebar',
//             title: 'Sidebar',
//             type : 'item',
//             url  : '/documentation/components/sidebar'
//           },
//           {
//             id   : 'shortcuts',
//             title: 'Shortcuts',
//             type : 'item',
//             url  : '/documentation/components/shortcuts'
//           },
//           {
//             id   : 'widget',
//             title: 'Widget',
//             type : 'item',
//             url  : '/documentation/components/widget'
//           }
//         ]
//       },
//       {
//         id      : '3rd-party-components',
//         title   : '3rd Party Components',
//         type    : 'collapsable',
//         icon    : 'import_contacts',
//         children: [
//           {
//             id      : 'datatables',
//             title   : 'Datatables',
//             type    : 'collapsable',
//             children: [
//               {
//                 id   : 'ngxdatatable',
//                 title: 'ngx-datatable',
//                 type : 'item',
//                 url  : '/documentation/components-third-party/datatables/ngx-datatable'
//               }
//             ]
//           },
//           {
//             id   : 'google-maps',
//             title: 'Google Maps',
//             type : 'item',
//             url  : '/documentation/components-third-party/google-maps'
//           }
//         ]
//       },
//       {
//         id      : 'directives',
//         title   : 'Directives',
//         type    : 'collapsable',
//         icon    : 'import_contacts',
//         children: [
//           {
//             id   : 'fuse-if-on-dom',
//             title: 'fuseIfOnDom',
//             type : 'item',
//             url  : '/documentation/directives/fuse-if-on-dom'
//           },
//           {
//             id   : 'fuse-inner-scroll',
//             title: 'fuseInnerScroll',
//             type : 'item',
//             url  : '/documentation/directives/fuse-inner-scroll'
//           },
//           {
//             id   : 'fuse-mat-sidenav',
//             title: 'fuseMatSidenav',
//             type : 'item',
//             url  : '/documentation/directives/fuse-mat-sidenav'
//           },
//           {
//             id   : 'fuse-perfect-scrollbar',
//             title: 'fusePerfectScrollbar',
//             type : 'item',
//             url  : '/documentation/directives/fuse-perfect-scrollbar'
//           }
//         ]
//       },
//       {
//         id      : 'services',
//         title   : 'Services',
//         type    : 'collapsable',
//         icon    : 'import_contacts',
//         children: [
//           {
//             id   : 'config',
//             title: 'Config',
//             type : 'item',
//             url  : '/documentation/services/config'
//           },
//           {
//             id   : 'splash-screen',
//             title: 'Splash Screen',
//             type : 'item',
//             url  : '/documentation/services/splash-screen'
//           }
//         ]
//       }
//     ]
//   }
//
// ];
