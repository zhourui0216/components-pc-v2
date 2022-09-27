<template>
    <div :class="{sidebar: true, fold}">
        <div class="sidebar_item" v-for="item,index in dataList" :key="index">
            <div class="sidebar_item_title" @click="item.children?clickCollapse(index):clickItem(item)" @mouseenter="movein($event,index)" @mouseleave="leave($event,index)">
                <div class="icon">
                    <img v-if="item.icon" :src="item.icon">
                </div>

                <div :class="{title: true, hide: fold}">
                    <p>{{ item.name }}</p>

                    <div :class="{arrow: true, filp: !item.shrink}">
                        <img v-if="item.children" src="./assets/arrow.png" alt="">
                    </div>
                </div>
            </div>
            <!-- 折叠选项 -->
            <div class="subitem" :style="{height: item.shrink ? 0 : unfold[index] + 'px'}" v-if="item.children">
                <div :class="{container: true, hide: fold}">
                    <p v-for="n,m in item.children" :key="m" @click="clickItem(n)">{{ n.name }}</p>
                </div>
            </div>
            <!-- 悬停选项 -->
            <transition name="fade">
                <div class="suspend" v-if="item.children" v-show="fold && item.float" @mouseenter="movein($event,index)" @mouseleave="leave($event,index)">
                    <p v-for="n,m in item.children" :key="m" @click="clickItem(n)">{{ n.name }}</p>
                </div>
            </transition>
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
            unfold: []
        }
    },
    created() {
        this.changeFoldState(true);
        this.changeFloatState(false);
    },
    mounted() {
        this.getSubitemHeight();
    },
    methods: {
        // 获取子选项高度
        getSubitemHeight() {
            let item = Array.from(document.querySelectorAll(".sidebar_item"));
            item.forEach((i, j) => {
                let subitem = i.querySelector(".container");
                this.unfold[j] = subitem ? subitem.offsetHeight : 0;
            })
        },
        // 改变折叠状态
        changeFoldState(val) {
            this.dataList = this.list.map(i => {
                i.shrink = val;
                return i;
            })
        },
        // 改变悬停状态
        changeFloatState(val) {
            this.dataList = this.list.map(i => {
                i.float = val;
                return i;
            })
        },
        // 移入
        movein(e, index) {
            if (!this.fold) return;
            this.dataList[index].float = true;
            this.$forceUpdate();

            let item_el = document.querySelectorAll(".sidebar_item")[index]
            let suspend_el = item_el.querySelector(".suspend")
            if (suspend_el) {
                suspend_el.style.top = item_el.offsetTop + "px";
                suspend_el.style.left = item_el.offsetWidth + "px";
            }
        },
        // 离开
        leave(e, index) {
            if (!this.fold) return;
            console.log("移出")
            this.dataList[index].float = false;
            this.$forceUpdate();
        },
        // 点击标题
        clickTitle(item) {
            console.log(item)
            console.log("点击项")
        },
        // 点击折叠选项
        clickCollapse(index) {
            if (this.fold) return;
            this.dataList[index].shrink = !this.dataList[index].shrink;
            this.$forceUpdate();
        },
        // 点击选项
        clickItem(item) {
            if (this.$route.path == item.path) {
                // location.reload();
                return
            }
            this.$router.push(item.path);
        },
    },
    watch: {
        fold(val) {
            if (val) {
                this.changeFoldState(true);
            } else {
                setTimeout(e => {
                    this.getSubitemHeight();
                }, 0)
            }
        },
    }
}
</script>

<style scoped lang="scss">
.sidebar {
    width: 200px;
    height: 100%;
    background: #ccc;
    user-select: none;
    overflow-x: hidden;
    overflow-y: auto;
    transition: 0.4s;
    // 火狐滚动条
    scrollbar-width: thin;
    scrollbar-color: #96989c #333744;

    &::-webkit-scrollbar {
        width: 8px;
        background: #333744;
    }

    &::-webkit-scrollbar-thumb {
        background: #96989c;
    }

    &_item {
        &_title {
            width: 100%;
            min-height: 50px;
            font-size: 16px;
            transition: all 0.1s;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 0 20px;

            &:hover {
                background: rebeccapurple;
            }

            .icon {
                width: 20px;
                min-width: 20px;
                height: 20px;
                margin-right: 10px;

                img {
                    width: 20px;
                    height: 20px;
                }
            }

            .title {
                display: flex;
                align-items: center;

                p {
                    width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .arrow {
                    width: 10px;
                    height: 10px;
                    transition: all 0.4s;

                    img {
                        width: 10px;
                        height: 10px;
                        display: block;
                    }
                }

                .filp {
                    transform: rotate(180deg);
                    transform-origin: 50% 50%;
                }
            }

            .hide {
                display: none;
            }
        }

        .subitem {
            overflow: hidden;
            transition: all 0.4s;

            .container {
                p {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    box-sizing: border-box;
                    padding: 0 30px 0 50px;
                }
            }

            .hide {
                display: none;
            }
        }

        .fade-enter-active,
        .fade-leave-active {
            transition: all 0.2s;
            transform-origin: 10% 10%;
            z-index: 0;
        }

        .fade-enter,
        .fade-leave-to {
            opacity: 0;
            transform: scale(0.8);
            transform-origin: 10% 10%;
            z-index: 0;
        }

        .suspend {
            width: 160px;
            height: 50px;
            line-height: 50px;
            background: #96989c;
            box-sizing: border-box;
            padding: 0 20px;
            position: fixed;
        }
    }
}

.fold {
    width: 60px;
}
</style>