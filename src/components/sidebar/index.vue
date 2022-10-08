<template>
    <div class="sidebar" :style="{width: fold ? '60px' : '200px', background}">
        <!-- 打开 -->
        <div class="open" v-if="!fold">
            <div class="item" v-for="item,index in dataList" :key="index">
                <div class="title" @click="item.path ? jump(item.path) : openOption(index)">
                    <div class="icon">
                        <img :src="item.icon" alt="">
                    </div>

                    <div class="name">
                        <p :style="{color}">
                            {{ item.name }}
                        </p>
                    </div>

                    <div :class="{arrow: true, filp: item.open}">
                        <img v-if="!item.path" src="./static/arrow.png" alt="">
                    </div>
                </div>

                <!-- 选项 -->
                <div class="option" :style="{height: item.open ? heightList[index] + 'px' : 0}" v-if="!item.path">
                    <div class="container">
                        <p v-for="n,m in item.children" :key="m" @click="jump(n.path)">
                            {{ n.name }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 收起 -->
        <div class="stow" v-else @scroll="scroll">
            <div class="item" :style="{background: active[0]===index ? active_bg : ''}" v-for="item,index in dataList" :key="index" @mouseenter="movein($event, index)" @mouseleave="remove(index)">
                <img class="icon" :src="item.icon" alt="">

                <!-- 选项 -->
                <transition name="scale" mode="out-in">
                    <div class="option" v-show="item.hover">
                        <p :style="{color: active[1]===m && active[0]===index ? active_col : color, background: active[1]===m && active[0]===index ? active_bg : background}" v-for="n,m in item.children" :key="m" @mouseenter="submovein(index, m)" @mouseleave="subremove" @click="jump(n.path)">
                            {{ n.name }}
                        </p>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import props from "./props.js";
export default {
    mixins: [props],
    data() {
        return {
            dataList: [],
            heightList: [],
            active: [],
        }
    },
    created() {
        // 如果折叠清空展开状态
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
            let openState = JSON.parse(sessionStorage.getItem("openState"));
            this.dataList = this.list.map((i, j) => {
                // 如果初始展开并且有保存折叠状态，就获取展开状态的值
                if (!this.fold && openState) {
                    i.open = openState[j];
                } else {
                    i.open = false;
                }

                i.hover = false;
                return i;
            });
        },
        // 获取选项展开高度
        getUnfoldHeight() {
            let item = Array.from(document.querySelectorAll(".sidebar .open .item"));
            item.forEach((i, j) => {
                let subitem = i.querySelector(".item .option .container");
                if (subitem) {
                    subitem.style.height = subitem.offsetHeight + "px";
                    this.heightList[j] = subitem.offsetHeight;
                } else {
                    this.heightList[j] = 0;
                }
            })
            this.$forceUpdate();
        },
        // 展开选项
        openOption(index) {
            this.dataList[index].open = !this.dataList[index].open;
            this.$forceUpdate();

            let openState = JSON.stringify(this.dataList.map(i => i.open));
            sessionStorage.setItem("openState", openState);
        },
        // 移入
        movein(e, index) {
            this.active = [index];

            if (this.dataList[index].path) {
                return
            }

            this.dataList = this.dataList.map(i => {
                i.hover = false;
                return i;
            });
            this.dataList[index].hover = true;
            this.$forceUpdate();

            if (e) {
                let stow_scroll = document.querySelector(".stow").scrollTop;
                this.setFixTop(stow_scroll);
            }
        },
        // 子项移入
        submovein(index, m) {
            this.active = [index, m];
            this.$forceUpdate();
        },
        // 子项移出
        subremove() {
            this.active.pop();
            this.$forceUpdate();
        },
        // 移出
        remove(index) {
            this.active = [];
            this.dataList = this.dataList.map(i => {
                i.hover = false;
                return i;
            });
        },
        // 滚动
        scroll(e) {
            if (this.dataList[this.active[0]].path) {
                return
            }
            this.setFixTop(e.target.scrollTop);
        },
        // 设置定位位置
        setFixTop(scroll_top) {
            let el_item = document.querySelectorAll(".stow .item")[this.active[0]];
            let el_option = el_item.querySelector(".option");
            if (el_option) {
                el_option.style.top = el_item.offsetTop - scroll_top + "px";
                el_option.style.left = el_item.offsetWidth + "px";
            }
        },
        // 跳转
        jump(url) {
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
         * 如果fold初始状态为true(折叠)，再展开时，只要有二级菜单，就获取展开高度，否则无法展开
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
    transition: width 0.4s;

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
                    transition: transform 0.4s;
                    margin-left: 5px;

                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }

                .filp {
                    transform: rotate(180deg);
                    transform-origin: 50% 50%;
                }
            }

            .option {
                width: 100%;
                overflow: hidden;
                transition: height 0.4s;

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
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding-left: 20px;
            cursor: pointer;

            .icon {
                width: 20px;
                height: 20px;
            }

            .scale-enter,
            .scale-leave-to {
                transform: scale(0.6);
                transform-origin: 0 0;
                opacity: 0;
                z-index: 0;
            }

            .scale-enter-active,
            .scale-leave-active {
                transition-property: transform, opacity;
                transition-duration: 0.2s;
                transform-origin: 0 0;
                z-index: 0;
            }

            .option {
                padding-left: 2px;
                position: fixed;
                left: 60px;
                z-index: 1000;
                cursor: pointer;

                p {
                    width: 160px;
                    height: 50px;
                    line-height: 50px;
                    font-size: 14px;
                    transition-property: color, background-color;
                    transition-duration: 0.2s;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    box-sizing: border-box;
                    padding: 0 20px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>