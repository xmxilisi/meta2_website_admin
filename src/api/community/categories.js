import request from '@/utils/request'

// 查询主题分类列表
export function listCategories(query) {
  return request({
    url: '/community/categories/list',
    method: 'get',
    params: query
  })
}

// 查询主题分类详细
export function getCategories(id) {
  return request({
    url: '/community/categories/' + id,
    method: 'get'
  })
}

// 新增主题分类
export function addCategories(data) {
  return request({
    url: '/community/categories',
    method: 'post',
    data: data
  })
}

// 修改主题分类
export function updateCategories(data) {
  return request({
    url: '/community/categories',
    method: 'put',
    data: data
  })
}

// 删除主题分类
export function delCategories(id) {
  return request({
    url: '/community/categories/' + id,
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
    url: '/community/categories/changeStatus',
    method: 'put',
    data: data
  })
}
