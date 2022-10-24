import request from '@/utils/request'

// 查询资讯管理列表
export function listNews(query) {
  return request({
    url: '/community/news/list',
    method: 'get',
    params: query
  })
}

// 查询资讯管理详细
export function getNews(id) {
  return request({
    url: '/community/news/' + id,
    method: 'get'
  })
}

// 新增资讯管理
export function addNews(data) {
  return request({
    url: '/community/news',
    method: 'post',
    data: data
  })
}

// 修改资讯管理
export function updateNews(data) {
  return request({
    url: '/community/news',
    method: 'put',
    data: data
  })
}

// 删除资讯管理
export function delNews(id) {
  return request({
    url: '/community/news/' + id,
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
    url: '/community/news/changeStatus',
    method: 'put',
    data: data
  })
}
