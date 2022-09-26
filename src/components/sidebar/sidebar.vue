<template>
    <div :class="{sidebar: true, fold}">
        <div class="sidebar_item" v-for="item,index in dataList" :key="index">
            <div class="sidebar_item_title" @click="item.children?clickCollapse(index):clickTitle(index)">
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
            <div class="subitem" :style="{height: item.shrink ? 0 : unfold[index] + 'px'}" v-if="item.children">
                <div :class="{container: true, hide: fold}">
                    <p v-for="n,m in item.children" :key="m">{{ n.name }}</p>
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
            unfold: []
        }
    },
    created() {
        this.dataList = this.list.map(i => {
            i.shrink = true;
            return i;
        })
    },
    mounted() {
        this.getSubitemHeight();
    },
    methods: {
        // 点击标题
        clickTitle(index) {
            console.log("点击项")
        },
        // 点击折叠
        clickCollapse(index) {
            console.log("点击折叠")
            this.dataList[index].shrink = !this.dataList[index].shrink;
            this.$forceUpdate();
        },
        getSubitemHeight() {
            console.log("获取高度")
            let item = Array.from(document.querySelectorAll(".sidebar_item"));
            console.log(item);
            item.forEach((i, j) => {
                let subitem = i.querySelector(".container");
                this.unfold[j] = subitem ? subitem.offsetHeight : 0;
            })
            console.log(this.unfold);
        }
    },
    watch: {
        fold(val) {
            console.log(val)
            if (val) {
                this.dataList = this.list.map(i => {
                    i.shrink = true;
                    return i;
                })
            } else {
                setTimeout(e=>{
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
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 0 20px;

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
                    box-sizing: border-box;
                    padding: 0 30px 0 50px;
                }
            }

            .hide {
                display: none;
            }
        }
    }
}

.fold {
    width: 60px;
}
</style>