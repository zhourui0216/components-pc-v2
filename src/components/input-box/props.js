export default {
    props: {
        // 值
        value: {
            type: [String, Number],
            default: null
        },
        // 类型
        type: {
            type: String,
            default: "string"
        },
        // 提示字符
        placeholder: {
            type: String,
            default: "请输入内容"
        },
        // 最小长度
        minlen: {
            type: Number,
            default: null
        },
        // 最大长度
        maxlen: {
            type: Number,
            default: null
        },
        // 图标
        icon: {
            type: String,
            default: ""
        },
        // 清除内容
        clearable: {
            type: Boolean,
            default: false
        },
        // 显示密码
        showPw: {
            type: Boolean,
            default: false
        },
        // 过滤字符
        filterChar: {
            type: RegExp,
            default: null
        },
        // 替换字符
        repVal: {
            type: [String, Number],
            default: ""
        },
        // 触发时间
        triggeTime: {
            type: Number,
            default: 1000
        },
    }
}