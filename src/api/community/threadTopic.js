import request from '@/utils/request'

// 查询主题话题管理列表
export function listThreadTopic(query) {
  return request({
    url: '/community/threadTopic/list',
    method: 'get',
    params: query
  })
}

// 查询主题话题管理详细
export function getThreadTopic(threadId) {
  return request({
    url: '/community/threadTopic/' + threadId,
    method: 'get'
  })
}

// 新增主题话题管理
export function addThreadTopic(data) {
  return request({
    url: '/community/threadTopic',
    method: 'post',
    data: data
  })
}

// 修改主题话题管理
export function updateThreadTopic(data) {
  return request({
    url: '/community/threadTopic',
    method: 'put',
    data: data
  })
}

// 删除主题话题管理
export function delThreadTopic(threadId) {
  return request({
    url: '/community/threadTopic/' + threadId,
    method: 'delete'
  })
}
