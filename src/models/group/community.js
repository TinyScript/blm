import {
  queryCommunityInfo,
  queryCommunityList,
  queryUnbindCommunityList,
  queryBindCommunityList,
  queryGroupList,
  addCommunityGroup,
  editCommunityGroup,
  deleteCommunityGroup,
  submitCommunityAudited,
  submitCommunityAdd,
  submitCommunityEdit,
  uploadCommunityState,
} from '../../services/communityApi';

import {routerRedux} from 'dva/router'
import {getLocalStorage} from '../../utils/utils'
export default {
  namespace: 'community',

  state: {
    communityList: {
      list: [],
    },
    unBindCommunityList: {
      list: [],
    },
    bindCommunityList: {
      list: [],
    },
    groupList: {
      list: [],
    },
    communityInfo: {

    },
    loading: false,
  },

  effects: {

    *queryCommunityList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCommunityList, payload);
      yield put({
        type: 'getCommunityList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
    *queryUnbindCommunityList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUnbindCommunityList, payload);
      yield put({
        type: 'getUnbindCommunityList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
    *queryBindCommunityList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryBindCommunityList, payload);
      yield put({
        type: 'getBindCommunityList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
    *queryGroupList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryGroupList, payload);
      yield put({
        type: 'getGroupList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
    *addCommunityGroup({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addCommunityGroup, payload);
      if(response.Message == "success"){
        yield put({
          type:'queryGroupList',
          payload:{
            page:1,
            page_size:10,
            OrganizationId: payload.OrganizationId,
          }
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *editCommunityGroup({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(editCommunityGroup, payload);
      if(response.Message == "success"){
        yield put({
          type:'queryGroupList',
          payload:{
            page:1,
            page_size:10,
            OrganizationId: payload.OrganizationId,
          }
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *deleteCommunityGroup({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(deleteCommunityGroup, payload);
      if(response.Message == "success"){
        yield put({
          type:'queryGroupList',
          payload:{
            page:1,
            page_size:10,
            OrganizationId: payload.OrganizationId,
          }
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryCommunityInfo({ payload }, { call, put }) {
      const response = yield call(queryCommunityInfo, payload);
      const authorization = (e)=>{
        const userData = getLocalStorage('userData');
        return `/api/v1/user/org/user/access_id_card_pic?_token=${userData.Token}&_uid=${userData.UserId}&uri=${encodeURI(e)}`
      }
      if(!response.Code){
        if(response.Data.ManagerIdCardBack){
          response.Data.tempManagerIdCardBack = authorization(response.Data.ManagerIdCardBack)
        }
        if(response.Data.ManagerIdCardFront){
          response.Data.tempManagerIdCardFront = authorization(response.Data.ManagerIdCardFront)
        }
      }
      yield put({
        type: 'getCommunityInfo',
        payload: response,
      });
    },
    *submitCommunityAudited({ payload }, { call, put }) {
       yield call(submitCommunityAudited, payload);
    },

    *submitCommunityEdit({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitCommunityEdit, payload);
      if(!response.Code){
        yield put(routerRedux.push('/group/community'));
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *submitCommunityAdd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitCommunityAdd, payload);
      if(!response.Code){
        yield put(routerRedux.push('/group/community'));
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    * uploadCommunityState({payload}, {select,call, put}) {

      const res = yield call(uploadCommunityState, payload);

    },

  },

  reducers: {
    getCommunityList(state, action) {
      return {
        ...state,
        communityList: action.payload.Data,
      };
    },
    getUnbindCommunityList(state, action) {
      return {
        ...state,
        unBindCommunityList: action.payload.Data,
      };
    },
    getBindCommunityList(state, action) {
      return {
        ...state,
        bindCommunityList: action.payload.Data,
      };
    },
    getGroupList(state, action) {
      return {
        ...state,
        groupList: action.payload.Data,
      };
    },
    getCommunityInfo(state, action) {
      return {
        ...state,
        communityInfo: action.payload.Data,
      };
    },
    setCommunityInfo(state, action) {
      return {
        ...state,
        communityInfo: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
