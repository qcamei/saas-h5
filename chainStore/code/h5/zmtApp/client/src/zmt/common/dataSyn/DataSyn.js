var DataSyn = new function () {
    var service = this;

    service.DataSynVerCtrl = function () {

        var synVerCtrl = this;
        var DATA_SYN_REQ = "dsReq";
        var ownerId;

        //map<intSynType,DataSynItem>
        var map = Utils.newMap();

        synVerCtrl.setOwnerId = function (ownerIdP) {
            ownerId = ownerIdP;
        };

        synVerCtrl.put = function(dataSynItem){

            dataSynItem.dataObj = angular.fromJson(dataSynItem.data);
            map.put(dataSynItem.id, dataSynItem);
        };

        synVerCtrl.get = function(intSynType){

            var dataSynItem = map.get();
            return dataSynItem;

        };

        synVerCtrl.getVerList = function(){
            var verList = map.values();
            return verList;
        };

        //DataSynClass.DataSynResp
        synVerCtrl.synData = function(dataSynResp){

            //DataSynItem
            for(var itemTmp in dataSynResp.itemList){
                synVerCtrl.put(itemTmp);
            }

        };
        synVerCtrl.addVerInfo = function(req){
            var dataSynVerInfo = service.DataSynClass.DataSynVerInfo();
            dataSynVerInfo.ownerId = ownerId;
            dataSynVerInfo.synVerList = synVerCtrl.getVerList();

            var verInfoTmp = angular.toJSON(dataSynVerInfo,true);

            req.setRequestHeader(DATA_SYN_REQ, verInfoTmp);
        };

        synVerCtrl.clear = function(){
            map.clear();
        };

        synVerCtrl.synData = function(restResp) {
            var respJson = restResp.dsResp;
            //DataSynResp
            var dataSynResp =  angular.fromJson(respJson);
            synVerCtrl.synData(dataSynResp);
        };

    };

    service.DataSynClass = function (){

        var synClass = this;

        // //(DataSynVer oldSynVer,long newVerP, String dataP)
        // synClass.newDataSynItem = function (oldSynVer,newVerP, dataP) {
        //     var synType = oldSynVer.synType;
        //     var id = oldSynVer.id;
        //     var synVer = new synClass.DataSynVer(synType, id, newVerP);
        //     var synItem = new synClass.DataSynItem(synVer,dataP);
        //     return synItem;
        // };

        synClass.DataSynResp = function () {
            // private String ownerId;
            // private List<DataSynItem> itemList;
            this.ownerId = null;
            this.itemList = [];

        };

        synClass.DataSynItem = function (synVerP,dataP){
            // DataSynVer synVer;
            // String data;

            this.synVer = synVerP;
            this.data = dataP;
        };

        synClass.DataSynVerInfo = function () {
            // private String ownerId;
            // private List<DataSynVer> synVerList = new ArrayList<DataSynVer>();
            this.ownerId = null;
            this.synVerList = [];

        };

        synClass.DataSynVer = function (synTypeP, idP, verP){
            // private int synTypeEnum;
            // private String id;
            // private long ver;

            this.synType = synTypeP;
            this.id=idP;
            this.ver=verP;
        };

        synClass.DataSynType = Utils.enum({
            CUser:0,
            Store:1,
            Order:2,
            BUser:3,
            StoreClerkInfo:4,
            OPUser:5,
            StoreLeaguerInfo:6,
            Appointment:7,
            StoreBeauticianInfo:8,
            StoreProductInfo:9,
            Message:10,
            StoreMaterialInfo:11,
            MaterialRecords:12,
            SpecialData:13,
            ClerkSalary:14,
            StoreCardInfo:15,
            LeaguerAffair:16,
            CardRecord:17,
            MaterialReport:18,
            OrderReport:19,
            OrderComment:20,
            BeauticianProduct:21
        });
    };
};


