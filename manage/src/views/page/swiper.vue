<!--
 * #Author :墨抒颖
 * #Date :2020-02-07 15:22:14
 * #LastEditTime  :2020-02-09 02:58:52
 * #LastEditors   :墨抒颖
 * #Github :https://github.com/moshuying
 * #Gitee :https://gitee.com/moshuying
 * #Blogs :https://blog.csdn.net/qq_34846662
 * #Description :墨抒颖
 -->

<template>
  <div class="dashboard-container">
    <div>
      <el-form :model="query" :inline="true">
        <el-form-item label="轮播图类型">
          <el-select v-model="query.type" placeholder="请选择轮播图类型" @change="getDataSource(1)">
            <el-option label="PC" value="PC" />
            <el-option label="首页Banner" value="Banner" />
            <el-option label="微官网" value="Mico" />
          </el-select>
          <el-form-item>
            <el-button type="primary" @click="getDataSource(1)">搜索</el-button>
          </el-form-item>
        </el-form-item></el-form>
    </div>
    <BaseTable :tabledata="data" :tableconfig="msg" :del="deleteFn">
      <el-table-column slot="handleBtn" label="预览" :width="200">
        <template slot-scope="scope">
          <el-button @click="showImg(scope.row.url)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="handleBtn" label="操作" :width="320">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDialog(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteItem({type:query.type,id:[scope.row.id]})">删除</el-button>
        </template>
      </el-table-column>
    </BaseTable>
    <div class="table-button">
      <el-button type="primary" size="mini" @click="showDialog()">新增</el-button>
      <el-button type="primary" size="mini" @click="deleteMulit()">批量删除</el-button>
    </div>
    <!-- 新增/修改图片 -->
    <el-dialog
      :visible.sync="visible"
      :model="form"
      :title="(form.id)?'修改':'新增'"
      @close="close"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="播放顺序">
          <el-input-number v-model="form.sequence" />
        </el-form-item>
        <el-form-item label="上传图片">
          <Supload :form="form" @geturl="seturl" />
        </el-form-item>
        <div class="table-button">
          <el-button @click="close()">取消</el-button>
          <el-button type="primary" @click="save()">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 查看图片 -->
    <el-dialog
      :visible.sync="imgVisibility"
      title="预览"
    >
      <div class="imgVisibility">
        <img :src="imgUrl" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'
import crud from '@/mixins/crud'
import Supload from '@/components/Upload'
export default {
  name: 'Type',
  components: { BaseTable, Supload },
  mixins: [crud],
  customOpts: {
    immediate: true,
    primaryKey: 'id',
    baseURI: '/swiper'
  },
  data() {
    return {
      query: { type: 'PC' },
      msg: [
        { label: 'ID', prop: 'id' },
        { label: '播放序列', prop: 'sequence' },
        { label: '创建时间', prop: 'createtime' }
      ]
    }
  },
  methods: {
    createBeforeHook() {
      this.form.sequence = this.form.sequence || 0
      this.form.type = this.query.type
      return this.form
    }
  }
}
</script>
