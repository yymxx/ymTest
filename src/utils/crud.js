import {
  getRecordList,
  addRecord,
  updateRecord,
  delOneRecord
} from '@/api/page'

export default {
  data() {
    return {
      lists: [],
      btnPowers: null,
      listQuery: {},
      queryUrl: {
        list: '',
        add: '',
        edit: '',
        del: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalOlders: 80,
      listHandlerRow: null,
      dialogFormVisible: false,
      form: {},
      rules: {},
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        detail: '详情'
      }
    }
  },
  methods: {
    handleQuery(currentPage) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      this.listQuery.page = this.currentPage
      this.listQuery.pageSize = this.pageSize
      console.log(this.listQuery)
      getRecordList(this.queryUrl.list, this.listQuery).then(response => {
        this.totalOlders = response.data.totalRecord
        this.lists = response.data.dataList
      })
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.handleQuery(this.currentPage)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleQuery(val)
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          addRecord(this.queryUrl.add, this.form).then(res => {
            if (res.data === 1) {
              this.handleQuery(this.currentPage)
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              if (res.msg !== '') {
                this.$message({
                  type: 'warning',
                  message: res.msg
                })
              }
            }
          })
        } else {
          return false
        }
      })
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updateRecord(this.queryUrl.edit, this.form).then(res => {
            if (res.data === 1) {
              this.handleQuery(this.currentPage)
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              if (res.msg !== '') {
                this.$message({
                  type: 'warning',
                  message: res.msg
                })
              }
            }
          })
        } else {
          return false
        }
      })
    },
    delRow(id) {
      delOneRecord(this.queryUrl.del, id).then(res => {
        if (res.data === 1) {
          this.handleQuery(this.currentPage)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
