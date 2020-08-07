const routes = [{
        path: '/',
        redirect: '/dashboard'
    },
    // 大屏
    // {
    //     path: '/globalPage',
    //     component: () =>
    //         import (
    //             /* webpackChunkName: "dashboard" */
    //             '../components/page/globalPage.vue'
    //         ),
    //     meta: { title: '大屏' }
    // },
    // 方圆阀门生产管理系统大屏

    {
        path: '/',
        component: () =>
            import (
                /* webpackChunkName: "home" */
                '../components/common/Home.vue'
            ),
        meta: { title: '大屏' },
        children: [{
                path: '/dashboard',
                component: () =>
                    import (
                        /* webpackChunkName: "dashboard" */
                        '../components/page/Dashboard.vue'
                    ),
                meta: { title: '系统首页' }
            },
            {
                path: '/valvePage',
                component: () =>
                    import (
                        /* webpackChunkName: "dashboard" */
                        '../components/page/valvePage/index.vue'
                    ),
                meta: { title: '方圆阀门生产管理系统大屏' }
            },
            // 质检管理
            {
                path: '/productQuality',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/quality/productQuality'
                    ),
                meta: { title: '产品质检', keepAlive: false }
            },
            {
                path: '/partQuality',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/quality/partQuality'
                    ),
                meta: { title: '零件质检', keepAlive: false }
            },
            {
                path: '/guideQuality',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/quality/guideQuality'
                    ),
                meta: { title: '导轨质检', keepAlive: false }
            },

            //生产管理 1部
            {
                path: '/productTask',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/productionone/productTask'
                    ),
                meta: { title: '产品任务', keepAlive: false }
            },
            {
                path: '/partTask',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/productionone/partTask'
                    ),
                meta: { title: '零件任务', keepAlive: false }
            },
            {
                path: '/productAssemble',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/productionone/productAssemble'
                    ),
                meta: { title: '产品装配工单', keepAlive: false }
            },
            {
                path: '/partTaskPlan',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/productionone/partTaskPlan'
                    ),
                meta: { title: '零件生产工单', keepAlive: false }
            },
            {
                path: '/partDeliver',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/productionone/partDeliver'
                    ),
                meta: { title: '发料确认', keepAlive: false }
            },

            //生产管理 2部
            {
                path: '/guideTask',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/productiontwo/guideTask'
                    ),
                meta: { title: '导轨任务', keepAlive: false }
            },
            {
                path: '/guideTaskPlan',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/productiontwo/guideTaskPlan'
                    ),
                meta: { title: '导轨生产工单', keepAlive: false }
            },

            //数据统计
            {
                path: '/productstatistics',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/datastat/productstatistics'
                    ),
                meta: { title: '产品统计', keepAlive: false }
            },
            {
                path: '/partstatistics',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/datastat/partstatistics'
                    ),
                meta: { title: '零件统计', keepAlive: false }
            },
            {
                path: '/guidestatistics',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/datastat/guidestatistics'
                    ),
                meta: { title: '导轨品质统计', keepAlive: false }
            },
            {
                path: '/devicemain',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/datastat/devicemain.vue'
                    ),
                meta: { title: '设备保养', keepAlive: false }
            },
            {
                path: '/devicerepair',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/datastat/devicerepair.vue'
                    ),
                meta: { title: '设备维修', keepAlive: false }
            },
            {
                path: '/guideProcess',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/datastat/guideProcess'
                    ),
                meta: { title: '线轨生产追溯', keepAlive: false }
            },

            // 工资管理

            {
                path: '/currentsalary',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/salary/currentsalary'
                    ),
                meta: { title: '当前工资', keepAlive: false }
            },
            {
                path: '/historysalary',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/salary/historysalary'
                    ),
                meta: { title: '历史工资', keepAlive: false }
            },
            //人员管理

            {
                path: '/record',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/record'
                    ),
                meta: { title: '设备档案', keepAlive: false }
            },
            {
                path: '/staff',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/staff.vue'
                    ),
                meta: { title: '员工管理', keepAlive: false }
            },
            {
                path: '/jurisdiction',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/jurisdiction.vue'
                    ),
                meta: { title: '权限管理', keepAlive: false }
            },
            {
                path: '/tool',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/tool'
                    ),
                meta: { title: '工具管理', keepAlive: false }
            },
            {
                path: '/workprocess',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/workprocess'
                    ),
                meta: { title: '工序配置', keepAlive: false }
            },
            {
                path: '/jurisdiction',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/jurisdiction.vue'
                    ),
                meta: { title: '权限管理', keepAlive: false }
            },
            {
                path: '/rawmaterial',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/rawmaterial'
                    ),
                meta: { title: '原材料管理', keepAlive: false }
            },
            {
                path: '/standardpart',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/standardpart'
                    ),
                meta: { title: '标准件管理', keepAlive: false }
            },
            {
                path: '/part',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/part'
                    ),
                meta: { title: '零件管理', keepAlive: false }
            },
            {
                path: '/product',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/product'
                    ),
                meta: { title: '产品管理', keepAlive: false }
            },

            {
                path: '/workPrice',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/workPrice'
                    ),
                meta: { title: '工价管理', keepAlive: false }
            },
            {
                path: '/guide',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/permanagement/guide'
                    ),
                meta: { title: '导轨管理(生产二部)', keepAlive: false }
            },

            // 维保管理
            {
                path: '/mainplan',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/main/mainplan.vue'
                    ),
                meta: { title: '维保计划', keepAlive: false }
            },
            {
                path: '/mainrecord',
                name: 'mainrecord',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/main/mainrecord.vue'
                    ),
                meta: { title: '保养记录', keepAlive: false }
            },
            {
                path: '/repairrecord',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/main/repairrecord.vue'
                    ),
                meta: { title: '维修记录', keepAlive: false }
            },

            // 配置管理

            {
                path: '/table',
                component: () =>
                    import (
                        /* webpackChunkName: "table" */
                        '../components/page/BaseTable.vue'
                    ),
                meta: { title: '基础表格' }
            },
            {
                path: '/tabs',
                component: () =>
                    import (
                        /* webpackChunkName: "tabs" */
                        '../components/page/Tabs.vue'
                    ),
                meta: { title: 'tab选项卡' }
            },
            {
                path: '/form',
                component: () =>
                    import (
                        /* webpackChunkName: "form" */
                        '../components/page/BaseForm.vue'
                    ),
                meta: { title: '基本表单' }
            },

            {
                // 图片上传组件
                path: '/upload',
                component: () =>
                    import (
                        /* webpackChunkName: "upload" */
                        '../components/page/Upload.vue'
                    ),
                meta: { title: '文件上传' }
            },

            {
                // 权限页面
                path: '/permission',
                component: () =>
                    import (
                        /* webpackChunkName: "permission" */
                        '../components/page/Permission.vue'
                    ),
                meta: { title: '权限测试', permission: true }
            },
            {
                path: '/404',
                component: () =>
                    import (
                        /* webpackChunkName: "404" */
                        '../components/page/404.vue'
                    ),
                meta: { title: '404' }
            },
            {
                path: '/403',
                component: () =>
                    import (
                        /* webpackChunkName: "403" */
                        '../components/page/403.vue'
                    ),
                meta: { title: '403' }
            }
        ]
    },
    {
        path: '/login',
        component: () =>
            import (
                /* webpackChunkName: "login" */
                '../components/page/Login.vue'
            ),
        meta: { title: '威肯特生产管理系统' }
    },
    {
        path: '/headman',
        // redirect: '/headman',
        component: () =>
            import (
                /* webpackChunkName: "login" */
                '../components/page/headman/index.vue'
            ),

        meta: { title: '领单报工', keepAlive: false }
    },
    // 设置动态路由时需要注释
    {
        path: '*',
        redirect: '/404'
    }
];
export default routes;