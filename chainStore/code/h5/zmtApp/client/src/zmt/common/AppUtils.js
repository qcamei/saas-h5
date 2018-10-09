var AppUtils = new function() {
    var service = this;

    service.copy=function(toObj, fromObj, propName){
        if(fromObj[propName]){
            toObj[propName] = fromObj[propName];
        }

    };

    service.format = function(target, args) {
        var result = target;
        if (args.length > 0) {
            if (args.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    if(args[key]!=undefined){
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            } else {
                for (var i = 0; i < args.length; i++) {
                    if (args[i] != undefined) {
                        var reg= new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, args[i]);
                    }
                }
            }
        }
        return result;
    };

    service.enum = function(namesToValues) {
        var enumItem = {};
        enumItem.items = [];
        for(var name in namesToValues){
            var itemTmp = {};
            itemTmp.name = name;
            itemTmp.value = namesToValues[name];

            enumItem[name] = itemTmp;
            enumItem.items.push(itemTmp);
        }


        enumItem.valueOf = function(intType){
            var target = {};
            var itemsArray = enumItem.items;
            for(var index in itemsArray){

                if(itemsArray[index].value == intType){
                    target = itemsArray[index];
                    break;
                }
            }
            return target;
        };
        return enumItem;
    };

    service.newMap = function (){
        return new Map();
    };

    //私有
    function Map (){
        /** Map size **/
        var size = 0;
        /** object **/
        var entry = new Object();

        /** put one entry **/
        this.put = function (key , value)
        {
            if(!this.containsKey(key))
            {
                size ++ ;
            }
            entry[key] = value;
        }

        /** get one key **/
        this.get = function (key)
        {
            return this.containsKey(key) ? entry[key] : null;
        }

        /** remove one key **/
        this.remove = function ( key )
        {
            if( this.containsKey(key) && ( delete entry[key] ) )
            {
                size --;
            }
        }

        /** check if contains Key **/
        this.containsKey = function ( key )
        {
            return (key in entry);
        }

        /** check if contains Value **/
        this.containsValue = function ( value )
        {
            for(var prop in entry)
            {
                if(entry[prop] == value)
                {
                    return true;
                }
            }
            return false;
        }

        /** All Value **/
        this.values = function ()
        {
            var values = new Array();
            for(var prop in entry)
            {
                values.push(entry[prop]);
            }
            return values;
        }

        /** all Key **/
        this.keys = function ()
        {
            var keys = new Array();
            for(var prop in entry)
            {
                keys.push(prop);
            }
            return keys;
        }

        /** Map Size **/
        this.size = function ()
        {
            return size;
        }

        /* clear */
        this.clear = function ()
        {
            size = 0;
            entry = new Object();
        }

    };

};

