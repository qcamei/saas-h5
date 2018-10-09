var StoreApiData = new function(){
  var service = this;
  service.newStore = function(){
return new Store();
  }
  function Store(){
    this.id = null;
    this.bossId = null;
    this.name = null;
    this.clerkInfoId = null;
    this.createdTime = null;
    this.lastUpdateTime = null;
  }
  service.newJoinStoreForm = function(){
    return new JoinStoreForm();
  }
  function JoinStoreForm(){
    this.storeId = null;
  }
}
module.exports = StoreApiData;