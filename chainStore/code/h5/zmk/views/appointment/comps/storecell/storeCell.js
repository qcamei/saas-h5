// views/appointment/comps/storecell/storeCell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      cellModel:Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cellClick: function (e) {
      var myEventDetail = e.currentTarget.dataset.cellmodel // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('cellclick', myEventDetail, myEventOption);
    }
  }
})
