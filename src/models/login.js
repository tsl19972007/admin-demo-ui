import {stringify} from 'querystring';
import {history} from 'umi';
import {login, logout} from '@/services/auth';
import {setAuthority} from '@/utils/authority';
import {getPageQuery} from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * login({payload}, {call, put}) {
      const res = yield call(login, payload.username, payload.password);

      if (res && res.code === 200) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let {redirect} = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');

        yield put({
          type: 'changeLoginStatus',
          payload: res,
        }); // Login successfully
      }
    },

    * logout({}, {call}) {
      yield call(logout);
      const {redirect} = getPageQuery(); // Note: There may be security issues, please note
      setAuthority({});
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, {payload}) {
      setAuthority(payload.data ? payload.data.permissions : {});
      return {...state, status: payload.status, type: payload.type};
    },
  },
};
export default Model;
