import request from '@/utils/request'

// 查询主题收藏列表
export function listThreadUser(query) {
  return request({
    url: '/community/threadUser/list',
    method: 'get',
    params: query
  })
}

// 查询主题收藏详细
export function getThreadUser(threadId) {
  return request({
    url: '/community/threadUser/' + threadId,
    method: 'get'
  })
}

// 新增主题收藏
export function addThreadUser(data) {
  return request({
    url: '/community/threadUser',
    method: 'post',
    data: data
  })
}

// 修改主题收藏
export function updateThreadUser(data) {
  return request({
    url: '/community/threadUser',
    method: 'put',
    data: data
  })
}

// 删除主题收藏
export function delThreadUser(threadId) {
  return request({
    url: '/community/threadUser/' + threadId,
    method: 'delete'
  })
}
