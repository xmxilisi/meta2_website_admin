import request from '@/utils/request'

// 查询内容模块详情列表
export function listmoduleDetail(query) {
  return request({
    url: '/business/moduleDetail/list',
    method: 'get',
    params: query
  })
}

// 查询内容模块详情详细
export function getmoduleDetail(detailId) {
  return request({
    url: '/business/moduleDetail/' + detailId,
    method: 'get'
  })
}

// 新增内容模块详情
export function addmoduleDetail(data) {
  return request({
    url: '/business/moduleDetail',
    method: 'post',
    data: data
  })
}

// 修改内容模块详情
export function updatemoduleDetail(data) {
  return request({
    url: '/business/moduleDetail',
    method: 'put',
    data: data
  })
}

// 删除内容模块详情
export function delmoduleDetail(detailId) {
  return request({
    url: '/business/moduleDetail/' + detailId,
    method: 'delete'
  })
}
