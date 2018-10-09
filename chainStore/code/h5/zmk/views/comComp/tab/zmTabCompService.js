const AppUtils = require('../../../common/AppUtils.js');


var zmTabCompService = new function () {
    var service = this;

    service.getTabList = function (tabNames, selectedTab) {
        var tabArray = tabNames.split(",");
        var tabListTmp = new Array();
        AppUtils.forEach(tabArray, function (index, tabNameItem) {

            console.log(index+" "+tabNameItem+" "+selectedTab);
            var selected = false;
            if (AppUtils.isBlank(selectedTab) && index == 0) {
                selected = true;
            } else if ((tabNameItem == selectedTab)) {
                selected = true;
            }
            tabListTmp.push(new tabItem(tabNameItem, selected));
        });
        return tabListTmp;
    };

    service.getCurTab = function (tabList) {
        var curTab = {};
        AppUtils.forEach(tabList, function (index, tabItem) {
            if(tabItem.selected){
                curTab = tabItem;
            }
        });
        return curTab;
    };

    service.selectedTab = function (tabList,selectedTabName) {

        AppUtils.forEach(tabList, function (index, tabItem) {
            if(selectedTabName == tabItem.name){
                tabItem.selected = true;
            }else{
                tabItem.selected = false;
            }
        });
        var curTab = this.getCurTab(tabList);
        return curTab;
    };


}

function tabItem(nameP,selectedP) {
    this.name = nameP;
    this.selected = selectedP;
}
module.exports = zmTabCompService;