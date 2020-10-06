export const allMenu = [{
  id: '04',
  path: '/sys',
  title: '系统配置',
  component: 'layout/Layout',
  children: [{
    id: '0410',
    path: '',
    icon: 'sysOperate',
    title: '参数设置',
    component: '',
    children: [{
      id: '0411',
      path: 'user',
      title: '账号维护',
      component: 'mgr/user/index'
    }, {
      id: '0412',
      path: 'menu',
      title: '菜单维护',
      component: 'mgr/menu/index'
    }, {
      id: '0413',
      path: 'press',
      title: '按钮维护',
      component: 'mgr/press/index'
    }, {
      id: '0414',
      path: 'role',
      title: '角色维护',
      component: 'mgr/role/index'
    }, {
      id: '0415',
      path: 'dic',
      title: '字典项维护',
      component: 'mgr/dic/index'
    }]
  }]
}, {
  id: '05',
  path: '/old',
  title: '老人信息管理',
  component: 'layout/Layout',
  children: [{
    id: '0110',
    path: '',
    icon: 'msgOperate',
    title: '老人信息维护',
    component: '',
    children: [{
      id: '0111',
      path: 'elder',
      title: '老人信息查询',
      component: 'dossier/elder/index'
    }, {
      id: '0112',
      path: 'transfer',
      title: '老人异动管理',
      component: 'dossier/transfer/index'
    }, {
      id: '0113',
      path: 'wallet',
      title: '老人钱包',
      component: 'dossier/wallet/index'
    }]
  }, {
    id: '0130',
    path: '',
    icon: 'phyOperate',
    title: '健康管理',
    component: '',
    children: [{
      id: '0131',
      path: 'health',
      title: '健康档案',
      component: 'dossier/health/index'
    }, {
      id: '0132',
      path: 'blood',
      title: '健康监测',
      component: 'dossier/blood/index'
    }, {
      id: '0133',
      path: 'chronic',
      title: '疾病记录',
      component: 'dossier/chronic/index'
    }]
  }]
}, {
  id: '01',
  path: '/sidy',
  title: '补贴管理',
  component: 'layout/Layout',
  children: [{
    id: '0210',
    path: '',
    icon: 'ispOperate',
    title: '补贴管理',
    component: '',
    children: [{
      id: '0211',
      path: 'subsidy',
      title: '补贴标准',
      component: 'provid/subsidy/index'
    }, {
      id: '0212',
      path: 'ratio',
      title: '补贴比例',
      component: 'provid/ratio/index'
    }, {
      id: '0215',
      path: 'district',
      title: '补贴对象',
      component: 'provid/district/index'
    }, {
      id: '0216',
      path: 'account',
      title: '补贴结算统计',
      component: 'provid/account/index'
    }]
  }, {
    id: '0310',
    path: '',
    icon: 'estOperate',
    title: '补贴评估',
    component: '',
    children: [{
      id: '0311',
      path: 'client',
      title: '老人评估',
      component: 'adopt/client/index'
    }]
  }]
}, {
  id: '02',
  path: '/give',
  title: '服务管理',
  component: 'layout/Layout',
  children: [{
    id: '0220',
    path: '',
    icon: 'ispOperate',
    title: '服务管理',
    component: '',
    children: [{
      id: '0221',
      path: 'standard',
      title: '服务商列表',
      component: 'provid/standard/index'
    }, {
      id: '0222',
      path: 'assess',
      title: '服务商考核评估',
      component: 'provid/assess/index'
    }, {
      id: '0223',
      path: 'accrecord',
      title: '服务商对账',
      component: 'provid/accrecord/index'
    }, {
      id: '0225',
      path: 'helper',
      title: '助老员',
      component: 'provid/helper/index'
    }, {
      id: '0226',
      path: 'people',
      title: '服务人员管理',
      component: 'provid/people/index'
    }]
  }, {
    id: '0120',
    path: '',
    icon: 'bunkOperate',
    title: '机构管理',
    component: '',
    children: [{
      id: '0121',
      path: 'organ',
      title: '机构基本信息',
      component: 'dossier/organ/index'
    }, {
      id: '0122',
      path: 'staff',
      title: '机构工作人员',
      component: 'dossier/staff/index'
    }]
  }, {
    id: '0150',
    path: '',
    icon: 'phyOperate',
    title: '信息发布',
    component: '',
    children: [{
      id: '0135',
      path: 'guids',
      title: '养生指导',
      component: 'dossier/guids/index'
    }, {
      id: '0312',
      path: 'policy',
      title: '政策法规',
      component: 'adopt/person/index'
    }]
  }]
}, {
  id: '06',
  path: '/order',
  title: '工单管理',
  component: 'layout/Layout',
  children: [{
    id: '0230',
    path: '',
    icon: 'ordOperate',
    title: '工单管理',
    component: '',
    children: [{
      id: '0231',
      path: 'sheet',
      title: '工单列表',
      component: 'orders/sheet/index'
    }, {
      id: '0232',
      path: 'station',
      title: '服务站派单',
      component: 'orders/station/index'
    }, {
      id: '0233',
      path: 'signed',
      title: '工单结算',
      component: 'orders/signed/index'
    }, {
      id: '0235',
      path: 'grade',
      title: '服务评价',
      component: 'orders/grade/index'
    }, {
      id: '0236',
      path: 'worker',
      title: '工单记录',
      component: 'orders/worker/index'
    }]
  }]
}, {
  id: '08',
  path: '/call',
  title: '呼叫中心',
  component: 'layout/Layout',
  children: [{
    id: '0840',
    path: '',
    icon: 'calOperate',
    title: '呼叫中心',
    component: '',
    children: [{
      id: '0841',
      path: 'index',
      title: '首页',
      component: 'shout/index'
    }, {
      id: '0842',
      path: 'seaton',
      title: '坐席列表',
      component: 'shout/seaton/index'
    }, {
      id: '0843',
      path: 'status',
      title: '坐席状态',
      component: 'shout/status/index'
    }, {
      id: '0844',
      path: 'early',
      title: '预警管理',
      component: 'shout/early/index'
    }, {
      id: '0845',
      path: 'plan',
      title: '任务计划',
      component: 'shout/plan/index'
    }, {
      id: '0846',
      path: 'black',
      title: '黑名单设置',
      component: 'shout/black/index'
    }, {
      id: '0847',
      path: 'complain',
      title: '投诉管理',
      component: 'shout/complain/index'
    }]
  }]
}, {
  id: '07',
  path: '/count',
  title: '数据中心',
  component: 'layout/Layout',
  children: [{
    id: '0330',
    path: '',
    icon: 'tolOperate',
    title: '数据中心',
    component: '',
    children: [{
      id: '0332',
      path: 'statist',
      title: '业务数据分析',
      component: 'adopt/statist/index'
    }, {
      id: '0333',
      path: 'sites',
      title: '服务站点分布',
      component: 'graph/index'
    }]
  }]
}, {
  id: '03',
  path: '/adopt',
  title: '审批管理',
  component: 'layout/Layout',
  children: [{
    id: '0320',
    path: '',
    icon: 'rgnOperate',
    title: '审批管理',
    component: '',
    children: [{
      id: '0321',
      path: 'busine',
      title: '异动审批',
      component: 'adopt/busine/index'
    }, {
      id: '0322',
      path: 'signs',
      title: '签约审批',
      component: 'adopt/signs/index'
    }, {
      id: '0323',
      path: 'seek',
      title: '资讯审批',
      component: 'adopt/seek/index'
    }]
  }]
}, {
  id: '09',
  path: '/aaa',
  title: '资财管理',
  component: 'layout/Layout',
  children: [{
    id: '0910',
    path: '',
    icon: 'rgnOperate',
    title: '财务管理',
    component: '',
    children: [{
      id: '0911',
      path: 'bbb',
      title: '财务管理',
      component: 'adopt/person/index'
    }]
  }]
}, {
  id: '10',
  path: '/ddd',
  title: '视频监控',
  component: 'layout/Layout',
  children: [{
    id: '1010',
    path: '',
    icon: 'sysOperate',
    title: '视频监控',
    component: '',
    children: [{
      id: '1011',
      path: 'ccc',
      title: '视频监控',
      component: 'adopt/person/index'
    }]
  }]
}, {
  id: '11',
  path: '/bbb',
  title: '物联网+',
  component: 'layout/Layout',
  children: [{
    id: '1110',
    path: '',
    icon: 'sysOperate',
    title: '物联网',
    component: '',
    children: [{
      id: '1111',
      path: 'fff',
      title: '物联网',
      component: 'adopt/person/index'
    }]
  }]
}, {
  id: '12',
  path: '/kkk',
  title: '培训管理',
  component: 'layout/Layout',
  children: [{
    id: '1210',
    path: '',
    icon: 'sysOperate',
    title: '培训管理',
    component: '',
    children: [{
      id: '1211',
      path: 'fff',
      title: '培训管理',
      component: 'adopt/person/index'
    }]
  }]
}]