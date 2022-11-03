import request from '@/utils/request'

// 查询基本信息列表
export function listBasicInfo(query) {
  return request({
    url: '/business/basicInfo/list',
    method: 'get',
    params: query
  })
}

// 查询基本信息详细
export function getBasicInfo(id) {
  return request({
    url: '/business/basicInfo/' + id,
    method: 'get'
  })
}

// 新增基本信息
export function addBasicInfo(data) {
  return request({
    url: '/business/basicInfo',
    method: 'post',
    data: data
  })
}

// 修改基本信息
export function updateBasicInfo(data) {
  return request({
    url: '/business/basicInfo',
    method: 'put',
    data: data
  })
}

// 删除基本信息
export function delBasicInfo(id) {
  return request({
    url: '/business/basicInfo/' + id,
    method: 'delete'
  })
}
