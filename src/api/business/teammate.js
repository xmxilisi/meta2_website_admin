import request from '@/utils/request'

// 查询团队成员列表
export function listTeammate(query) {
  return request({
    url: '/business/teammate/list',
    method: 'get',
    params: query
  })
}

// 查询团队成员详细
export function getTeammate(id) {
  return request({
    url: '/business/teammate/' + id,
    method: 'get'
  })
}

// 新增团队成员
export function addTeammate(data) {
  return request({
    url: '/business/teammate',
    method: 'post',
    data: data
  })
}

// 修改团队成员
export function updateTeammate(data) {
  return request({
    url: '/business/teammate',
    method: 'put',
    data: data
  })
}

// 删除团队成员
export function delTeammate(id) {
  return request({
    url: '/business/teammate/' + id,
    method: 'delete'
  })
}
