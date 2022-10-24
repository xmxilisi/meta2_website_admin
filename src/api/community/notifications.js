import request from '@/utils/request'

// 查询系统通知管理列表
export function listNotifications(query) {
  return request({
    url: '/community/notifications/list',
    method: 'get',
    params: query
  })
}

// 查询系统通知管理详细
export function getNotifications(id) {
  return request({
    url: '/community/notifications/' + id,
    method: 'get'
  })
}

// 新增系统通知管理
export function addNotifications(data) {
  return request({
    url: '/community/notifications',
    method: 'post',
    data: data
  })
}

// 修改系统通知管理
export function updateNotifications(data) {
  return request({
    url: '/community/notifications',
    method: 'put',
    data: data
  })
}

// 删除系统通知管理
export function delNotifications(id) {
  return request({
    url: '/community/notifications/' + id,
    method: 'delete'
  })
}
