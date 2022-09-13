<!--
 * @Author: your name
 * @Date: 2020-02-27 10:11:47
 * @LastEditTime: 2020-12-26 15:34:33
 * @LastEditors : Please set LastEditors
 * @Description: 记录管理页（显示当前用户的数据）
 * @FilePath: \inertiawheel1\src\renderer\views\DataManage\index.vue
 -->
<template>
  <div class="app-container">
    <!-- 日期选择器 -->
    <el-date-picker
      class="data-select"
      v-model="selectDateValue"
      type="daterange"
      range-separator="——"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      :editable="false"
      :clearable="false"
      unlink-panels
      align="left"
      :picker-options="pickerOptions"
      @change="handleSelectDate"
    >
    </el-date-picker>

    <!-- 表格 -->
    <el-table
      class="table-wrapper"
      v-loading="loading"
      element-loading-text="数据量较大，请耐心等待......"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      style="width: 100%"
      height="100%"
      highlight-current-row
      border
      :default-sort="{ prop: 'RecordTime', order: 'descending' }"
    >
      <!-- No -->
      <el-table-column type="index" label="No" width="50" align="center" />
      <!-- 查看 -->
      <el-table-column label="查看操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)"
            >查看图形</el-button
          >
        </template>
      </el-table-column>
      <!-- 时间 -->
      <el-table-column
        label="时间"
        prop="RecordTime"
        width="tablewidth"
        sortable
        align="center"
      >
      </el-table-column>
      <!-- 用户名 -->
      <el-table-column
        label="姓名"
        prop="UserName"
        width="tablewidth"
        align="center"
      ></el-table-column>
      <!-- 删除 -->
      <el-table-column label="删除操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- dialog弹窗 -->
    <el-dialog title="训练曲线" :visible.sync="ChartVisible" width="60%">
      <div class="chart-container">
        <!-- LineViewer子组件 -->
        <line-viewer
          width="100%"
          height="100%"
          :ChartData="ChartData"
          :BigNumber="BigNumber"
          :MiddleNumber="MiddleNumber"
          :LittleNumber="LittleNumber"
          :SmallNumber="SmallNumber"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* 子组件 */
import LineViewer from '@/components/Charts/LineViewer'

export default {
  components: { LineViewer },

  data() {
    return {
      CurrentUser: '', // 当前用户名
      cacheTableData: [], // 读RecordData表，读取到的当前用户的所有数据 [{},{}...]
      tableData: [], // 经过筛选后的表格数据
      tablewidth: (document.body.clientWidth / 4) * 0.8, // 表格各列的宽度
      loading: false, // 表格加载中动画
      ChartData: [],
      BigNumber: 0,
      MiddleNumber: 0,
      LittleNumber: 0,
      SmallNumber: 0,
      selectDateValue: [], // 日期选择器的筛选值-双绑，比如：['2020-03-20', '2020-03-22']
      /* 日期选择器快捷选项 */
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 360)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '该用户所有数据',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 36000)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      ChartVisible: false // 弹窗显影
    }
  },

  created() {
    const currentTime = this.$moment().format('YYYY-MM-DD')
    this.selectDateValue = [currentTime, currentTime]
  },
  mounted() {
    this.readCurrentUser()
  },

  methods: {
    /**
     * @description: 读取RecordData表，获取当前用户的经过筛选的所有数据
     */
    readCurrentUser() {
      let db
      let request = window.indexedDB.open('Inertia_flywheel_v1')
      request.onerror = event => {
        this.$notify({
          title: '警告',
          message: '数据库丢失，请重启设备！',
          type: 'warning',
          position: 'bottom-right'
        })
      }
      request.onsuccess = event => {
        db = request.result
        let transaction = db.transaction(['CurrentUserData'])
        let objectStore = transaction.objectStore('CurrentUserData')
        let ReadUserRequest = objectStore.getAllKeys() // 获取当前用户名
        ReadUserRequest.onsuccess = event => {
          this.CurrentUser = ReadUserRequest.result[0] // 当前用户名
          let transaction = db.transaction(['RecordData'])
          let objectStore = transaction.objectStore('RecordData')
          let UserIndex = objectStore.index('UserName')
          const cursor = UserIndex.openCursor(this.CurrentUser) // 游标只查询指定用户
          this.loading = true
          cursor.onsuccess = event => {
            const cursor = event.target.result
            if (cursor) {
              if (
                this.$moment(cursor.value.RecordTime.split(' ')[0]).isBetween(
                  this.selectDateValue[0],
                  this.selectDateValue[1],
                  null,
                  '[]'
                )
              ) {
                this.cacheTableData.push(cursor.value)
              }
              cursor.continue()
            } else {
              this.tableData = this.cacheTableData
              this.cacheTableData = []
              this.loading = false
            }
          }
          cursor.onerror = event => {
            this.loading = false
            this.$notify({
              title: '错误',
              message: '读取失败！',
              type: 'error',
              position: 'bottom-right'
            })
          }
        }
        ReadUserRequest.onerror = event => {
          this.loading = false
          this.$notify({
            title: '错误',
            message: '读取失败！',
            type: 'error',
            position: 'bottom-right'
          })
        }
      }
    },

    /**
     * @description: 查看按钮
     * @param {Number} index 数据的下标，从0开始
     * @param {Object} row 选中的该行的数据
     */
    handleEdit(index, row) {
      this.ChartData = row.ChartData
      this.BigNumber = row.BigNumber
      this.MiddleNumber = row.MiddleNumber
      this.LittleNumber = row.LittleNumber
      this.SmallNumber = row.SmallNumber
      this.ChartVisible = true // 显示弹窗
    },

    /**
     * @description: 删除按钮
     * @param {Number} index 数据的下标，从0开始
     * @param {Object} row 选中的该行的数据
     */
    handleDelete(index, row) {
      let db
      let request = window.indexedDB.open('Inertia_flywheel_v1')
      request.onerror = event => {
        this.$notify({
          title: '警告',
          message: '数据库丢失，请重启设备！',
          type: 'warning',
          position: 'bottom-right'
        })
      }
      request.onsuccess = event => {
        db = request.result
        let transaction = db.transaction(['RecordData'], 'readwrite')
        let objectStore = transaction.objectStore('RecordData')
        let UserIndex = objectStore.index('UserName')
        const cursor = UserIndex.openCursor(this.CurrentUser)
        cursor.onsuccess = event => {
          let cursor = event.target.result
          if (cursor) {
            if (cursor.value.RecordTime === row.RecordTime) {
              let DeleteResult = cursor.delete()
              this.readCurrentUser()
              return
            }
            cursor.continue()
          }
        }
        cursor.onerror = event => {
          this.loading = false
          this.$notify({
            title: '错误',
            message: '删除失败！',
            type: 'error',
            position: 'bottom-right'
          })
        }
      }
    },

    /**
     * @description: 时间筛选器触发函数
     */
    handleSelectDate() {
      this.readCurrentUser()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;

  /* 日期选择器 */
  .data-select {
    margin-bottom: 20px;
  }

  /* 表格 */
  .table-wrapper {
    flex: 1;
  }

  /* dialog弹窗 */
  .chart-container {
    width: 100%;
    height: 40vh;
  }
}
</style>
