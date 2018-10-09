var BossIdData = function(){
  var bossId = null;
  var instance = null;
}
 BossIdData.getInstance = function(){
   if (!this.instance){
     this.instance = new BossIdData();
   }
   return this.instance;
}
module.exports = BossIdData;