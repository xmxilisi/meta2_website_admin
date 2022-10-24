import request from '@/utils/request'

// 查询中文资讯列表
export function listNewsChinese(query) {
  return request({
    url: '/community/newsChinese/list',
    method: 'get',
    params: query
  })
}

// 查询中文资讯详细
export function getNewsChinese(id) {
  return request({
    url: '/community/newsChinese/' + id,
    method: 'get'
  })
}

// 新增中文资讯
export function addNewsChinese(data) {
  return request({
    url: '/community/newsChinese',
    method: 'post',
    data: data
  })
}

// 修改中文资讯
export function updateNewsChinese(data) {
  return request({
    url: '/community/newsChinese',
    method: 'put',
    data: data
  })
}

// 删除中文资讯
export function delNewsChinese(id) {
  return request({
    url: '/community/newsChinese/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeStatus(id, field, change) {
  const data = {
    id,
    field,
    change
  }
  return request({
    url: '/community/newsChinese/changeStatus',
    method: 'put',
    data: data
  })
}
