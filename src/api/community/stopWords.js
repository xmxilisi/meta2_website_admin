import request from '@/utils/request'

// 查询敏感词管理列表
export function listStopWords(query) {
  return request({
    url: '/community/stopWords/list',
    method: 'get',
    params: query
  })
}

// 查询敏感词管理详细
export function getStopWords(id) {
  return request({
    url: '/community/stopWords/' + id,
    method: 'get'
  })
}

// 新增敏感词管理
export function addStopWords(data) {
  return request({
    url: '/community/stopWords',
    method: 'post',
    data: data
  })
}

// 修改敏感词管理
export function updateStopWords(data) {
  return request({
    url: '/community/stopWords',
    method: 'put',
    data: data
  })
}

// 删除敏感词管理
export function delStopWords(id) {
  return request({
    url: '/community/stopWords/' + id,
    method: 'delete'
  })
}
