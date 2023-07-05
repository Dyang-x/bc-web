import React from 'react';
import '@hvisions/h-ui/dist/hui.css';
import './index.css';
import 'echarts-liquidfill';
import Core from '@hvisions/core';
// redux store
import store from './store';

// 引入基础模块
import baseModule from '@hvisions/module-base';
// 引入基础模块样式
import '@hvisions/module-base/lib/chunks/css/main.css';
// 使用基础模块
Core.use(baseModule);

import { TestButton } from './config.location';
// 路由
import router from './router';
const locales = {
  en_US: require('./locales/en_US'),
  zh_CN: require('./locales/zh_CN')
};

// // 引入新布局插件
// import layoutPlugin from '@hvisions/plugin-new-layout';
// // 使用新布局插件
// Core.plugin(layoutPlugin);

// // 引入新登录页插件
// import loginPlugin from '@hvisions/plugin-new-login';
// // 使用新登录页插件
// Core.plugin(loginPlugin);

//引入
import boardModule from '@hvisions/module-board';
import eamModule from '@hvisions/module-eam';
import etrainingModule from '@hvisions/module-etraining';
import messageModule from '@hvisions/module-message';

import pmsModule from '@hvisions/module-pms';
import qmsModule from '@hvisions/module-qms';
import wmsModule from '@hvisions/module-wms';
// import iotModule from '@hvisions/module-iot';

// 引入模块样式
import '@hvisions/module-base/lib/chunks/css/main.css';
import '@hvisions/module-board/lib/chunks/css/main.css';
import '@hvisions/module-eam/lib/chunks/css/main.css';
import '@hvisions/module-etraining/lib/chunks/css/main.css';
// import '@hvisions/module-message/lib/chunks/css/main.css';
import '@hvisions/module-pms/lib/chunks/css/main.css';
import '@hvisions/module-qms/lib/chunks/css/main.css';
import '@hvisions/module-wms/lib/chunks/css/main.css';

// 引入插件
import loginPlugin from "@hvisions/plugin-new-login";
// 使用插件
Core.plugin(loginPlugin);

// 引入插件
import layoutPlugin from "@hvisions/plugin-new-layout";
// 使用插件
Core.plugin(layoutPlugin);

// 使用
Core.use(boardModule);
Core.use(eamModule);
Core.use(etrainingModule);
Core.use(messageModule);
Core.use(pmsModule);
Core.use(qmsModule);
Core.use(wmsModule);
// Core.use(iotModule);

const moduleConfig = {
  location2: {
    // 代表功能模块(工厂建模, 用户管理单独模块)
    titleArea: <TestButton />, // 代表工厂建模的标题区域(如果没有那么就用我们默认的, 如果有我们就加载用户自定义的)
    titleArea2: <TestButton />
  }
};

const CoreConfig = {
  username: 'admin',
  password: 'admin',
  // wsAddress: `${process.env.MESSAGE_API_ADDRESS_}`,
  wsAddress: `ws://192.168.1.34:15672/ws`,
  needNotification: true,
}


new Core({
  router, // 路由
  locales, // 国际化
  store, // redux store
  moduleConfig, // 已有模块插入自定义功能
  CoreConfig, //消息通知
}).mount('#root');
