import request from '@/utils/request'

// 查询名片业务列表
export function listCardBusiness(query) {
  return request({
    url: '/business/cardBusiness/list',
    method: 'get',
    params: query
  })
}

// 查询名片业务详细
export function getCardBusiness(id) {
  return request({
    url: '/business/cardBusiness/' + id,
    method: 'get'
  })
}

// 新增名片业务
export function addCardBusiness(data) {
  return request({
    url: '/business/cardBusiness',
    method: 'post',
    data: data
  })
}

// 修改名片业务
export function updateCardBusiness(data) {
  return request({
    url: '/business/cardBusiness',
    method: 'put',
    data: data
  })
}

// 删除名片业务
export function delCardBusiness(id) {
  return request({
    url: '/business/cardBusiness/' + id,
    method: 'delete'
  })
}

// 查询公司列表
export function companyList(query) {
  return request({
    url: '/business/companyInfo/listAll',
    method: 'get',
    params: query
  })
}
