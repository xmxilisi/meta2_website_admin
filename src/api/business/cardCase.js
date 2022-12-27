import request from '@/utils/request'

// 查询名片案例列表
export function listCardCase(query) {
  return request({
    url: '/business/cardCase/list',
    method: 'get',
    params: query
  })
}

// 查询名片案例详细
export function getCardCase(id) {
  return request({
    url: '/business/cardCase/' + id,
    method: 'get'
  })
}

// 新增名片案例
export function addCardCase(data) {
  return request({
    url: '/business/cardCase',
    method: 'post',
    data: data
  })
}

// 修改名片案例
export function updateCardCase(data) {
  return request({
    url: '/business/cardCase',
    method: 'put',
    data: data
  })
}

// 删除名片案例
export function delCardCase(id) {
  return request({
    url: '/business/cardCase/' + id,
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
