var smsData = new function() {

  var server = this;

  server.newRandomCodeAPIForm = new function() {
    return new RandomCodeAPIForm();
  }

  function RandomCodeAPIForm() {
    this.phoneNumber = null;
  }

}

module.exports = smsData;