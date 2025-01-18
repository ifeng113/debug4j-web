import { layer } from "@layui/layer-vue"

/* eslint-disable */
export default class domMessage {
    success(content) {
        layer.notify({
            title: "Success",
            content: content,
            icon: 1,
            time: 5000
        })
    }
    warning(content) {
        layer.notify({
            title: "Warming",
            content: content,
            icon: 3,
            time: 5000
        })
    }
    error(content) {
        layer.notify({
            title: "Error",
            content: content,
            icon: 2,
            time: 8000
        })
    }
}
