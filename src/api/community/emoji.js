import request from '@/utils/request'

// 查询表情管理列表
export function listEmoji(query) {
  return request({
    url: '/community/emoji/list',
    method: 'get',
    params: query
  })
}

// 查询表情管理详细
export function getEmoji(id) {
  return request({
    url: '/community/emoji/' + id,
    method: 'get'
  })
}

// 新增表情管理
export function addEmoji(data) {
  return request({
    url: '/community/emoji',
    method: 'post',
    data: data
  })
}

// 修改表情管理
export function updateEmoji(data) {
  return request({
    url: '/community/emoji',
    method: 'put',
    data: data
  })
}

// 删除表情管理
export function delEmoji(id) {
  return request({
    url: '/community/emoji/' + id,
    method: 'delete'
  })
}
