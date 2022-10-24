import request from '@/utils/request'

// 查询游戏账号列表
export function listGameAccount(query) {
  return request({
    url: '/games/gameAccount/list',
    method: 'get',
    params: query
  })
}

// 查询游戏账号详细
export function getGameAccount(accountId) {
  return request({
    url: '/games/gameAccount/' + accountId,
    method: 'get'
  })
}

// 新增游戏账号
export function addGameAccount(data) {
  return request({
    url: '/games/gameAccount',
    method: 'post',
    data: data
  })
}

// 修改游戏账号
export function updateGameAccount(data) {
  return request({
    url: '/games/gameAccount',
    method: 'put',
    data: data
  })
}

// 删除游戏账号
export function delGameAccount(accountId) {
  return request({
    url: '/games/gameAccount/' + accountId,
    method: 'delete'
  })
}
