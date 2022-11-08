export default {
    props: {
        // 值
        value: {
            type: Boolean,
            required: true
        },
        // 双向绑定
        twoway: {
            type: Boolean,
            default: true
        },
        // 宽
        width: {
            type: Number,
            default: 40
        },
        // 高
        height: {
            type: Number,
            default: 20
        },
        // 颜色
        color: {
            type: String,
            default: "#dcdfe6"
        },
        // 选中颜色
        active: {
            type: String,
            default: "#13CE66"
        },
        // 边框大小
        borderSize: {
            type: Number,
            default: 0
        },
        // 边框颜色
        borderColor: {
            type: String,
            default: null
        },
        // 选中边框颜色
        borderActive: {
            type: String,
            default: null
        },
        // 点大小
        pointSize: {
            type: Number,
            default: 14
        },
        // 点颜色
        pointColor: {
            type: String,
            default: "#fff"
        },
        // 点选中颜色
        pointActive: {
            type: String,
            default: "#fff"
        }
    }
}