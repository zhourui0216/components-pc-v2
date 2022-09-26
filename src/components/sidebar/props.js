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
    }
}