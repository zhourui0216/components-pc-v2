<template>
    <div class="home">
        <sidebar :list="list" :fold="fold"></sidebar>
        <button @click="fold=!fold">切换</button>
    </div>
</template>

<script>
import sidebar from "../components/sidebar/sidebar.vue"
export default {
    components: {
        sidebar
    },
    data() {
        return {
            list: [
                {
                    name: "首页",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理1",
                    icon: require("../assets/logo.png"),
                    children: [
                        {
                            name: "子项",
                            path: "/a"
                        },
                        {
                            name: "子项",
                            path: "/b"
                        },
                        {
                            name: "子项",
                            path: "/c"
                        },
                        {
                            name: "子项",
                            path: "/d"
                        },
                    ]
                },
                {
                    name: "管理2",
                    icon: require("../assets/logo.png"),
                    children: [
                        {
                            name: "其他项",
                            path: "/"
                        }
                    ]
                },
                {
                    name: "管理3",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理4",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理5",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理3",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理4",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理5",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理3",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理4",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理5",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理3",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理4",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理5",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理3",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理4",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理5",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理3",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理4",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理5",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理3",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理4",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理5",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理3",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理4",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
                {
                    name: "管理5",
                    icon: require("../assets/logo.png"),
                    path: "/"
                },
            ],
            fold: false
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
