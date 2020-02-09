<!--
 * #Description :墨抒颖
 * #Author :墨抒颖
 * #Date :2019-12-19 16:33:41
 * #LastEditTime  :2019-12-23 11:38:45
 * #LastEditors   :墨抒颖
 * #Github :https://github.com/moshuying
 * #Gitee :https://gitee.com/moshuying
 * #Blogs :https://blog.csdn.net/qq_34846662
 -->
<template>
  <div>
    <el-table ref="multipleTable" :data="tabledata" border style="width: 100%" @selection-change="del">
      <el-table-column type="selection" width="55" />
      <el-table-column
        v-for="item in tableconfig"
        :key="item.prop"
        sortable
        :width="item.width"
        :show-overflow-tooltip="item.showOverflowTooltip"
        :prop="item.prop"
        :label="item.label"
      />
      <slot name="handleBtn" />
    </el-table>
    <!-- <el-pagination
      class="table-pagination"
      @current-change="getOrderList"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="pagetotal"
    ></el-pagination> -->
  </div>
</template>
<script>
import _ from 'lodash'
import Moment from 'moment'
export default {
  name: 'BaseTable',
  filters: {
    tsToTime: item => {
      if (item) {
        return Moment(item).format('YYYY-MM-DD HH:mm')
      } else {
        return ''
      }
    },
    tsToDate: item => {
      if (item) {
        return Moment(item).format('YYYY-MM-DD')
      } else {
        return ''
      }
    }
  },
  props: {
    tabledata: {
      type: Array,
      required: true,
      validator: val => val.filter(item => !_.isObject(item)).length === 0
    },
    tableconfig: {
      type: Array,
      required: true,
      validator: val => val.filter(item => !_.isString(item.prop) || !_.isString(item.label)).length === 0
    },
    // eslint-disable-next-line vue/require-default-prop
    del: { type: Function, default: (val) => console.log(val) }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style scoped>
.images {
  height: 100%;
  width: 100%;
}
.dialog /deep/ .el-dialog__body {
  padding-top: 0;
}
</style>
