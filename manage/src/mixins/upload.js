/**
 * @Author :墨抒颖
 * @Date :2020-02-07 15:26:55
 * @LastEditTime :2020-02-09 03:00:24
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Description :墨抒颖
 */
export default {
  methods: {
    handleSuccimg(e, file, filelist, cb) {
      if (e.code === 600) {
        cb(e.data.fileUrl, file.raw.type)
        this.$message({
          type: 'success',
          message: '上传成功！'
        })
      } else {
        this.$message({
          type: 'error',
          message: e.data.msg
        })
      }
    },
    createExceed(limit = 1) {
      return function(files, fileList) {
        this.$message.warning(
          `当前限制选择 ${limit} 个文件，本次选择了 ${
            files.length
          } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        )
      }
    }
  }
}
