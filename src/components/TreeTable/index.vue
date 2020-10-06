<template>
  <el-table :data="formatData"
    :row-class-name="rowClassName"
    v-bind="$attrs">
    <!-- :cell-style="{'user-select': 'none'}"> -->
    <el-table-column width="60"
      align="center">
      <template slot-scope="scope">
        {{scope.$index + 1}}
      </template>
    </el-table-column>
    <el-table-column v-if="columns.length>0"
      v-for="column in columns"
      :key="column.value"
      :label="column.text"
      :width="column.width"
      align="center">
      <template slot-scope="scope">
        <div class="group-tree">
          <span v-for="space in scope.row._level"
            :key="space"
            class="ms-tree-space"></span>
          <span class="tree-ctrl"
            v-if="iconShow(scope.row)"
            @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expanded"
              class="el-icon-caret-right"></i>
            <i v-else
              class="el-icon-caret-right"
              style="transform: rotate(45deg);"></i>
          </span>
          <svg-icon v-if="iconShow(scope.row)"
            icon-class="folder"
            style="font-size: 16px;"></svg-icon>
          <svg-icon v-else
            icon-class="document"
            style="font-size: 16px;"></svg-icon>
          {{scope.row[column.value]}}
        </div>
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</template>

<script>
import treeToArray from './eval'
export default {
  name: 'treeTable',
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 格式化数据源
    formatData() {
      return treeToArray(this.data)
    }
  },
  created() {
    // console.log(treeToArray(this.data))
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      const hList = this.dataMap(row.parentId)
      return hList.length > 0 ? 'row-hide' : 'row-show'
    },
    dataMap(parentId) {
      let list = []
      const parent = this.formatData.find(item => item.id === parentId)
      if (parent) {
        if (parent._expanded === false) list.push(parent.id)
        list = list.concat(this.dataMap(parent.parentId))
      }

      return list
    },
    toggleExpanded(trIndex) {
      const record = this.formatData[trIndex]
      this.$emit('node-click', record)
      record._expanded = !record._expanded
    },
    iconShow(record) {
      return record._expanded !== undefined && record._expanded !== null
    }
  }
}
</script>

<style lang="scss" scoped>
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 15px;
  height: 14px;
  &::before {
    content: '';
  }
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: #2196f3;
  margin-left: -10px;
}

.el-table /deep/ {
  .group-tree {
    text-align: left;
    padding: 5px 0 5px 20px;
  }

  .row-show {
    animation: treeTableShow 1s;
    -webkit-animation: treeTableShow 1s;
  }

  .row-hide {
    display: none;
  }
}

@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
