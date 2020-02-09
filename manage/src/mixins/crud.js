/**
 * @Author :墨抒颖
 * @Date :2020-02-07 15:26:55
 * @LastEditTime :2020-02-09 22:50:46
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 * @Description :墨抒颖
 */

import { get, put, del, post } from '@/api/main.js'
export function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}
export default {
  data() {
    return {
      currentNumber: 1,
      pageSize: 10,
      data: [],
      visible: false,
      pageTotal: 0,
      orderAmount: 0,
      orderSum: 0,
      imgVisibility: false,
      imgUrl: '',
      form: {},
      query: {},
      multiDelArr: []
    }
  },
  created() {
    const { immediate } = this.$options.customOpts
    immediate && this.getDataSource()
  },
  mounted() {},
  methods: {
    // 进入页面时获取表单信息
    async getDataSource(currentNumber = 1) {
      const query = this.filterEmptyValue(this.query)
      const result = await get(this.$options.customOpts.baseURI, {
        ...query,
        currentNumber,
        pageSize: this.pageSize
      })
      if (result.code === 200) {
        this.data = this.getDataSourceBeforeHook
          ? this.getDataSourceBeforeHook(result.data) // 返回数据的清洗钩子,主要是为了解决后端乱七八糟的字段命名问题 
          : result.data
        this.pageTotal = result.pagetotal
        this.orderAmount = result.orderAmount
        this.orderSum = result.orderSum
      }
    },
    // 创建和修改
    save() {
      const { primaryKey } = this.$options.customOpts
      const id = this.form[primaryKey]
      const fn = id ? put : post
      if (this.createBeforeHook) {
        const result = this.createBeforeHook()
        if (result === false) {
          return
        } else if (result) {
          this.form = extend(this.form, result)
        }
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          const form = this.createBeforeHook() || this.filterEmptyValue(this.form)
          const result = await fn(this.$options.customOpts.baseURI, {
            ...form
          })
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: id ? '编辑成功' : '新增成功'
            })
            this.getDataSource(id ? this.pageNum : 1)
            this.close()
          } else {
            this.$message({
              type: 'warning',
              message: result.message
            })
          }
        } else {
          return false
        }
      })
    },
    // 单个删除
    deleteItem(data) {
      this.$confirm('此操作将删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const result = await del(this.$options.customOpts.baseURI, data)
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDataSource(this.pageNum)
          }
        })
        .catch(() => {})
    },
    // 多选删除
    deleteMulit() {
      if (this.deleteBeforeHook) {
        const data = this.deleteBeforeHook()
        this.$confirm('此操作将删除选中条目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            const result = await del(this.$options.customOpts.baseURI, data)
            if (result.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getDataSource(this.pageNum)
            }
          })
          .catch(() => {})
      }
    },
    // close方法关闭新增和修改表单
    close() {
      this.visible = false
      this.form = {}
    },
    // 根据表格信息自动生成创建和修改所需的字段
    autoObj() {
      const obj = {}
      this.msg.forEach(el => {
        obj[el.prop] = ''
      })
      return obj
    },
    // 在保存表单信息时移除空字段如果有createBeforeHook()函数则不执行
    filterEmptyValue(o) {
      const query = {}
      Object.entries(o)
        .filter(([key, value]) => value)
        .reduce((o, [key, value]) => {
          o[key] = value
          return o
        }, query)
      return query
    },
    updateDialog(val) {
      this.visible = true
      this.form = val
    },
    closeForm() {
      this.visible = false
      this.form = {}
    },
    // 表格多选时父组件接受函数,用于存储选中了那些信息
    deleteFn(val) {
      this.multiDelArr = val
    },
    // 查看图片时用的
    showImg(url) {
      this.imgVisibility = true
      this.imgUrl = url
    },
    showDialog(el) {
      this.form = el || this.autoObj()
      this.visible = true
    },
    // 默认多选删除时的id提取
    deleteBeforeHook() {
      return { id: this.multiDelArr.map(el => el[this.$options.customOpts.primaryKey]) }
    },
    // upload组件设置父组件form对象的url时调用
    seturl(el) {
      this.form.url = el
    }
  }
}
