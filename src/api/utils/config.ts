/**
 * @description：请求配置
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  OVERDUE = 401,
  TIMEOUT = 30000,
  TYPE = 'success',
}

/**
 * @description：请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description：常用的 contentTyp 类型
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // text
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data 上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

const baseURL = import.meta.env.VITE_APP_API

export const config = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL,
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
}
