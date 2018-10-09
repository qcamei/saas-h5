// views/comComp/tab/zmTabComp.js

const zmTabCompService = require('./zmTabCompService.js');

Component({
  /**
   * 组件的属性列表
   */
  options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  properties: {
      tabNames:{type:String},
      initTab:{type:String}
  },

  /**
   * 组件的初始数据 tabItem:{name,selected}
   */
  data: {
      tabList:Array,
      curTab:{}
  },

  attached: function(){

    var tabNamesTmp = this.properties.tabNames;
    var initTabTmp = this.properties.initTab;
    var tabListTmp = zmTabCompService.getTabList(tabNamesTmp,initTabTmp);
    var curTabTmp = zmTabCompService.getCurTab(tabListTmp);

    this.setData({
        tabList: tabListTmp,
        curTab:curTabTmp
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
      onTap:function(event){
          var selectedTab =  event.currentTarget.dataset.tab;
          var tabListTmp = this.data.tabList;
          var curTabTmp = zmTabCompService.selectedTab(tabListTmp,selectedTab.name);
          console.log(curTabTmp);

          this.setData({
              tabList: tabListTmp,
              curTab:curTabTmp
          })
      },
      bindChange:function(event){


          var curTabOri = this.data.curTab;
          //curItemId 就是 tabName
          var curItemId = event.detail.currentItemId;
          if(curItemId!=curTabOri.name){
              var tabListTmp = this.data.tabList;
              var curTabTmp = zmTabCompService.selectedTab(tabListTmp,curItemId);
              this.setData({
                  tabList: tabListTmp,
                  curTab:curTabTmp
              })
          }


          console.log(curItemId);
      }

  }
});

