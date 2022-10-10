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
        show_pw: {
            type: Boolean,
            default: false
        },

        // 过滤字符
        filter_char: {
            type: RegExp,
            default: null
        },
        // 替换字符
        rep_val: {
            type: [String, Number],
            default: ""
        },

        // 是否判断规则
        judge: {
            type: Boolean,
            default: false
        },
        // 输入规则
        rule: {
            type: String,
            default: ""
        },
        tips: {
            type: String,
            default: "输入有误"
        },
        // 触发时间
        trigge_time: {
            type: Number,
            default: 1000
        },
    }
}