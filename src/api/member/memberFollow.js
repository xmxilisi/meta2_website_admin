import request from '@/utils/request'

// 查询会员关注管理列表
export function listMemberFollow(query) {
  return request({
    url: '/member/memberFollow/list',
    method: 'get',
    params: query
  })
}

// 查询会员关注管理详细
export function getMemberFollow(id) {
  return request({
    url: '/member/memberFollow/' + id,
    method: 'get'
  })
}

// 新增会员关注管理
export function addMemberFollow(data) {
  return request({
    url: '/member/memberFollow',
    method: 'post',
    data: data
  })
}

// 修改会员关注管理
export function updateMemberFollow(data) {
  return request({
    url: '/member/memberFollow',
    method: 'put',
    data: data
  })
}

// 删除会员关注管理
export function delMemberFollow(id) {
  return request({
    url: '/member/memberFollow/' + id,
    method: 'delete'
  })
}
