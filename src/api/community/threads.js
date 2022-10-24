import request from '@/utils/request'

// 查询主题管理列表
export function listThreads(query) {
  return request({
    url: '/community/threads/list',
    method: 'get',
    params: query
  })
}

// 查询主题管理详细
export function getThreads(id) {
  return request({
    url: '/community/threads/' + id,
    method: 'get'
  })
}

// 新增主题管理
export function addThreads(data) {
  return request({
    url: '/community/threads',
    method: 'post',
    data: data
  })
}

// 修改主题管理
export function updateThreads(data) {
  return request({
    url: '/community/threads',
    method: 'put',
    data: data
  })
}

// 删除主题管理
export function delThreads(id) {
  return request({
    url: '/community/threads/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeStatus(id, field, change) {
  const data = {
    id,
    field,
    change
  }
  return request({
    url: '/community/threads/changeStatus',
    method: 'put',
    data: data
  })
}
