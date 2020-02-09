# 一个快速开发的后台管理模板

只需少量改动就能创建出一个后台管理页面,作为代价的是每个页面的相似度都非常高,也不太适用于中大型项目

项目的/src/views/page/下的所有vue文件都包含页面的基本信息
```js
import BaseTable from '@/components/BaseTable'
import crud from '@/mixins/crud' // 重要的mixins组件,包含公共页面的增删查改和页面的各个操作
import Supload from '@/components/Upload' //图片上传组件
export default {
  components: { BaseTable, Supload },
  customOpts: {
    immediate: true, //是否立即查询数据 true时页面加载完毕立即查询数据
    // 以下是可能需要改动的部分
    primaryKey: 'id', // 主键,删除和更新时使用
    baseURI: '/news' // 请求的uri
  },
  mixins: [crud],
  data() {
    return {
      // 表格信息展示数据和新增修改的表单会用到,如果需要分离这两部分,另外加一个数据用来表格展示用即可
      msg: [
        { label: '标题', prop: 'abstract', width: 300 }, // width就是单个小格子的宽度
        { label: '日期', prop: 'time' },
        { label: '标签', prop: 'tag' },
        { label: '新闻标题', prop: 'newsHeader', showOverflowTooltip: true }, //超出格子是是否显示tip
        { label: '新闻发布时间', prop: 'newsTime', showOverflowTooltip: true },
        { label: '新闻内容', prop: 'newsText', showOverflowTooltip: true },
        { label: '新闻标签', prop: 'newsTag' }
      ]
    }
  }
}
``