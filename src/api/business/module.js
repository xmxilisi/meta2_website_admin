import request from '@/utils/request'

// 查询内容模块列表
export function listmodule(query) {
  return request({
    url: '/business/module/list',
    method: 'get',
    params: query
  })
}

// 查询内容模块详细
export function getmodule(moduleId) {
  return request({
    url: '/business/module/' + moduleId,
    method: 'get'
  })
}

// 新增内容模块
export function addmodule(data) {
  return request({
    url: '/business/module',
    method: 'post',
    data: data
  })
}

// 修改内容模块
export function updatemodule(data) {
  return request({
    url: '/business/module',
    method: 'put',
    data: data
  })
}

// 删除内容模块
export function delmodule(moduleId) {
  return request({
    url: '/business/module/' + moduleId,
    method: 'delete'
  })
}
