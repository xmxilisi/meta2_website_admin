import request from '@/utils/request'

// 查询留言反馈列表
export function listFeedback(query) {
  return request({
    url: '/business/feedback/list',
    method: 'get',
    params: query
  })
}

// 查询留言反馈详细
export function getFeedback(feedbackId) {
  return request({
    url: '/business/feedback/' + feedbackId,
    method: 'get'
  })
}

// 新增留言反馈
export function addFeedback(data) {
  return request({
    url: '/business/feedback',
    method: 'post',
    data: data
  })
}

// 修改留言反馈
export function updateFeedback(data) {
  return request({
    url: '/business/feedback',
    method: 'put',
    data: data
  })
}

// 删除留言反馈
export function delFeedback(feedbackId) {
  return request({
    url: '/business/feedback/' + feedbackId,
    method: 'delete'
  })
}

// 处理留言反馈
export function handleStatus(feedbackId) {
  return request({
    url: '/business/feedback/updateStatus/' + feedbackId,
    method: 'post'
  })
}
