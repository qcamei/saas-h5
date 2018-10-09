var AppUtils = new function () {
  var service = this;

  service.fromJson = function (jsonData) {
    var postData = JSON.parse(jsonData);
    return postData;
  };
  service.toJson = function (itemObj) {
    var postData = JSON.stringify(itemObj);
    return postData;
  };

  service.forEach = function (tmpArray, func) {
    var length = tmpArray.length;
    for (var index = 0; index < length; index++) {
      var itemTmp = tmpArray[index];
      func(index, itemTmp);
    }
  };
  service.isBlank = function (input) {
    var isblank = (input == null || input == undefined || input == '');
    return isblank;
  };


  service.format = function (target, args) {
    var result = target;
    if (args.length > 0) {
      if (args.length == 1 && typeof (args) == "object") {
        for (var key in args) {
          if (args[key] != undefined) {
            var reg = new RegExp("({" + key + "})", "g");
            result = result.replace(reg, args[key]);
          }
        }
      } else {
        for (var i = 0; i < args.length; i++) {
          if (args[i] != undefined) {
            var reg = new RegExp("({)" + i + "(})", "g");
            result = result.replace(reg, args[i]);
          }
        }
      }
    }
    return result;
  };

  service.enum = function (namesToValues) {
    var enumItem = {};
    enumItem.items = [];
    for (var name in namesToValues) {
      var itemTmp = {};
      itemTmp.name = name;
      itemTmp.value = namesToValues[name];

      enumItem[name] = itemTmp;
      enumItem.items.push(itemTmp);
    }
    // enumItem:{items:[{name:cuser,value:0}],cuser:{name:cuser,value:0}}

    enumItem.valueOf = function (intType) {
      var target = {};
      var itemsArray = enumItem.items;
      for (var index in itemsArray) {

        if (itemsArray[index].value == intType) {
          target = itemsArray[index];
          break;
        }
      }
      return target;
    };
    return enumItem;
  };

  service.newMap = function () {
    return new Map();
  };

  service.newReqMap = function () {
    return new ReqMap();
  };

  service.getDate = function () {
    //获取当前时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    var monthStr = String(date.getMonth() + 1);
    var dayStr = date.getDate().toString();
    if (monthStr.length == 1) {
      monthStr = '0' + monthStr;
    }
    if (dayStr.length == 1) {
      dayStr = '0' + dayStr;
    }
    return date.getFullYear().toString() + '-' + monthStr + '-' + dayStr;
  }
  service.getTime = function () {
    //获取当前时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    var hours = date.getHours();
    var minuts = date.getMinutes();
    var minutsStr = minuts.toString();
    if (minuts >= 0 && minuts < 30) {
      minutsStr = '30';
    } else {
      minutsStr = '00';
      //此处有bug  如若在23-24时，日期应该+1，此处未做处理
      hours++;
    }
    return hours.toString() + ':' + minutsStr;
  }
  service.getFormatDate = function (timestamp, full) {
    var date = new Date(parseInt(timestamp));
    var monthStr = String(date.getMonth() + 1);
    var dayStr = date.getDate().toString();
    if (monthStr.length == 1) {
      monthStr = '0' + monthStr;
    }
    if (dayStr.length == 1) {
      dayStr = '0' + dayStr;
    }
    var dateStr = date.getFullYear().toString() + '-' + monthStr + '-' + dayStr;
    if (full) {
      var hoursStr = date.getHours().toString();
      var minutesStr = date.getMinutes().toString();
      var secondStr = date.getSeconds().toString();
      if (hoursStr < 10) {
        hoursStr = "0" + hoursStr;
      }
      if (minutesStr < 10) {
        minutesStr = "0" + minutesStr;
      }
      if (secondStr < 10) {
        secondStr = "0" + secondStr;
      }
      dateStr += ' ' + hoursStr + ":" + minutesStr + ':' + secondStr;
    }
    return dateStr;
  }

  //sleep方法，阻塞线程
  service.sleep = function (numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
    }
  }

  function ReqMap() {

    var map = new Map();

    this.add = function (key, value) {
      // if (key && value) {
      //   map.put(key, value);
      // }
      if (key && value != undefined) {
        map.put(key, value);
      }
      return this;
    }

    this.toReqParam = function () {
      var keys = map.keys();
      var reqParam = "";
      for (var i = 0; i < keys.length; i++) {
        var keyTmp = keys[i];
        var value = map.get(keyTmp);
        reqParam = reqParam + keyTmp + "=" + value + "&";
      }
      return reqParam;
    }
  };


  //私有
  function Map() {
    /** Map size **/
    var size = 0;
    /** object **/
    var entry = new Object();

    /** put one entry **/
    this.put = function (key, value) {
      if (!this.containsKey(key)) {
        size++;
      }
      entry[key] = value;
    }

    /** get one key **/
    this.get = function (key) {
      return this.containsKey(key) ? entry[key] : null;
    }

    /** remove one key **/
    this.remove = function (key) {
      if (this.containsKey(key) && (delete entry[key])) {
        size--;
      }
    }

    /** check if contains Key **/
    this.containsKey = function (key) {
      return (key in entry);
    }

    /** check if contains Value **/
    this.containsValue = function (value) {
      for (var prop in entry) {
        if (entry[prop] == value) {
          return true;
        }
      }
      return false;
    }

    /** All Value **/
    this.values = function () {
      var values = new Array();
      for (var prop in entry) {
        values.push(entry[prop]);
      }
      return values;
    }

    /** all Key **/
    this.keys = function () {
      var keys = new Array();
      for (var prop in entry) {
        keys.push(prop);
      }
      return keys;
    }

    /** Map Size **/
    this.size = function () {
      return size;
    }

    /* clear */
    this.clear = function () {
      size = 0;
      entry = new Object();
    }

  };


  service.ObjUtils = new function () {

    var objUtils = this;
    objUtils.copy = function (toObj, fromObj, propName) {
      if (fromObj[propName]) {
        toObj[propName] = fromObj[propName];
      }
    };
  };

  service.Alert = new function () {
    var alertAgent = this;

    alertAgent.info = function (message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    };
    alertAgent.success = function (message) {
      wx.showToast({
        title: message,
        icon: 'success',
        duration: 2000
      })
    };
    alertAgent.error = function (message, title) {
      wx.showToast({
        title: message,
        icon: 'fail',
        duration: 2000
      })
    };
    alertAgent.warning = function (message, title) {
      wx.showToast({
        title: message,
        icon: 'fail',
        duration: 2000
      })
    };
  }

};

module.exports = AppUtils;
