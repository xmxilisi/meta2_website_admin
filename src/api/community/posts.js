import request from '@/utils/request'

// 查询主题回复管理列表
export function listPosts(query) {
  return request({
    url: '/community/posts/list',
    method: 'get',
    params: query
  })
}

// 查询主题回复管理详细
export function getPosts(id) {
  return request({
    url: '/community/posts/' + id,
    method: 'get'
  })
}

// 新增主题回复管理
export function addPosts(data) {
  return request({
    url: '/community/posts',
    method: 'post',
    data: data
  })
}

// 修改主题回复管理
export function updatePosts(data) {
  return request({
    url: '/community/posts',
    method: 'put',
    data: data
  })
}

// 删除主题回复管理
export function delPosts(id) {
  return request({
    url: '/community/posts/' + id,
    method: 'delete'
  })
}
