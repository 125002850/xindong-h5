import type { InternalAxiosRequestConfig } from 'axios'
import qs from 'qs'

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean
  cancel?: boolean
}

// 声明一个 Map 用于存储每个请求的标识和取消函数
const pendingMap = new Map<string, AbortController>()

// 序列化参数，确保对象属性顺序一致
function sortedStringify(obj: any) {
  return qs.stringify(obj, { arrayFormat: 'repeat', sort: (a, b) => a.localeCompare(b) })
}

// 获取请求的唯一标识
export function getPendingUrl(config: CustomAxiosRequestConfig) {
  return [config.method, config.url, sortedStringify(config.data), sortedStringify(config.params)].join('&')
}

export class AxiosCanceler {
  /**
   * @description: 添加请求
   * @param {object} config
   * @return void
   */
  addPending(config: CustomAxiosRequestConfig) {
    // 在请求开始前，对之前的请求做检查取消操作
    this.removePending(config)
    const url = getPendingUrl(config)
    const controller = new AbortController()
    config.signal = controller.signal
    pendingMap.set(url, controller)
  }

  /**
   * @description: 移除请求
   * @param {object} config
   */
  removePending(config: CustomAxiosRequestConfig) {
    const url = getPendingUrl(config)
    // 如果在 pending 中存在当前请求标识，需要取消当前请求并删除条目
    const controller = pendingMap.get(url)
    if (controller) {
      controller.abort()
      pendingMap.delete(url)
    }
  }

  /**
   * @description: 清空所有pending
   */
  removeAllPending() {
    pendingMap.forEach((controller) => {
      controller && controller.abort()
    })
    pendingMap.clear()
  }
}
