import request from '@/utils/request'

// 查询资讯评论列表
export function listComment(query) {
  return request({
    url: '/community/comment/list',
    method: 'get',
    params: query
  })
}

// 查询资讯评论详细
export function getComment(id) {
  return request({
    url: '/community/comment/' + id,
    method: 'get'
  })
}

// 新增资讯评论
export function addComment(data) {
  return request({
    url: '/community/comment',
    method: 'post',
    data: data
  })
}

// 修改资讯评论
export function updateComment(data) {
  return request({
    url: '/community/comment',
    method: 'put',
    data: data
  })
}

// 删除资讯评论
export function delComment(id) {
  return request({
    url: '/community/comment/' + id,
    method: 'delete'
  })
}
