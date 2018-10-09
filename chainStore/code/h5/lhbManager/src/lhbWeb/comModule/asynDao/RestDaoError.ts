
class BaseError {
  constructor () {
    Error.apply(this, arguments);
  }
}

BaseError.prototype = new Error();

export  class RestDaoError extends BaseError {
  constructor (public code:number, public tips: string,public oriError:Error) {
    super();
  }

}


