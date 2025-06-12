import type { Login, ResPage, User } from '../interfaces'
import { http } from '../index'
import { DEFAULT_PAGE } from '../interfaces'

export function fetchLoginPost(data: Login.ReqLoginForm) {
  return http.post<Login.ResLogin>('/user/login', data)
}

export function fetchApplyUsers(data: User.applyUserDto = DEFAULT_PAGE) {
  return http.post<ResPage<User.Vo>>('/user/apply/list', data)
}

export function fetchApprovalUser(data: User.ApprovalDto) {
  return http.post('/user/apply/examine', data)
}

export function fetchUsers(data: User.applyUserDto = DEFAULT_PAGE) {
  return http.post<ResPage<User.Vo>>('/user/users', data)
}

export function fetchUserDelete(id: string) {
  return http.delete<boolean>(`/user/${id}`)
}
