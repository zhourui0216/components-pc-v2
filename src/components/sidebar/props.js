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
        // 字体颜色
        color: {
            type: String,
            default: "#000000"
        },
        // 背景色
        background: {
            type: String,
            default: "#cccccc"
        },
        // 选中颜色
        activeColor: {
            type: String,
            default: "#ffffff"
        },
        // 选中背景
        activeBg: {
            type: String,
            default: "#333744"
        },
    }
}