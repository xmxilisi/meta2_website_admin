import request from '@/utils/request'

// 查询名片个人信息列表
export function listUserInfo(query) {
  return request({
    url: '/business/userInfo/list',
    method: 'get',
    params: query
  })
}

// 查询名片个人信息详细
export function getUserInfo(id) {
  return request({
    url: '/business/userInfo/' + id,
    method: 'get'
  })
}

// 新增名片个人信息
export function addUserInfo(data) {
  return request({
    url: '/business/userInfo',
    method: 'post',
    data: data
  })
}

// 修改名片个人信息
export function updateUserInfo(data) {
  return request({
    url: '/business/userInfo',
    method: 'put',
    data: data
  })
}

// 删除名片个人信息
export function delUserInfo(id) {
  return request({
    url: '/business/userInfo/' + id,
    method: 'delete'
  })
}

// 查询公司列表
export function companyList(query) {
  return request({
    url: '/business/companyInfo/listAll',
    method: 'get',
    params: query
  })
}