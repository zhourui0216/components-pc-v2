export default {
    props: {
        // 验证码
        code: {
            type: String,
            default: null
        },
        // 自动生成长度
        length: {
            type: Number,
            default: 4
        },
        // 宽度
        contentWidth: {
            type: Number,
            default: 120
        },
        // 高度
        contentHeight: {
            type: Number,
            default: 40
        },
        // 最小字体大小
        fontSizeMin: {
            type: Number,
            default: 28
        },
        // 最大字体大小
        fontSizeMax: {
            type: Number,
            default: 36
        },
        // 最小背景颜色范围
        backgroundColorMin: {
            type: Number,
            default: 180
        },
        // 最大背景颜色范围
        backgroundColorMax: {
            type: Number,
            default: 240
        },
        // 最小颜色范围
        colorMin: {
            type: Number,
            default: 50
        },
        // 最大颜色范围
        colorMax: {
            type: Number,
            default: 160
        },
        // 干扰线最小颜色范围
        lineColorMin: {
            type: Number,
            default: 40
        },
        // 干扰线最大颜色范围
        lineColorMax: {
            type: Number,
            default: 180
        },
        // 干扰点最小颜色范围
        dotColorMin: {
            type: Number,
            default: 0
        },
        // 干扰点最大颜色范围
        dotColorMax: {
            type: Number,
            default: 255
        },
    }
}