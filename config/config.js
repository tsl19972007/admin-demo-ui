// https://umijs.org/config/
import {defineConfig} from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const {REACT_APP_ENV} = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/sys',
              name: 'sys',
              icon: 'crown',
              authority: ['sys'],
              routes: [
                {
                  path: '/sys/user',
                  name: 'user',
                  icon: 'smile',
                  component: './system/user',
                  authority: ['user'],
                },
                {
                  path: '/sys/role',
                  name: 'role',
                  icon: 'smile',
                  component: './system/role',
                  authority: ['role'],
                },
                {
                  path: '/sys/permission',
                  name: 'permission',
                  icon: 'smile',
                  component: './system/permission',
                  authority: ['permission'],
                },
                {
                  redirect: '/sys/user',
                },
              ],
            },
            {
              name: 'home',
              icon: 'smile',
              path: '/home',
              component: './home',
              authority: ['home'],
            },
            {
              name: 'home2',
              icon: 'smile',
              path: '/home2',
              component: './home2',
              authority: ['home2'],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
