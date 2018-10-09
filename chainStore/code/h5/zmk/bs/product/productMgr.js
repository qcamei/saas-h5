const ProductDAO = require('./productDAO.js')
var ProductMgr = new function(){
var service = this;
service.get = function (id, objCallback) {
  ProductDAO.get(id, objCallback);
}

}
module.exports = ProductMgr;