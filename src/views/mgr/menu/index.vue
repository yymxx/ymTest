<template>
  <div class="main-container">
    <div class="filter-container"
      style="flex-wrap: nowrap;">
      <el-button type="primary"
        icon="el-icon-plus"
        @click="handleCreate()">添加</el-button>
    </div>
    <tree-table :data="list"
      :columns="columns"
      v-loading="listLoading"
      border>
      <el-table-column label="路径"
        prop="path"
        align="center">
      </el-table-column>
      <el-table-column label="页面地址"
        prop="component"
        align="center">
      </el-table-column>
      <el-table-column label="图标名称"
        prop="icon"
        align="center">
      </el-table-column>
      <el-table-column label="菜单类型"
        prop="level"
        align="center">
      </el-table-column>
      <el-table-column label="排序"
        prop="sortNum"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        header-align="center"
        width="240"
        align="center">
        <template slot-scope="scope">
          <el-button type="warning"
            size="mini"
            @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger"
            size="mini"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]"
      @close="clearFormValidate('form')"
      :visible.sync="dialogFormVisible"
      width="860px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <el-form-item label="菜单级别"
          v-if="dialogStatus=='create'"
          prop="level">
          <el-select class="filter-item"
            clearable
            v-model="form.level"
            placeholder="请选择"
            @change="handleSelectLevel"
            style="width: 610px">
            <el-option v-for="item in levelOptions"
              :key="item.dicKey"
              :label="item.dicValue"
              :value="item.dicKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父节点"
          v-if="form.level!=1"
          prop="parentId">
          <el-cascader filterable
            v-model="listPar"
            :options="bunkOptions"
            @change="handleParents"
            style="width: 240px"></el-cascader>
        </el-form-item>
        <el-form-item label="路径"
          v-if="form.level!=2"
          prop="path">
          <el-input v-model="form.path"
            placeholder="请输入路径"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称"
          prop="title">
          <el-input v-model="form.title"
            placeholder="请输入菜单名称"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="页面地址"
          v-if="form.level!=2"
          prop="component">
          <el-input v-model="form.component"
            placeholder="请输入页面地址"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="图标名称"
          v-if="form.level==2"
          prop="icon">
          <el-popover placement="bottom"
            width="280"
            trigger="manual"
            v-model="innerVisible">
            <div class="icon-container">
              <span v-for="(item, index) in iconList"
                :key="index"
                class="icon-kk"
                @click="handleIcon(item)">
                <svg-icon :icon-class="item"></svg-icon>
              </span>
            </div>
            <el-input clearable
              slot="reference"
              v-model="form.icon"
              placeholder="请输入图标名称"
              @click.native="innerVisible=!innerVisible"
              style="width: 240px;"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="页面按钮"
          v-if="form.level==3"
          prop="tihhtle">
          <el-checkbox-group v-model="checkList">
            <div v-for="(item, index) in buttonList"
              :key="index"
              class="groupbox">
              <el-checkbox :label="item.id">
                {{ item.buttonName }}
              </el-checkbox>
            </div>
            <div style="clear: both;"></div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="排序码">
          <el-input-number v-model="form.sortNum"
            placeholder="请输入排序码"
            style="width: 240px;"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'"
          type="primary"
          @click="create('form')">确 定</el-button>
        <el-button v-else
          type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import { mymenus } from '@/router/data'
import {
  getRecordList,
  addRecord,
  updateRecord,
  delOneRecord
} from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

const powers = {
  id: null,
  parentId: 0,
  title: '',
  icon: '',
  path: '',
  component: '',
  level: 1,
  create_user: '',
  sortNum: 0
}

const columns = [
  {
    value: 'title',
    text: '菜单名称',
    width: 280
  }
]

const iconList = [
  'sysOperate',
  'msgOperate',
  'phyOperate',
  'estOperate',
  'ispOperate',
  'bunkOperate',
  'ordOperate',
  'calOperate',
  'tolOperate',
  'rgnOperate'
]

const levelOptions = [
  {
    dicKey: 1,
    dicValue: '一级菜单'
  },
  {
    dicKey: 2,
    dicValue: '二级菜单'
  },
  {
    dicKey: 3,
    dicValue: '三级菜单'
  }
]

export default {
  name: 'HelloWorld',
  components: {
    treeTable
  },
  data() {
    return {
      btnPowers: null,
      iconList,
      list: mymenus,
      columns,
      levelOptions,
      checkList: [],
      buttonList: [],
      listLoading: false,
      listQuery: {
        title: ''
      },
      bunkOptions: [],
      listPar: [],
      innerVisible: false,
      form: { ...powers },
      rules: {
        parentId: [
          {
            required: true,
            message: '请选择父级',
            trigger: 'change'
          }
        ],
        path: [
          {
            required: true,
            message: '请输入模块路径',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '请输入模块组件',
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            message: '请输入模块名称',
            trigger: 'blur'
          }
        ]
      },
      isReadonly: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.handleQuery()
    getRecordList(allApi.sys.button.getList, {
      page: 1,
      pageSize: 20
    }).then(response => {
      console.log(111, response)
      this.buttonList = response.data.dataList
    })
  },
  methods: {
    handleQuery(parentId) {
      const apiUrl = allApi.sys.menu.getList
      getRecordList(apiUrl, {}).then(response => {
        console.log(121, response)
        this.list = response.data
        if (parentId) this.handleExpand(this.list, parentId)
      })
    },
    handleIcon(val) {
      this.form.icon = val
      this.innerVisible = false
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.isReadonly = false
      this.form = { ...powers }
      this.form.create_user = this.sysUser.id
    },
    create(formName) {
      console.log(this.checkList)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.sys.menu.addData
          addRecord(apiUrl, this.form).then(res => {
            this.handleQuery(this.form.parentId)
          })
        } else {
          return false
        }
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.isReadonly = false
      this.bunkOptions = this.handleHigher(this.list, parseInt(row.level))
      for (const key in this.form) {
        this.form[key] = row[key]
      }

      this.form.level = parseInt(this.form.level)
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.sys.menu.updateData
          updateRecord(apiUrl, this.form).then(res => {
            this.handleQuery(this.form.parentId)
          })
        } else {
          return false
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const apiUrl = allApi.sys.menu.delData
        delOneRecord(apiUrl, row.id).then(res => {
          this.handleQuery(row.parentId)
        })
      })
    },
    handleSelectLevel(val) {
      this.bunkOptions = this.handleHigher(this.list, val)
      if (val !== 1) {
        this.form.parentId = null
        this.listPar = []
      } else {
        this.form.parentId = 0
      }
    },
    handleParents() {
      if (this.form.level === 2) {
        this.form.parentId = this.listPar[0]
      } else if (this.form.level === 3) {
        this.form.parentId = this.listPar[1]
      }
    },
    handleHigher(data, level) {
      let rlist = JSON.parse(JSON.stringify(data))
      return rlist.reduce((res, item) => {
        if (level === 3 && item.children && item.children.length > 0) {
          return res.concat({
            value: item.id,
            label: item.title,
            children: this.handleHigher(item.children, 2)
          })
        }

        return res.concat({
          value: item.id,
          label: item.title
        })
      }, [])
    },
    handleExpand(data, parentId) {
      for (var item of data) {
        if (item.children && item.children.length > 0) {
          if (item.id === parentId) {
            this.$set(item, '_expanded', true)
            if (item.parentId) {
              this.handleExpand(this.list, item.parentId)
            }
          } else {
            this.handleExpand(item.children, parentId)
          }
        }
      }
    },
    cancel(formName) {
      this.dialogFormVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-container {
  padding: 15px 10px 0;
  .icon-kk {
    display: inline-block;
    width: 45px;
    height: 45px;
    text-align: center;
    font-size: 22px;
    color: #409eff;
  }
}

.el-checkbox-group {
  width: 610px;
  .groupbox {
    float: left;
    width: 118px;
    height: 40px;
  }
}
</style>
