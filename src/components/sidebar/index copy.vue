<template>
    <div :class="{sidebar: true, fold}" :style="{background}">
        <div class="sidebar_item" v-for="item,index in dataList" :key="index">
            <!-- 选项 -->
            <div class="sidebar_item_title" @click="item.children?clickCollapse(index):clickItem(item)" @mouseenter="movein($event,index)" @mouseleave="leave($event,index)">
                <div class="icon">
                    <img v-if="item.icon" :src="item.icon">
                </div>

                <!-- <div :class="{title: true, hide: fold}">
                    <p>{{ item.name }}</p>

                    <div :class="{arrow: true, filp: !item.shrink}">
                        <img v-if="item.children" src="./static/arrow.png" alt="">
                    </div>
                </div> -->
                <transition name="fade">
                    <div class="suspend" :style="{background}" v-if="item.children" v-show="fold && item.float" @mouseenter="movein($event,index)" @mouseleave="leave($event,index)">
                        <p v-for="n,m in item.children" :key="m" @click="clickItem(n)">{{ n.name }}</p>
                    </div>
                </transition>
            </div>
            <!-- 折叠选项 -->
            <div class="subitem" :style="{height: item.shrink ? 0 : unfold[index] + 'px'}" v-if="item.children">
                <div :class="{container: true, hide: fold}">
                    <p v-for="n,m in item.children" :key="m" @click="clickItem(n)">{{ n.name }}</p>
                </div>
            </div>
            <!-- 悬停选项 -->

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
            unfold: [],
        }
    },
    created() {
        this.changeFoldState();
        this.changeFloatState();
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
        changeFoldState() {
            let expandStatus = JSON.parse(sessionStorage.getItem("expandStatus"));

            this.dataList = this.list.map((i, j) => {
                if (!this.fold && expandStatus) {
                    i.shrink = expandStatus[j];
                } else {
                    i.shrink = true;
                }
                return i;
            });
        },
        // 改变悬停状态
        changeFloatState() {
            this.dataList = this.list.map(i => {
                i.float = false;
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
            sessionStorage.setItem("expandStatus", JSON.stringify(this.dataList.map(i => i.shrink)));
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
            console.log("折叠状态:" + val);
            if (val) {
                this.changeFoldState();
                sessionStorage.removeItem("expandStatus");
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
    // overflow-x: hidden;
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
            transition: all 1s;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 0 20px;
            position: relative;

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

            .fade-enter,
            .fade-leave-to {
                opacity: 0;
                transform: scale(0.6);
                transform-origin: 0 0;
                z-index: 0;
            }

            .suspend {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1000;

                p {
                    width: 160px;
                    height: 50px;
                    line-height: 50px;
                    box-sizing: border-box;
                    padding: 0 20px;

                    &:hover {
                        background: rebeccapurple;
                    }
                }
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
            transition-property: transform, opacity;
            transition-duration: 0.2s;
            transform-origin: 0 0;
            z-index: 0;
        }
    }
}

.fold {
    width: 60px;
}
</style>