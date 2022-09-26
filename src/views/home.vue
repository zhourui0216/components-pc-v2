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
                    name: "首页首页首页首页首页首页",
                    icon: require("../assets/logo.png")
                },
                {
                    name: "管理1管理1管理1管理1",
                    icon: require("../assets/logo.png"),
                    children: [
                        {
                            name: "子项"
                        },
                        {
                            name: "子项"
                        },
                        {
                            name: "子项"
                        },
                        {
                            name: "子项"
                        },
                        {
                            name: "子项"
                        },
                        {
                            name: "子项"
                        },
                        {
                            name: "子项"
                        },
                    ]
                },
                {
                    name: "管理2管理2管理2管理2",
                    icon: require("../assets/logo.png"),
                    children: [
                        {
                            name: "子项"
                        }
                    ]
                },
                {
                    name: "管理3",
                    icon: require("../assets/logo.png"),
                },
                {
                    name: "管理4",
                    icon: require("../assets/logo.png"),
                },
                {
                    name: "管理5",
                    icon: require("../assets/logo.png"),
                },
                {
                    name: "管理6",
                    icon: require("../assets/logo.png"),
                },
                {
                    name: "管理7",
                    icon: require("../assets/logo.png"),
                },
                {
                    name: "管理8",
                    icon: require("../assets/logo.png"),
                },
            ],
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
