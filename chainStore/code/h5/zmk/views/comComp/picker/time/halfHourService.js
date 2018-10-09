var HalfHourServie = new function () {
  var that = this;
  that.getRangeArr = function () {
    var rangeArr = new Array();
    for (var i = 9; i <= 21; i++) {
      for (var j = 0; j < 2; j++) {
        var minuts;
        if (j == 0) {
          minuts = '00';
        } else {
          minuts = '30';
        }
        rangeArr.push(i.toString() + ':' + minuts);
      }
    }
    return rangeArr;
  }
}
module.exports = HalfHourServie;