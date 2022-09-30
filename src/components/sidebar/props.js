export default {
    props: {
        // 数据
        list: {
            type: Array,
            required: true
        },
        // 是否折叠
        fold: {
            type: Boolean,
            default: false
        },
        // 宽度
        width: {
            type: String,
            default: "200px"
        },
        // 折叠宽度
        foldWidth: {
            type: String,
            default: "60px"
        },
        // 字体颜色
        color: {
            type: String,
            default: "#000000"
        },
        // 背景色
        background: {
            type: String,
            default: "#cccccc"
        }
    }
}