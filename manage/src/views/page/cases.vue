<!--
 * #Author :墨抒颖
 * #Date :2020-02-08 18:54:56
 * #LastEditTime  :2020-02-09 02:58:43
 * #LastEditors   :墨抒颖
 * #Github :https://github.com/moshuying
 * #Gitee :https://gitee.com/moshuying
 * #Blogs :https://blog.csdn.net/qq_34846662
 * #Description :墨抒颖
 -->

<template>
  <div class="dashboard-container">
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
        <el-form-item v-for="(value,ix) in msg" :key="ix" :label="value.label">
          <el-input v-model="form[value.prop]" />
        </el-form-item>
        <el-form-item label="头像">
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
  components: { BaseTable, Supload },
  mixins: [crud],
  customOpts: {
    immediate: true,
    primaryKey: 'id',
    baseURI: '/cases'
  },
  data() {
    return {
      msg: [
        { label: '姓名', prop: 'name' },
        { label: '托福分数', prop: 'score' },
        { label: '学习周期', prop: 'learn' },
        { label: '录取专业', prop: 'profession' },
        { label: '录取院校', prop: 'school' },
        { label: '简介', prop: 'info' }
      ]
    }
  }
}
</script>
