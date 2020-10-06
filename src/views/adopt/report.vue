<template>
  <div class="apply-mainer">
    <div class="title">武汉市养老服务对象评估申请表</div>
    <div class="apply-wrapper">
      <table width="100%"
        cellpadding="0"
        cellspacing="0"
        border="1"
        class="apply-table">
        <tr v-for="(row, num) in basics"
          :key="num">
          <td v-if="row[1].num"
            :rowspan="row[1].num">
            <div class="td-center">疾病诊断</div>
          </td>
          <td v-if="row[1].sick">
            <div class="td-center">{{ row[1].sick }}</div>
          </td>
          <td v-else
            colspan="2">
            <div class="td-center">{{ row[1] }}</div>
          </td>
          <td v-if="row.length>3"
            colspan="3">
            <div class="td-box">
              <el-radio-group v-if="options.hasOwnProperty(row[0])"
                v-model="form[row[0]]">
                <el-radio v-for="(item, index) in options[row[0]].list"
                  :key="index"
                  :label="item.dicKey">{{ item.dicValue }}</el-radio>
              </el-radio-group>
              <span v-else>{{ form[row[0]] }}</span>
            </div>
          </td>
          <td v-if="row.length>3"
            colspan="2">
            <div class="td-center">{{ row[3] }}</div>
          </td>
          <td v-if="row.length>3"
            colspan="3">
            <div class="td-box">
              <el-radio-group v-if="options.hasOwnProperty(row[2])"
                v-model="form[row[2]]">
                <el-radio v-for="(item, index) in options[row[2]].list"
                  :key="index"
                  :label="item.dicKey">{{ item.dicValue }}</el-radio>
              </el-radio-group>
              <span v-else>{{ form[row[2]] }}</span>
            </div>
          </td>
          <td v-else
            colspan="8">
            <div class="td-box">
              <el-radio-group v-if="options.hasOwnProperty(row[0])&&options[row[0]].isRadio"
                v-model="form[row[0]]">
                <el-radio v-for="(item, index) in options[row[0]].list"
                  :key="index"
                  :label="item.dicKey">{{ item.dicValue }}</el-radio>
              </el-radio-group>
              <el-checkbox-group v-else-if="options.hasOwnProperty(row[0])&&options[row[0]].isCheck"
                v-model="options[row[0]].checks">
                <el-checkbox v-for="(item, index) in options[row[0]].list"
                  :key="index"
                  :label="item.dicKey">{{ item.dicValue }}</el-checkbox>
              </el-checkbox-group>
              <span v-else>{{ form[row[0]] }}</span>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
const basics = [
  ['name', '姓名', 'idCard', '身份证号'],
  ['gender', '性别', 'idCard', '宗教信仰'],
  ['name', '评估编号', 'idCard', '评估日期'],
  ['name', '评估原因', 'idCard', '户口性质'],
  ['name', '社保卡号', 'idCard', '民族'],
  ['gender', '文化程度'],
  ['askfor', '婚姻状况'],
  ['idCard', '医疗费用支付方式'],
  ['askfor', '申请对象'],
  ['chronic', { sick: '慢性疾病', num: 5 }],
  ['major', { sick: '重大疾病' }],
  ['stupid', { sick: '痴呆' }],
  ['spirit', { sick: '精神疾病' }],
  ['chronic', { sick: '康复状况' }],
  ['askfor', '申请养老服务需求'],
  ['address', '户籍所在地', 'idCard', '邮政编码'],
  ['address', '住宅电话', 'idCard', '手机号码'],
  ['address', '居住地址'],
  ['address', '代理人姓名', 'idCard', '与申请人关系'],
  ['address', '代理人电话', 'idCard', '手机号码'],
  ['address', '代理地址'],
  ['suggest', '社区（村）、机构意见'],
  ['suggest', '街道（镇）核查意见'],
  ['suggest', '市（区）审批意见'],
  ['address', '终止评估原因']
]

const orgOptions = [
  {
    dicKey: '1',
    dicValue: '男'
  },
  {
    dicKey: '2',
    dicValue: '女'
  }
]

const organOptions = [
  {
    dicKey: '1',
    dicValue: '政府个投资'
  },
  {
    dicKey: '2',
    dicValue: '社会投资'
  },
  {
    dicKey: '3',
    dicValue: '社会好投资'
  },
  {
    dicKey: '4',
    dicValue: '社会投资'
  },
  {
    dicKey: '5',
    dicValue: '社会尴尬投资'
  },
  {
    dicKey: '6',
    dicValue: '社会投资'
  },
  {
    dicKey: '7',
    dicValue: '社会投资'
  },
  {
    dicKey: '8',
    dicValue: '社会天花粉投资'
  },
  {
    dicKey: '9',
    dicValue: '社会投资'
  }
]

const options = {
  gender: {
    isRadio: true,
    list: orgOptions
  },
  askfor: {
    isCheck: true,
    list: organOptions,
    checks: []
  },
  chronic: {
    isRadio: true,
    list: organOptions
  },
  major: {
    isCheck: true,
    list: organOptions,
    checks: ['3', '5', '6']
  },
  spirit: {
    isCheck: true,
    list: organOptions,
    checks: []
  }
}

export default {
  name: 'customerApply',
  data() {
    return {
      basics,
      options,
      form: {
        id: null,
        name: '品牌',
        idCard: '420636596666666666',
        gender: '2',
        chronic: '2',
        suggest:
          '从头到尾地检索字符串看它是否含有子串开始检索的位置在字符串的处或字符串的开头（没有指定 fromindex 时）如果找到一个则返回的第一次出现的位置'
      }
    }
  },
  props: ['rowData'],
  methods: {
    handleQuery(currentPage, pageSize) {
      console.log(this.listQuery)
    }
  }
}
</script>

<style lang="scss" scoped>
.apply-mainer {
  padding: 0 20px 20px;
  .title {
    font-size: 24px;
    text-align: center;
    margin-bottom: 25px;
  }

  .apply-wrapper {
    height: 560px;
    overflow: auto;
    .apply-table {
      border-color: #ccc;
      td {
        min-width: 100px;
        .td-box {
          padding: 5px 20px;
          line-height: 25px;
          .el-checkbox-group {
            line-height: 22px;
          }

          .el-radio-group {
            padding-top: 6px;
            .el-radio {
              height: 23px;
            }
          }
        }

        .td-center {
          line-height: 42px;
          text-align: center;
        }
      }
    }
  }
}
</style>
