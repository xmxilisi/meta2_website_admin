import request from '@/utils/request'

// 查询话题列表
export function listTopics(query) {
  return request({
    url: '/community/topics/list',
    method: 'get',
    params: query
  })
}

// 查询话题详细
export function getTopics(id) {
  return request({
    url: '/community/topics/' + id,
    method: 'get'
  })
}

// 新增话题
export function addTopics(data) {
  return request({
    url: '/community/topics',
    method: 'post',
    data: data
  })
}

// 修改话题
export function updateTopics(data) {
  return request({
    url: '/community/topics',
    method: 'put',
    data: data
  })
}

// 删除话题
export function delTopics(id) {
  return request({
    url: '/community/topics/' + id,
    method: 'delete'
  })
}
