import {getLocalStorage} from "../../utils/utils"
const userData = getLocalStorage('userData');

let api;

if(userData.Staff.GroupBuyingMode===2){
  api = require('../../services/singleMode/purchaseApi')
}else{
  api = require('../../services/purchaseApi')
}

const {
  uploadPurchaseAdd,
  queryImgToken,
  queryGroupList,
} = api;

import {routerRedux} from 'dva/router'
export default {
  namespace: 'purchaseAdd',

  state: {
    data:{
      IllustrationPictures:[],
      Info:[],
      Sku:[],
      SellType:1,
      Specification:[],
      Combination:[],
      AllowCancel:0,
      TeamVisibleState:1,
    },
    Tokens:{},
    stepFormSubmitting: false,
    loading: false,
    groupList:{
      loading:false,
      hasMore:true,
      List:[]
    },
  },

  effects: {
    *uploadPurchaseAdd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(uploadPurchaseAdd, payload);
      if(response.Message==='success'){
        yield put(routerRedux.push('/group/groupPurchase/groupPurchaseList'));
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryImgToken({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryImgToken, payload);

      yield put({
        type: 'getImgToken',
        payload: response.Data.Tokens[0],
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
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
      });
    },
  },

  reducers: {

    setAdd(state, action) {
      return {
        ...state,
        data:action.payload
      };
    },

    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    getImgToken(state, action) {
      return {
        ...state,
        Tokens: {
          key:action.payload.Key,
          AccessUrl:action.payload.AccessUrl,
          StoreUrl:action.payload.StoreUrl,
          name:action.payload.OriginalFileName,
          token:action.payload.Token,
        },
      };
    },
    getGroupList(state, { payload }) {
      return {
        ...state,
        groupList:payload.Data,
      };
    },
  },
};
