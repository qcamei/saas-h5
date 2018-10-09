// views/comComp/picker/time/halfHourPicker.js
const HalfHourService = require('./halfHourService.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timeValue: {
      type: String,
      value: '',
      observer: '_selectedTimeChange'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rangeArr: HalfHourService.getRangeArr(),
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindTimeChange: function (e) {
      var myEventDetail = e // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('timeChange', myEventDetail, myEventOption);
    },

    _selectedTimeChange: function (newValue, oldValue) {
      console.log(newValue + '---------' + oldValue)
    }
  }
})
