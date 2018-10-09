// views/appointment/comps/appointmentComp/appointmentComp.js
const AppointmentService = require('../appointmentcomp/appointmentService.js');
const Router = require('../../../../common/Router.js');
const AppUtils = require('../../../../common/AppUtils.js');
const AppointmentData = require('../../../../bs/appointmentdata/appointmentData.js');
const StoreSerivce = require('../../store/storeService.js');
const SessionUtils = require('../../../../common/SessionUtils.js')
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        // appoint:'appointmentView'
        cellModels: AppointmentService.getViewModel(),
        dateModel: AppointmentService.getInitDate(),
        timeRange: AppointmentService.getTimeRangeArr(),
        timeValue: AppointmentService.getTimeValue()
    },

    attached: function () {
        var service = this;
        var dataCallBack = function () {
            service.setData({
                cellModels: AppointmentService.getViewModel()
            })
        }
        StoreSerivce.getStore(dataCallBack);
    },
    /**
     * 组件的方法列表
     */

    methods: {
        appointClick: function (e) {
      
            if (SessionUtils.getAccessToken()) {
                var appointCallBack = function () {
                    Router.goAppointSuccessPage();
                }
                var app = getApp();
                app.globalData.formid = e.detail.formId;
                AppointmentService.addAppointment(appointCallBack);
            } else {
                Router.goLoginPage();
            }
        },
        refreshData: function () {
            this.setData({
                cellModels: AppointmentService.getViewModel()
            })
        },
        bindDateChange: function (e) {
            console.log(AppUtils.getDate());
            if (e.detail.value < AppUtils.getDate()) {
                e.detail.value = AppUtils.getDate();
            }
            AppointmentData.getInstance().appointmentDate = e.detail.value;
            this.setData({
                cellModels: AppointmentService.getViewModel(),
                timeRange: AppointmentService.getTimeRangeArr(),
                timeValue: AppointmentService.getTimeValue()
            })
        },
        bindTimeChange: function (e) {
            debugger
            AppointmentData.getInstance().appointmentTime = AppointmentService.getTimeRangeArr()[e.detail.value];
            var time = AppointmentData.getInstance().appointmentTime ;
            var arr = AppointmentService.getTimeRangeArr();
            this.setData({
                cellModels: AppointmentService.getViewModel()
            })
        },


        cellClick: function (e) {
          
            var cellModel = e.detail;
            console.log(JSON.stringify(cellModel));
            switch (cellModel.cellID) {
                case 1: {
                    if(SessionUtils.getAccessToken()){
                    Router.goStoreList();
                    console.log(cellModel.title);
                    }else {
                        Router.goLoginPage();
                    }
                    break
                }
                case 2: {
                    console.log(cellModel.title);
                    break
                }
                case 3: {

                    console.log(cellModel.title);
                    break
                }
                case 4: {
                    if(SessionUtils.getAccessToken()) {
                        Router.goProductPage();
                        console.log(cellModel.title);
                    }else {
                        Router.goLoginPage();
                    }
                    break
                }
                case 5: {
                    if(SessionUtils.getAccessToken()) {
                        Router.goBeaticianFromAppoint();
                        console.log(cellModel.title);
                    }else {
                        Router.goLoginPage();
                    }
                    break
                }
            }
        }
    }
})
