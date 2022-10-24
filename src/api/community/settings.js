import request from '@/utils/request'

// 查询站点设置列表
export function listSettings(query) {
  return request({
    url: '/community/settings/list',
    method: 'get',
    params: query
  })
}

// 查询站点设置详细
export function getSettings(k) {
  return request({
    url: '/community/settings/' + k,
    method: 'get'
  })
}

// 新增站点设置
export function addSettings(data) {
  return request({
    url: '/community/settings',
    method: 'post',
    data: data
  })
}

// 修改站点设置
export function updateSettings(data) {
  return request({
    url: '/community/settings',
    method: 'put',
    data: data
  })
}

// 删除站点设置
export function delSettings(k) {
  return request({
    url: '/community/settings/' + k,
    method: 'delete'
  })
}
