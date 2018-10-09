// views/appointment/comps/scanCodeComp/scanCodeComp.js
const SessionUtils = require('../../../../common/SessionUtils.js')
const AppointmentData = require('../../../../bs/appointmentdata/appointmentData.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    /**
     * 扫描二维码按钮点击
     */
    scanBtnClick: function (e) {
     console.log(e);
      wx.scanCode({
        scanType: ['qrCode'],
        success: (res) => {
            //此处需要解析扫到的数据
            //二维码规则zhimeitong_1_storeId
            var resultData = res.result;
            var resultArr = resultData.split('_');
            if(resultArr.length==3 && resultArr[0]=='zhimeitong'){
              AppointmentData.getInstance().storeId = resultArr[2];
              SessionUtils.setStoreId(resultArr[2]);
            }else{
              AppointmentData.getInstance().storeId = null;

            }
          
         this.triggerEvent('myevent');
        },
        fail: (err) => {

        }
      })
    },
  }
})
