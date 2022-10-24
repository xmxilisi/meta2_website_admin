import request from '@/utils/request'

// 查询会员管理列表
export function listMember(query) {
  return request({
    url: '/member/member/list',
    method: 'get',
    params: query
  })
}

// 查询会员管理详细
export function getMember(id) {
  return request({
    url: '/member/member/' + id,
    method: 'get'
  })
}

// 新增会员管理
export function addMember(data) {
  return request({
    url: '/member/member',
    method: 'post',
    data: data
  })
}

// 修改会员管理
export function updateMember(data) {
  return request({
    url: '/member/member',
    method: 'put',
    data: data
  })
}

// 删除会员管理
export function delMember(id) {
  return request({
    url: '/member/member/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeStatus(memberId, status) {
  const data = {
    memberId,
    status
  }
  return request({
    url: '/member/member/changeStatus',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function resetUserPwd(memberId, password) {
  const data = {
    memberId,
    password
  }
  return request({
    url: '/member/member/resetPwd',
    method: 'put',
    data: data
  })
}
