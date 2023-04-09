import service from "@/api/index.js"

// 获取apps
export function getApps() {
    return service({
        method: "GET",
        url: "/apps",
    })
}