Component({

  /**
     * 组件的属性列表
     */
  properties: {
    title: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
    },
    needVerify: {
      type: Boolean,
      value: false
    },
    verifyClick: {
      type: Boolean,
      value: false
    }
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
    clickEvent: function (e) {
      var myEventDetail = e // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('clickEvent', myEventDetail, myEventOption);
    }
  }

});