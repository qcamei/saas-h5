Component({

  /**
     * 组件的属性列表
     */
  properties: {
    title: {
      type: String,
      value: 'dsadsad'
    },
    reasonable: {
      type: Boolean,
      value: false
    },
    countdownCount: {
      type: Number,
      value: 60
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
    title: '',
    reasonable: false,
    countdownCount: 60,
    verifyClick: false
  },

  /**
     * 组件的方法列表
     */
  methods: {
    clickEvent: function (e) {
      console.log(e);
      var myEventDetail = e // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('clickEvent', myEventDetail, myEventOption);
    },


    //点击获取验证码按钮
    clickVerifyButton: function (e) {
      let that = this;
      let status = that.data.verifyClick;
      if (!that.data.reasonable) {
        return;
      }
      if (!status) {
        that.setData({ verifyClick: true });
        let timeFnc = setInterval(function () {
          let time = that.data.CountdownCount - 1;
          that.setData({ CountdownCount: time });
          if (time == 0) {
            that.setData({ CountdownCount: 60 });
            that.setData({ verifyClick: false });
            clearInterval(timeFnc);
          }
        }, 1000);
      }
    }
  }

});