/* eslint-disable ts/no-namespace */
export const DEFAULT_PAGE: ReqPage = {
  currPage: 0,
  pageNum: 9999,
}

// 请求响应参数（不包含data）
export interface Option {
  label: string
  value: string | number
}

export interface CommonVo {
  id: string
  createDate: string
  createUser: string
  updateDate: string
  updateUser: string
}
export interface Result {
  code: string
  msg: string
}

export interface Image {
  url: string
  isMain: number // 0 否 1 是
  sort: number
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T
}

// 分页响应参数
export interface ResPage<T> {
  list: T[]
  currPage: number
  pageNum: number
  total: number
}

// 分页请求参数
export interface ReqPage {
  currPage: number
  pageNum: number
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    code?: string
    openid?: string
  }
  export interface ResLogin {
    token?: string
    shopId?: string
    shopName?: string
    username?: string
    phone?: string
    gender?: number
    admin?: boolean
    userType?: number
  }

  export interface Registration {
    openid: string
    // phone: string
    shopId: string
    username: string
    userType: string
  }

  export interface ResAuthButtons {
    [key: string]: string[]
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string
    gender: number
    idCard: string
    email: string
    address: string
    createTime: string[]
    status: number
  }

  export interface Dto extends ReqPage {
    shopId?: string
    username?: string
  }

  export interface Vo extends CommonVo {
    gender: number
    openid: string
    shopId: string
    username: string
    userType: string
    applyContent: string
    picture: string
    status?: number
  }

  export interface ApprovalDto {
    status: string
    openid?: string
  }

  export interface ApprovalVo extends CommonVo {
    openid: string
    phone: string
    pictureUrl: string
    shopId: string
    status: number
    username: string
  }

  export interface applyUserDto extends ReqPage {
    search?: string
    status?: string
  }
}

// 店铺模型
export namespace Shop {
  export interface Vo extends CommonVo {
    shopName: string
  }
}

// biz模型
export namespace Biz {
  export enum CheckStatus {
    PENDING = 'PENDING',
    PASS = 'PASS',
    REJECT = 'REJECT',
  }

  export interface submitDto {
    applyDate: string
    applyContent: string
    shopId: string
  }

  export interface LeaveVo extends CommonVo {
    date: string
    shopId: string
    username: string
    status: CheckStatus
    openid: string
    applyContent: string
  }

  export interface LeaveRuleVo extends CommonVo {
    shopId: number
    day: number
    maxUserNum: number
    label: string
  }

  export interface LeaveRuleDto {
    days: number[]
    maxUserNum: number
  }

  export interface CreateTemplateDto {
    shopId: string
    date: string
  }

  export interface TemplateDto {
    date: string
    shopId: string
  }

  export interface TemplateVo extends CommonVo {
    dateMoon: string
    maxUserNum: number
    shopId: string
    date: number
  }

  export interface LeaveApprovalDto {
    status: string
    id: string
  }

  export interface LeaveCountVo {
    num: number
    remainingTotal: number
    total: number
    status: 'LEAVE' | 'WITHDRAW'
  }
}
