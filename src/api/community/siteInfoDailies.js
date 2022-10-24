import request from '@/utils/request'

// 查询统计日报列表
export function listSiteInfoDailies(query) {
  return request({
    url: '/community/siteInfoDailies/list',
    method: 'get',
    params: query
  })
}

// 查询统计日报详细
export function getSiteInfoDailies(id) {
  return request({
    url: '/community/siteInfoDailies/' + id,
    method: 'get'
  })
}

// 新增统计日报
export function addSiteInfoDailies(data) {
  return request({
    url: '/community/siteInfoDailies',
    method: 'post',
    data: data
  })
}

// 修改统计日报
export function updateSiteInfoDailies(data) {
  return request({
    url: '/community/siteInfoDailies',
    method: 'put',
    data: data
  })
}

// 删除统计日报
export function delSiteInfoDailies(id) {
  return request({
    url: '/community/siteInfoDailies/' + id,
    method: 'delete'
  })
}
