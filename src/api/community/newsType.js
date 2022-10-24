import request from '@/utils/request'

// 查询分类管理列表
export function listNewsType(query) {
  return request({
    url: '/community/newsType/list',
    method: 'get',
    params: query
  })
}

// 查询分类管理详细
export function getNewsType(id) {
  return request({
    url: '/community/newsType/' + id,
    method: 'get'
  })
}

// 新增分类管理
export function addNewsType(data) {
  return request({
    url: '/community/newsType',
    method: 'post',
    data: data
  })
}

// 修改分类管理
export function updateNewsType(data) {
  return request({
    url: '/community/newsType',
    method: 'put',
    data: data
  })
}

// 删除分类管理
export function delNewsType(id) {
  return request({
    url: '/community/newsType/' + id,
    method: 'delete'
  })
}

// 查询分类下拉树结构
export function treeselect() {
  return request({
    url: '/community/newsType/treeselect',
    method: 'get'
  })
}

// 查询分类下拉树结构
export function treeselectChinese() {
  return request({
    url: '/community/newsType/treeselectChinese',
    method: 'get'
  })
}

// 状态修改
export function changeStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/community/newsType/changeStatus',
    method: 'put',
    data: data
  })
}
