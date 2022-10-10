<template>
    <div class="input-box">
        <input :class="{active: active, padr: show_pw}" :type="showpw?'text':'password'" :value="value" :placeholder="placeholder" :minlength="minlength" :maxlength="maxlength" @focus="changeState(true)" @input="entering" @change="change" @blur="changeState(false)">
        <img src="./static/pw_hide.png" @click="showpw=!showpw" v-show="show_pw && showpw">
        <img src="./static/pw_show.png" @click="showpw=!showpw" v-show="show_pw && !showpw">
    </div>
</template>

<script>
import props from "./props.js"
export default {
    mixins: [props],
    data() {
        return {
            minlength: null,
            maxlength: null,
            showpw: false,
            preval: null, // 记录值
            active: false, // 是否获取焦点
            timer: null, // 计时器
        }
    },
    created() {
        console.log(this.clearable)
        if (this.type == "cardid") {
            this.minlength = 18;
            this.maxlength = 18;
        } else if (this.type == "tel") {
            this.minlength = 11;
            this.maxlength = 11;
        } else {
            this.minlength = this.minlen;
            this.maxlength = this.maxlen;
        }

        this.preval = this.value;
    },
    methods: {
        // 改变状态
        changeState(val) {
            this.active = val;
        },
        // 输入触发
        entering(e) {
            let value = e.target.value;

            if (this.type == "number") {
                value = parseInt(value.replace(/[^0-9]+/, ""));
            } else if (this.type == "decimal") {
                value = value.replace(/[^0-9.]+/, "");

                if (value.indexOf(".") >= 0 && value.indexOf(".") != value.lastIndexOf(".")) {
                    value = value.slice(0, value.lastIndexOf("."));
                }
            } else if (this.type == "cardid") {
                value = value.replace(/[^0-9X]+/, "");
            } else if (this.type == "tel") {
                // 是否1开头
                if (/^(?!1)\d+/g.test(value)) {
                    value = "";
                } else {
                    value = value.replace(/[^0-9]+/, "");
                }
            } else if (this.filterChar) {
                // 未指定类型时可根据传入条件替换传入值
                value = value.replace(this.filterChar, this.repVal);
            }

            this.$emit("input", value);
            this.$forceUpdate();

            // 输入计时触发
            clearTimeout(this.timer);
            this.timer = setTimeout(data => {
                if (value.length && value != this.preval) {
                    this.preval = value;
                    this.$emit("search", value);
                }
            }, this.triggerTime)
        },
        // 改变触发
        change(e) {
            let value = e.target.value;
            // 处理小数时数据类型
            if (this.type == "decimal" && value) {
                this.$emit("input", parseFloat(value));
            } else {
                // 未指定类型时可删除首尾空格
                value = value.replace(/(^\s+|\s+$)/g, "");
                this.$emit("input", value);
            }
        },
    }
}
</script>

<style scoped lang="scss">
.input-box {
    width: 100%;
    position: relative;

    input {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #606266;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        outline: none;
        transition: all 0.2s;
        box-sizing: border-box;
        padding: 0 15px;

        &::placeholder {
            color: #d0d3da;
        }

        &:hover {
            border: 1px solid #bbbdc3;
        }
    }

    .active {
        border: 1px solid #2daeee;

        &:hover {
            border: 1px solid #2daeee;
        }
    }

    .padl {
        box-sizing: border-box;
        padding-left: 30px;
    }

    .padr {
        box-sizing: border-box;
        padding-right: 30px !important;
    }

    img {
        width: 20px;
        height: 20px;
        transform: translateY(-50%);
        display: block;
        position: absolute;
        top: 50%;
        right: 0;
    }
}
</style>