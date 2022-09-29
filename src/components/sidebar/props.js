export default {
    props: {
        // 数据
        list: {
            type: Array,
            required: true
        },
        // 折叠
        fold: {
            type: Boolean,
            default: false
        },
        // 背景色
        background: {
            type: String,
            default: "#ffffff"
        },
        // 选项移入背景色
        item_active: {
            type: String,
            default: "#cccccc"
        },
        // 子选项移入背景色
        subitem_active: {
            type: String,
            default: "#e2e2e2"
        }
    }
}