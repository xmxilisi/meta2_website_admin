import request from '@/utils/request'

// 查询区块链管理列表
export function listGameChain(query) {
  return request({
    url: '/games/gameChain/list',
    method: 'get',
    params: query
  })
}

// 查询区块链管理详细
export function getGameChain(chainId) {
  return request({
    url: '/games/gameChain/' + chainId,
    method: 'get'
  })
}

// 新增区块链管理
export function addGameChain(data) {
  return request({
    url: '/games/gameChain',
    method: 'post',
    data: data
  })
}

// 修改区块链管理
export function updateGameChain(data) {
  return request({
    url: '/games/gameChain',
    method: 'put',
    data: data
  })
}

// 删除区块链管理
export function delGameChain(chainId) {
  return request({
    url: '/games/gameChain/' + chainId,
    method: 'delete'
  })
}
