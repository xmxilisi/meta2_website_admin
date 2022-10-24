import request from '@/utils/request'

// 查询区块链游戏列表
export function listGames(query) {
  return request({
    url: '/games/games/list',
    method: 'get',
    params: query
  })
}

// 查询区块链游戏详细
export function getGames(dappId) {
  return request({
    url: '/games/games/' + dappId,
    method: 'get'
  })
}

// 新增区块链游戏
export function addGames(data) {
  return request({
    url: '/games/games',
    method: 'post',
    data: data
  })
}

// 修改区块链游戏
export function updateGames(data) {
  return request({
    url: '/games/games',
    method: 'put',
    data: data
  })
}

// 删除区块链游戏
export function delGames(dappId) {
  return request({
    url: '/games/games/' + dappId,
    method: 'delete'
  })
}

// 采集区块链游戏
export function getallgames() {
  return request({
    url: '/games/games/getall',
    method: 'get'
  })
}

// 更新区块链游戏
export function updateGamesField(field) {
  return request({
    url: '/games/games/'+field,
    method: 'get'
  })
}
