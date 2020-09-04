import {query as queryUsers} from '@/services/user';
import {getCurrentUser} from '@/services/auth'

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    * fetchCurrent(_, {call, put}) {
      const response2 = yield call(getCurrentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: response2
      });
    },
  },
  reducers: {
    saveCurrentUser(state, {payload}) {
      return {...state, currentUser: payload.data ? payload.data.user : {}};
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
