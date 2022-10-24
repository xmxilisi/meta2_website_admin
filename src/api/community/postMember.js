import request from '@/utils/request'

// 查询主题回复点赞列表
export function listPostMember(query) {
  return request({
    url: '/community/postMember/list',
    method: 'get',
    params: query
  })
}

// 查询主题回复点赞详细
export function getPostMember(postId) {
  return request({
    url: '/community/postMember/' + postId,
    method: 'get'
  })
}

// 新增主题回复点赞
export function addPostMember(data) {
  return request({
    url: '/community/postMember',
    method: 'post',
    data: data
  })
}

// 修改主题回复点赞
export function updatePostMember(data) {
  return request({
    url: '/community/postMember',
    method: 'put',
    data: data
  })
}

// 删除主题回复点赞
export function delPostMember(postId) {
  return request({
    url: '/community/postMember/' + postId,
    method: 'delete'
  })
}
