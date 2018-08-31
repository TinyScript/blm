import {stringify} from 'qs';
import request from '../utils/request';

/**
 * 获取社群详细信息
 * @returns {Promise<Object>}
 */
export async function queryCommunityInfo(params) {
  return request(`/api/v1/community/org/group/info/${params.OrganizationId}/${params.GroupId}`)
}

/**
 * 获取社群列表
 * @returns {Promise<Object>}
 */
export async function queryCommunityList(params) {

  return request(`/api/v1/community/org/group/list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 获取已绑定社群列表
 * @returns {Promise<Object>}
 */
export async function queryUnbindCommunityList(params) {

  return request(`/api/v1/community/org/team/group/unbinded/list/${params.OrganizationId}/${params.TeamId}`,{
    method:'POST',
    body:params
  })
}

/**
 * 获取已绑定社群列表
 * @returns {Promise<Object>}
 */
export async function queryBindCommunityList(params) {

  return request(`/api/v1/community/org/team/group/binded/list/${params.OrganizationId}/${params.TeamId}`,{
    method:'POST',
    body:params
  })
}

/**
 * 获取社团群组列表
 * @returns {Promise<Object>}
 */
export async function queryGroupList(params) {
  return request(`/api/v1/community/org/team/list/${params.OrganizationId}?${stringify(params)}`)
}

/**
 * 添加社团群组
 * @returns {Promise<Object>}
 */
export async function addCommunityGroup(params) {
  return request(`/api/v1/community/org/team/add/${params.OrganizationId}`,{
    method:'POST',
    body:params
  })
}

/**
 * 编辑社团群组
 * @returns {Promise<Object>}
 */
export async function editCommunityGroup(params) {
  return request(`/api/v1/community/org/team/edit/${params.OrganizationId}/${params.TeamId}`,{
    method:'POST',
    body:params
  })
}

/**
 * 删除社团群组
 * @returns {Promise<Object>}
 */
export async function deleteCommunityGroup(params) {
  return request(`/api/v1/community/org/team/delete/${params.OrganizationId}/${params.TeamId}`,{
    method:'POST',
    body:params
  })
}

/**
 * 审核
 * @returns {Promise<Object>}
 */
export async function submitCommunityAudited(params) {

  return request(`/api/v1/community/org/group/audit/${params.OrganizationId}/${params.GroupId}`,{
    method:'POST',
    body:params
  })
}

/**
 * 编辑社群信息
 * @returns {Promise<Object>}
 */
export async function submitCommunityEdit(params) {

  return request(`/api/v1/community/org/group/edit/${params.OrganizationId}/${params.GroupId}`,{
    method:'POST',
    body:params
  })
}

/**
 * 添加社群信息
 * @returns {Promise<Object>}
 */
export async function submitCommunityAdd(params) {

  return request(`/api/v1/community/org/group/add/${params.OrganizationId}`,{
    method:'POST',
    body:params
  })
}

/**
 * 禁用社团
 * @returns {Promise<Object>}
 */
export async function uploadCommunityState(params) {
  return request(`/api/v1/community/org/group/disable/${params.OrganizationId}/${params.GroupId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 添加群组
 * @returns {Promise<Object>}
 */
export async function addCommunity(params) {
  return request(`/api/v1/community/org/team/bind/group/${params.OrganizationId}/${params.TeamId}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除群组
 * @returns {Promise<Object>}
 */
export async function delCommunity(params) {
  return request(`/api/v1/community/org/team/unbind/group/${params.OrganizationId}/${params.TeamId}`, {
    method: 'POST',
    body: params,
  });
}
