import request from '@/utils/request'

// 查询通知发送记录列表
export function listNotificationTiming(query) {
  return request({
    url: '/community/notificationTiming/list',
    method: 'get',
    params: query
  })
}

// 查询通知发送记录详细
export function getNotificationTiming(id) {
  return request({
    url: '/community/notificationTiming/' + id,
    method: 'get'
  })
}

// 新增通知发送记录
export function addNotificationTiming(data) {
  return request({
    url: '/community/notificationTiming',
    method: 'post',
    data: data
  })
}

// 修改通知发送记录
export function updateNotificationTiming(data) {
  return request({
    url: '/community/notificationTiming',
    method: 'put',
    data: data
  })
}

// 删除通知发送记录
export function delNotificationTiming(id) {
  return request({
    url: '/community/notificationTiming/' + id,
    method: 'delete'
  })
}
