import request from '@/utils/request'

// 查询主题回复@列表
export function listPostMentionsMember(query) {
  return request({
    url: '/community/postMentionsMember/list',
    method: 'get',
    params: query
  })
}

// 查询主题回复@详细
export function getPostMentionsMember(postId) {
  return request({
    url: '/community/postMentionsMember/' + postId,
    method: 'get'
  })
}

// 新增主题回复@
export function addPostMentionsMember(data) {
  return request({
    url: '/community/postMentionsMember',
    method: 'post',
    data: data
  })
}

// 修改主题回复@
export function updatePostMentionsMember(data) {
  return request({
    url: '/community/postMentionsMember',
    method: 'put',
    data: data
  })
}

// 删除主题回复@
export function delPostMentionsMember(postId) {
  return request({
    url: '/community/postMentionsMember/' + postId,
    method: 'delete'
  })
}
