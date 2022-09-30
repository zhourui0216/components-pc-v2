<template>
    <div class="sidebar" :style="{width: fold ? foldWidth : width, background}">
        <!-- 打开 -->
        <div class="open" v-if="!fold">
            <div class="item" v-for="item,index in dataList" :key="index">
                <div class="title" @click="item.path ? jump(item.path) : openOption(index)">
                    <div class="icon">
                        <img :src="item.icon" alt="">
                    </div>

                    <div class="name">
                        <p :style="{color}">{{ item.name }}</p>
                    </div>

                    <div class="arrow">
                        <img v-if="!item.path" src="./static/arrow.png" alt="">
                    </div>
                </div>

                <!-- 选项 -->
                <div class="option" :style="{height: item.open ? heightList[index] + 'px' : 0}" v-if="!item.path">
                    <div class="container">
                        <p :style="{color}" v-for="n,m in item.children" :key="m">
                            {{ n.name }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 收起 -->
        <div class="stow" v-else @scroll="scroll">
            <div class="item" v-for="item,index in dataList" :key="index">
                <img class="icon" :src="item.icon" alt="">

                <!-- 选项 -->
                <div class="option">
                    <p :style="{color}" v-for="n,m in item.children" :key="m">
                        {{ n.name }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import props from "./props.js"
export default {
    mixins: [props],
    data() {
        return {
            dataList: [],
            heightList: [],
        }
    },
    created() {
        if (this.fold) {
            sessionStorage.removeItem("openState");
        }
        this.addCollapseState();
    },
    mounted() {
        this.getUnfoldHeight();
    },
    methods: {
        // 添加折叠状态
        addCollapseState() {
            let openState = JSON.parse(sessionStorage.getItem("openState"))
            console.log(this.fold)
            this.dataList = this.list.map((i, j) => {
                i.open = false;
                i.hover = false;
                return i;
            });
        },
        // 获取选项展开高度
        getUnfoldHeight() {
            let item = Array.from(document.querySelectorAll(".sidebar .open .item"));
            console.log(item)
            item.forEach((i, j) => {
                let subitem = i.querySelector(".item .option .container");
                if (subitem) {
                    subitem.style.height = subitem.offsetHeight + "px";
                    this.heightList[j] = subitem.offsetHeight;
                } else {
                    this.heightList[j] = 0;
                }
            })
            console.log(this.heightList)
        },
        // 展开选项
        openOption(index) {
            console.log(index)
            this.dataList[index].open = !this.dataList[index].open;
            this.$forceUpdate();

            let openState = JSON.stringify(this.dataList.map(i => i.open));
            sessionStorage.setItem("openState", openState);
        },
        // 滚动
        scroll(e) {
            console.log(e.target.scrollTop)
        },
        // 跳转
        jump(url) {
            console.log("跳转")
            if (this.$route.path == url) {
                // 刷新页面
                // location.reload();
                return
            }
            this.$router.push({ path: url })
        },
    },
    watch: {
        /**
         * 监听折叠状态
         * 折叠时，关闭所有
         * 若fold初始状态为true(折叠)，再展开时，只要有二级菜单，就获取展开高度
         */
        fold(val) {
            if (val) {
                this.addCollapseState();
                sessionStorage.removeItem("openState");
            } else {
                setTimeout(e => {
                    if (this.dataList.some(i => !i.path)) {
                        this.getUnfoldHeight();
                    }
                }, 0)
            }
        },
    }
}
</script>

<style scoped lang="scss">
.sidebar {
    height: 100%;
    user-select: none;
    transition: all 0.4s;

    .open,
    .stow {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;

        scrollbar-width: thin; // Firefox
        scrollbar-color: #96989c #333744; // Firefox

        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background: #333744;
        }

        &::-webkit-scrollbar-thumb {
            background: #96989c;
        }

        &::-webkit-scrollbar-corner {
            background: #333744;
        }
    }

    .open {
        .item {
            width: 100%;

            .title {
                width: 100%;
                height: 50px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                padding: 0 0 0 20px;
                cursor: pointer;

                .icon {
                    width: 20px;
                    min-width: 20px;
                    height: 20px;
                    margin-right: 10px;

                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }

                .name {
                    width: 115px;
                    min-width: 115px;

                    p {
                        width: 100%;
                        font-size: 16px;
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                .arrow {
                    width: 10px;
                    min-width: 10px;
                    height: 10px;
                    margin-left: 5px;

                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
            }

            .option {
                width: 100%;
                overflow: hidden;
                transition: all 0.4s;

                p {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    box-sizing: border-box;
                    padding: 0 20px 0 50px;
                    cursor: pointer;
                }
            }
        }
    }

    .stow {
        .item {
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding-left: 20px;

            .icon {
                width: 20px;
                height: 20px;
            }

            .option {
                position: fixed;
                left: 60px;
                z-index: 1000;
                cursor: pointer;

                p {
                }
            }
        }
    }
}
</style>