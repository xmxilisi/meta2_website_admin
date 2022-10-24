import request from '@/utils/request'

// 查询系统通知模板列表
export function listNotificationTpls(query) {
  return request({
    url: '/community/notificationTpls/list',
    method: 'get',
    params: query
  })
}

// 查询系统通知模板详细
export function getNotificationTpls(id) {
  return request({
    url: '/community/notificationTpls/' + id,
    method: 'get'
  })
}

// 新增系统通知模板
export function addNotificationTpls(data) {
  return request({
    url: '/community/notificationTpls',
    method: 'post',
    data: data
  })
}

// 修改系统通知模板
export function updateNotificationTpls(data) {
  return request({
    url: '/community/notificationTpls',
    method: 'put',
    data: data
  })
}

// 删除系统通知模板
export function delNotificationTpls(id) {
  return request({
    url: '/community/notificationTpls/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/community/notificationTpls/changeStatus',
    method: 'put',
    data: data
  })
}
