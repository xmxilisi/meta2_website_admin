import request from '@/utils/request'

// 查询举报管理列表
export function listReports(query) {
  return request({
    url: '/community/reports/list',
    method: 'get',
    params: query
  })
}

// 查询举报管理详细
export function getReports(id) {
  return request({
    url: '/community/reports/' + id,
    method: 'get'
  })
}

// 新增举报管理
export function addReports(data) {
  return request({
    url: '/community/reports',
    method: 'post',
    data: data
  })
}

// 修改举报管理
export function updateReports(data) {
  return request({
    url: '/community/reports',
    method: 'put',
    data: data
  })
}

// 删除举报管理
export function delReports(id) {
  return request({
    url: '/community/reports/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/community/reports/changeStatus',
    method: 'put',
    data: data
  })
}
