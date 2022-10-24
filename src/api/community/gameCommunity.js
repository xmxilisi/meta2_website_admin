import request from '@/utils/request'

// 查询游戏分类列表
export function listGameCommunity(query) {
  return request({
    url: '/community/gameCommunity/list',
    method: 'get',
    params: query
  })
}

// 查询游戏分类详细
export function getGameCommunity(id) {
  return request({
    url: '/community/gameCommunity/' + id,
    method: 'get'
  })
}

// 新增游戏分类
export function addGameCommunity(data) {
  return request({
    url: '/community/gameCommunity',
    method: 'post',
    data: data
  })
}

// 修改游戏分类
export function updateGameCommunity(data) {
  return request({
    url: '/community/gameCommunity',
    method: 'put',
    data: data
  })
}

// 删除游戏分类
export function delGameCommunity(id) {
  return request({
    url: '/community/gameCommunity/' + id,
    method: 'delete'
  })
}

// 查询分类下拉树结构
export function treeselect() {
  return request({
    url: '/community/gameCommunity/treeselect',
    method: 'get'
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
    url: '/community/gameCommunity/changeStatus',
    method: 'put',
    data: data
  })
}
