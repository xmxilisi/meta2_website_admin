import request from '@/utils/request'

// 查询名片公司信息列表
export function listCompanyInfo(query) {
  return request({
    url: '/business/companyInfo/list',
    method: 'get',
    params: query
  })
}

// 查询名片公司信息详细
export function getCompanyInfo(id) {
  return request({
    url: '/business/companyInfo/' + id,
    method: 'get'
  })
}

// 新增名片公司信息
export function addCompanyInfo(data) {
  return request({
    url: '/business/companyInfo',
    method: 'post',
    data: data
  })
}

// 修改名片公司信息
export function updateCompanyInfo(data) {
  return request({
    url: '/business/companyInfo',
    method: 'put',
    data: data
  })
}

// 删除名片公司信息
export function delCompanyInfo(id) {
  return request({
    url: '/business/companyInfo/' + id,
    method: 'delete'
  })
}
