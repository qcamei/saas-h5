// views/comComp/picker/date/datePicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dateModel: Object
  },
/**
 * 组件关系
 */
  // relations:{
  //   '/views/appointment/comps/appointmentcell/appointmentCell': {
  //     type: 'child', // 关联的目标节点应为子节点
  //     linked: function (target) {
  //       debugger
  //     }
  //   }
  // },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindDateChange: function (e) {
      var myEventDetail = e.detail // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('dateChange', myEventDetail, myEventOption);
    }
  }
})
