Component({
    /**
     * 组件的属性列表
     */
    properties: {
        disabled:{type:Boolean,value:false},
        name:{type:String}
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
        onTap: function(){
            var myEventDetail = {} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            this.triggerEvent('zmTap', myEventDetail, myEventOption)
        }
    }
})
