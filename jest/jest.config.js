module.exports = {
    // 开启覆盖统计功能
    collectCoverage: true,
    // 将要覆盖的文件
    collectCoverageFrom: ["src/*.js"],
    // 输出覆盖统计结果的目录
    coverageDirectory: "test/coverage/",
    // 测试脚本路径
    testMatch: ["**/test/*.test.js"]
};