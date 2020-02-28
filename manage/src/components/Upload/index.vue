<template>
  <div class="app-container">
    <el-upload
      action="#"
      list-type="picture-card"
      :on-change="onChoose"
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      :file-list="fileList"
      :auto-upload="false"
      :multiple="false"
      :limit="1"
    >
      <i slot="default" class="el-icon-plus" />
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
        >
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download" />
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    form: { type: Object, default: () => {} }
  },
  data() {
    return {
      dialogImageUrl: '',
      fileList: this.form.id ? [{ name: this.form.id, url: this.form.url }] : [],
      dialogVisible: false,
      disabled: false
    }
  },
  methods: {
    handleRemove(file, fileList) {
    },
    handleDownload(file) {
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async onChoose(fil) {
      // 简单校验
      const file = fil.raw
      const isImage = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/gif' || file.type === 'image/webp'
      if (!isImage) {
        this.$message.error('上传文件只能是图片格式!')
        return false
      }
      if (!(file.size / 1024 / 1024 < 20)) {
        this.$message.error('上传头像图片大小不能超过 20MB!')
        return false
      }
      // 上传
      const data = new FormData()
      data.append('file', file)
      const res = await axios({
        url: process.env.VUE_APP_BASE_URL + '/upload',
        method: 'post',
        data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.data.code === 400) {
        this.$message.error(`${file.name}上传失败,返回错误的值`)
        return false
      } else {
        this.$emit('geturl', res.data.url)
        this.$message.success(`${file.name}上传成功`)
      }
      return true
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

