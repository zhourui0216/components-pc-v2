<template>
    <div class="home">
        <sidebar :list="list" :fold="fold"></sidebar>
        <button @click="fold=!fold">切换</button>
    </div>
</template>

<script>
import sidebar from "../components/sidebar/index.vue"
export default {
    components: {
        sidebar
    },
    data() {
        return {
            list: [{
                name: "首页",
                path: "/",
                icon: require("../assets/logo.png"),
                children: [{
                    name: "机构业绩",
                    path: "/home/agencyAchievement"
                }]
            },
            {
                name: "服务管理",
                icon: require("../assets/logo.png"),
                children: [{
                    name: "服务类型",
                    path: "/serviceManage/serviceType"
                },
                {
                    name: "服务商品",
                    path: "/serviceManage/serviceGoods"
                },
                {
                    name: "推荐服务",
                    path: "/serviceManage/recommendedServices"
                }]
            },
            {
                name: "佣工管理",
                icon: require("../assets/logo.png"),
                children: [{
                    name: "服务佣工",
                    path: "/servantsManage/serviceServant"
                },
                {
                    name: "品牌佣工",
                    path: "/servantsManage/brandServant"
                },
                {
                    name: "在线佣工",
                    path: "/servantsManage/onlineHelpers"
                },
                {
                    name: "佣工审核",
                    path: "/servantsManage/helperReview"
                },
                {
                    name: "证书类型",
                    path: "/servantsManage/certificateType"
                },
                {
                    name: "证书审核",
                    path: "/servantsManage/certificateAudit"
                }]
            },
            {
                name: "订单管理",
                icon: require("../assets/logo.png"),
                children: [{
                    name: "订单列表",
                    path: "/orderManage/orderList"
                },
                {
                    name: "订单转单",
                    path: "/orderManage/orderTransfer"
                }]
            },
            {
                name: "轮播图管理",
                icon: require("../assets/logo.png"),
                children: [{
                    name: "小程序&可视对讲",
                    path: "/bannerManage/appletBanner"
                },
                {
                    name: "App",
                    path: "/bannerManage/appBanner"
                }]
            },
            {
                name: "信息管理",
                icon: require("../assets/logo.png"),
                children: [{
                    name: "用户信息",
                    path: "/infoManage/customerInfo"
                },
                {
                    name: "反馈列表",
                    path: "/infoManage/feedbackList"
                }]
            },
            {
                name: "机构管理",
                icon: require("../assets/logo.png"),
                children: [{
                    name: "机构列表",
                    path: "/agencyManage/agencyList"
                },
                {
                    name: "机构账户",
                    path: "/agencyManage/agencyAccount"
                }]
            },
            {
                name: "系统管理",
                icon: require("../assets/logo.png"),
                children: [{
                    name: "账户列表",
                    path: "/systemManage/accountList"
                }]
            }],
            fold: true
        }
    }
}

</script>

<style lang="scss" scoped>
.home {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    justify-content: space-between;
}
</style>
