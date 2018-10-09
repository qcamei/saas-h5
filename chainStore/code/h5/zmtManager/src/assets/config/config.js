var config = {
  data:{
    "serviceAddress":"http://192.168.40.220/storems/ws/v1",
    "orderServiceAddress":"http://192.168.40.220/orderms/ws/v1",
    "imgPreUrl":"http://192.168.40.220:9116/"
  },

  getServiceAddress:function(){
    return this.data.serviceAddress;
  },

  getOrderServiceAddress:function(){
    return this.data.orderServiceAddress;
  },

  getImgPreUrl:function(){
    return this.data.imgPreUrl;
  }
};
