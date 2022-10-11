<template>
    <div class="verification-code" :style="{width: contentWidth + 'px',height: contentHeight + 'px'}" @click="takeChange()">
        <canvas id="canvas" :width="contentWidth" :height="contentHeight"></canvas>
    </div>
</template>

<script>
import props from "./props.js";
export default {
    mixins: [props],
    data() {
        return {
            identifyCode: null, // 验证码
        }
    },
    mounted() {
        this.randomCode()
    },
    methods: {
        // 生成随机码
        randomCode() {
            if (this.code) {
                this.identifyCode = this.code
            } else {
                this.identifyCode = ""
                for (let i = 0; i < this.length; i++) {
                    let random = Math.floor((Math.random() * 62))
                    if (random <= 9) {
                        this.identifyCode += random
                    } else if (random <= 35) {
                        this.identifyCode += String.fromCharCode(random - 10 + 65)
                    } else if (random <= 61) {
                        this.identifyCode += String.fromCharCode(random - 36 + 97)
                    }
                }
                this.$emit("change", this.identifyCode)
            }

            this.drawPic()
        },
        /**
         * 生成随机数
         * @param {number} min 最小值
         * @param {number} max 最大值
         * @returns {number} 随机数
         */
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        /**
         * 生成随机颜色
         * @param {number} min 最小值
         * @param {number} max 最大值
         * @returns {string} 随机颜色
         */
        randomColor(min, max) {
            var r = this.randomNum(min, max)
            var g = this.randomNum(min, max)
            var b = this.randomNum(min, max)
            return 'rgb(' + r + ',' + g + ',' + b + ')'
        },
        // 绘制图片
        drawPic() {
            var canvas = document.getElementById('canvas')
            var ctx = canvas.getContext('2d')
            ctx.textBaseline = 'bottom'
            // 绘制背景
            ctx.fillStyle = this.randomColor(
                this.backgroundColorMin,
                this.backgroundColorMax
            )
            ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
            // 绘制文字
            for (let i = 0; i < this.identifyCode.length; i++) {
                this.drawText(ctx, this.identifyCode[i], i)
            }
            this.drawLine(ctx)
            this.drawDot(ctx)
        },
        /**
         * 绘制文字
         * @param {object} ctx canvas元素
         * @param {string} txt 绘制的字符
         * @param {number} i 字符索引
         */
        drawText(ctx, txt, i) {
            ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
            ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
            var bisect = (this.contentWidth - 20) / this.identifyCode.length
            var x = i * bisect + bisect / 2
            var y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
            var deg = this.randomNum(-30, 30)
            // 修改坐标原点和旋转角度
            ctx.translate(x, y)
            ctx.rotate(deg * Math.PI / 270)
            ctx.fillText(txt, 0, 0)
            // 恢复坐标原点和旋转角度
            ctx.rotate(-deg * Math.PI / 270)
            ctx.translate(-x, -y)
        },
        /**
         * 绘制干扰线
         * @param {object} ctx canvas元素
         */
        drawLine(ctx) {
            for (let i = 0; i < 2; i++) {
                ctx.strokeStyle = this.randomColor(
                    this.lineColorMin,
                    this.lineColorMax
                )
                ctx.beginPath()
                ctx.moveTo(
                    this.randomNum(0, this.contentWidth),
                    this.randomNum(0, this.contentHeight)
                )
                ctx.lineTo(
                    this.randomNum(0, this.contentWidth),
                    this.randomNum(0, this.contentHeight)
                )
                ctx.stroke()
            }
        },
        /**
         * 绘制干扰点
         * @param {object} ctx canvas元素
         */
        drawDot(ctx) {
            for (let i = 0; i < 20; i++) {
                ctx.fillStyle = this.randomColor(0, 255)
                ctx.beginPath()
                ctx.arc(
                    this.randomNum(0, this.contentWidth),
                    this.randomNum(0, this.contentHeight),
                    1,
                    0,
                    2 * Math.PI
                )
                ctx.fill()
            }
        },
        // 将要改变
        takeChange() {
            if (this.code) {
                this.$emit("takeChange")
            } else {
                this.randomCode()
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.verification-code {
    cursor: pointer;

    #canvas {
        border-radius: 4px;
    }
}
</style>