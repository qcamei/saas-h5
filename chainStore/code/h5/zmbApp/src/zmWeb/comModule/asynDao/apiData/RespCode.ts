export enum RespCode{
  OK = 200, //服务器成功返回用户请求的数据，该操作是幂等的。
  CREATED = 201,// [POST/PUT]：用户新建或修改数据成功。
  NO_CONTENT = 204, //[DELETE]：用户删除数据成功。
  INVALID_REQUEST = 400,// [POST/PUT]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
  UN_AUTHORIZED = 401,//用户发出的请求未授权，该操作是幂等的。
  SESSION_EXPIRED = 402,//session 过期。
  NOT_FOUND = 404,//用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
  INTERNAL_SERVER_ERROR = 500,//服务器发生错误，用户将无法判断发出的请求是否成功。
}
