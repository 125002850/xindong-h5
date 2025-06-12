import type { Biz, Shop } from '..'
import { http } from '..'

export function fetchLeaveList(date: string, shopId: string) {
  return http.post<Biz.LeaveVo[]>(`/holiday/${shopId}/queryLeaves`, date, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function fetchLeaveSubmit(params: Biz.submitDto) {
  return http.post<boolean>(`/holiday/submit`, params)
}

export function fetchLeaveRulesUpdate(shopId: string, params: Biz.LeaveRuleDto[]) {
  return http.post<boolean>(`/holiday/rule/config/update/${shopId}`, params)
}

export function fetchLeaveRules(shopId: string) {
  return http.get<Biz.LeaveRuleVo[]>(`/holiday/rule/config/query/${shopId}`)
}

export function fetchLeaveApproval(params: Biz.LeaveApprovalDto) {
  return http.post<boolean>(`/holiday/examine/${params.id}`, params.status, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function fetchLeaveApprovalList(shopId: string) {
  return http.post<Biz.LeaveVo[]>(`/holiday/${shopId}/list`)
}

export function fetchCreateTemplate(params: Biz.CreateTemplateDto) {
  return http.put(`/template/${params.shopId}/generate`, params.date, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function fetchDeleteTemplate(params: Biz.CreateTemplateDto) {
  return http.delete(`/template/${params.shopId}/${params.date}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function fetchTemplates(params: Biz.TemplateDto) {
  return http.get<Biz.TemplateVo[]>(`/template/${params.shopId}/details`, { dateMoon: params.date })
}

export function fetchShopDropList() {
  return http.get<Shop.Vo[]>(`/shop/dropAll`)
}

export function fetchLeaveRevoke(id: number) {
  return http.post<boolean>(`/holiday/revoke/${id}`)
}

export function fetchUserLeaveCount(date: string, shopId: string) {
  return http.post<Biz.LeaveCountVo[]>(`/holiday/${shopId}/queryAllStatusCount`, date, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
