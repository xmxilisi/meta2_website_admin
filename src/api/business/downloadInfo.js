import request from '@/utils/request'

// 查询app版本下载信息管理列表
export function listDownloadInfo(query) {
  return request({
    url: '/business/downloadInfo/list',
    method: 'get',
    params: query
  })
}

// 查询app版本下载信息管理详细
export function getDownloadInfo(downloadId) {
  return request({
    url: '/business/downloadInfo/' + downloadId,
    method: 'get'
  })
}

// 新增app版本下载信息管理
export function addDownloadInfo(data) {
  return request({
    url: '/business/downloadInfo',
    method: 'post',
    data: data
  })
}

// 修改app版本下载信息管理
export function updateDownloadInfo(data) {
  return request({
    url: '/business/downloadInfo',
    method: 'put',
    data: data
  })
}

// 删除app版本下载信息管理
export function delDownloadInfo(downloadId) {
  return request({
    url: '/business/downloadInfo/' + downloadId,
    method: 'delete'
  })
}
