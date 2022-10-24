import request from '@/utils/request'

// 查询官网导航栏菜单列表
export function listMenu(query) {
  return request({
    url: '/business/menu/list',
    method: 'get',
    params: query
  })
}

// 查询官网导航栏菜单详细
export function getMenu(navId) {
  return request({
    url: '/business/menu/' + navId,
    method: 'get'
  })
}

// 新增官网导航栏菜单
export function addMenu(data) {
  return request({
    url: '/business/menu',
    method: 'post',
    data: data
  })
}

// 修改官网导航栏菜单
export function updateMenu(data) {
  return request({
    url: '/business/menu',
    method: 'put',
    data: data
  })
}

// 删除官网导航栏菜单
export function delMenu(navId) {
  return request({
    url: '/business/menu/' + navId,
    method: 'delete'
  })
}
