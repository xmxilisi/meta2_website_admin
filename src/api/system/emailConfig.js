import request from '@/utils/request'
import Vue from "vue";

// 查询邮箱配置列表
export function listEmailConfig(query) {
  return request({
    url: '/system/emailConfig/list',
    method: 'get',
    params: query
  })
}

// 查询邮箱配置详细
export function getEmailConfig(emailConfigId) {
  return request({
    url: '/system/emailConfig/' + emailConfigId,
    method: 'get'
  })
}

// 新增邮箱配置
export function addEmailConfig(data) {
  return request({
    url: '/system/emailConfig',
    method: 'post',
    data: data
  })
}

// 修改邮箱配置
export function updateEmailConfig(data) {
  return request({
    url: '/system/emailConfig',
    method: 'put',
    data: data
  })
}

// 删除邮箱配置
export function delEmailConfig(emailConfigId) {
  return request({
    url: '/system/emailConfig/' + emailConfigId,
    method: 'delete'
  })
}

// 状态修改
export function changeStatus(emailConfigId, status) {
  const data = {
    emailConfigId,
    status
  }
  return request({
    url: '/system/emailConfig/changeStatus',
    method: 'put',
    data: data
  })
}

// 测试邮箱配置
export function testEmailConfig(mailConfig, testMail) {
  const data = {
    mailConfig,
    testMail
  }
  return request({
    url: '/system/emailConfig/testMail',
    method: 'put',
    data: data
  })
}

