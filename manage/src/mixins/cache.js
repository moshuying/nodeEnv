import { mapActions } from 'vuex'
export default {
  beforeRouteLeave(to, from, next) {
    const { children = [] } = from.meta || {}
    if (children.indexOf(to.name) >= 0) {
      this.addVisitedViews(from)
    } else {
      this.delVisitedViews(from)
    }
    next()
  },
  methods: {
    ...mapActions(['addVisitedViews', 'delVisitedViews'])
  }
}
