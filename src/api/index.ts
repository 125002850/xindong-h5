import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ResultData } from './interfaces'
import type { CustomAxiosRequestConfig } from './utils/cancel'
import axios from 'axios'
import { showNotify } from 'vant'
import useGlobalStore from '~/stores/global'
import useUserStore from '~/stores/user'
import { AxiosCanceler } from './utils/cancel'
import { config, ResultEnum } from './utils/config'

export * from './interfaces'

const axiosCanceler = new AxiosCanceler()

export class RequestHttp {
  service: AxiosInstance

  public constructor(config: AxiosRequestConfig) {
    // instantiation
    this.service = axios.create(config)

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        const userStore = useUserStore()
        const globalStore = useGlobalStore()
        const { globalLoading } = storeToRefs(globalStore)

        // // 重复请求不需要取消，在 api 服务中通过指定的第三个参数: { cancel: false } 来控制
        // config.cancel ??= true
        // config.cancel && axiosCanceler.addPending(config)
        // // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { loading: false } 来控制
        // config.loading ??= true
        config.loading && (globalLoading.value = true)
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('token', userStore.token)
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
        const { data, config } = response

        const globalStore = useGlobalStore()
        const userStore = useUserStore()

        const { token } = storeToRefs(userStore)
        const { globalLoading } = storeToRefs(globalStore)

        // axiosCanceler.removePending(config)
        config.loading && (globalLoading.value = false)
        // 登录失效
        if (data.code === ResultEnum.OVERDUE) {
          token.value = ''
          userStore.logout()
          showMsg(data.msg)
          return Promise.reject(data)
        }
        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          showNotify({
            message: data.msg,
            type: 'danger',
          })
          return Promise.reject(data)
        }
        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data
      },
      async (error: AxiosError) => {
        const globalStore = useGlobalStore()
        const { globalLoading } = storeToRefs(globalStore)
        // const { response } = error
        globalLoading.value = false
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.includes('timeout'))
showNotify({ message: '请求超时！请您稍后重试', type: 'danger' })
        if (error.message.includes('Network Error'))
showNotify({ message: '网络错误！请您稍后重试', type: 'danger' })
        // 根据服务器响应的错误状态码，做不同的处理
        // if (response) checkStatus(response.status)
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        // if (!window.navigator.onLine) router.replace('/500')
        return Promise.reject(error)
      },
    )
  }

  /**
   * @description 常用请求方法封装
   */
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object })
  }

  post<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object)
  }

  put<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object)
  }

  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object })
  }

  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: 'blob' })
  }
}

export const http = new RequestHttp(config)
