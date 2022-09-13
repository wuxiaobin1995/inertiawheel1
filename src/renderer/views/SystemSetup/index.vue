<!--
 * @Author: your name
 * @Date: 2020-02-18 09:35:06
 * @LastEditTime: 2020-12-26 16:55:14
 * @LastEditors : Please set LastEditors
 * @Description: 系统配置页，配置基本参数
 * @FilePath: \inertiawheel1\src\renderer\views\SystemSetup\index.vue
 -->
<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row>
        <el-col :span="5" class="FormLable">用户名</el-col>
        <el-col :span="18" :offset="1" class="FormItem">
          <el-autocomplete
            class="inline-input"
            v-model="form.UserName"
            :fetch-suggestions="querySearch"
            placeholder="请输入用户名"
            @select="handleSelect"
            @focus="ShowUserKeyboard"
            @blur="HideUserInput"
          ></el-autocomplete>
          <!-- 虚拟键盘 -->
          <vue-touch-keyboard
            :options="options"
            v-if="UserInputVisible"
            :layout="layout"
            :cancel="HideUserInput"
            :accept="AcceptUserInput"
            :input="input"
            class="KeyBoardStyle"
          />
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="FormLable">组数(次)</el-col>
        <el-col :span="7" :offset="1" class="FormItem">
          <el-input-number
            v-model="form.GroupNumber"
            :min="1"
            :max="100"
            label="组数(次)"
            class="inline-input"
          ></el-input-number>
        </el-col>
        <el-col :span="4" class="FormLable">每组时间(s)</el-col>
        <el-col :span="7" :offset="1" class="FormItem">
          <el-input-number
            v-model="form.GroupTime"
            :min="5"
            :max="3600"
            label="每组时间(s)"
            class="inline-input"
          ></el-input-number>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="FormLable">大飞轮数(4.1kg)</el-col>
        <el-col :span="7" :offset="1" class="FormItem">
          <el-input-number
            v-model="form.BigNumber"
            :min="0"
            :max="50"
            :step="1"
            label="大飞轮数(4.1kg)"
            class="inline-input"
          ></el-input-number>
        </el-col>
        <el-col :span="4" class="FormLable">中飞轮数(3.2kg)</el-col>
        <el-col :span="7" :offset="1" class="FormItem">
          <el-input-number
            v-model="form.MiddleNumber"
            :min="0"
            :max="50"
            :step="1"
            label="中飞轮数(3.2kg)"
            class="inline-input"
          ></el-input-number>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="FormLable">小飞轮数(2.2kg)</el-col>
        <el-col :span="7" :offset="1" class="FormItem">
          <el-input-number
            v-model="form.LittleNumber"
            :min="0"
            :max="50"
            :step="1"
            label="小飞轮数(2.2kg)"
            class="inline-input"
          ></el-input-number>
        </el-col>
        <el-col :span="4" class="FormLable">超小飞轮数(1.5kg)</el-col>
        <el-col :span="7" :offset="1" class="FormItem">
          <el-input-number
            v-model="form.SmallNumber"
            :min="0"
            :max="50"
            :step="1"
            label="超小飞轮数(1.5kg)"
            class="inline-input"
          ></el-input-number>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" class="FormLable">离心向心比值：</el-col>
        <el-col :span="7" :offset="1" class="FormItem">
          <el-input-number
            v-model="setPercent"
            :min="1"
            :max="3"
            :step="0.1"
            label="请输入向心离心之比"
            class="inline-input"
          ></el-input-number>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :span="8" :offset="6">
          <!-- 保存按钮 -->
          <el-button type="primary" @click="onSubmit" class="SubmitStyle" round
            >保存</el-button
          >
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import indexDB from '../../indexDB'

export default {
  data() {
    return {
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      UserInputVisible: false,
      input: null,
      layout: 'normal',
      form: {
        UserName: 'admin',
        GroupNumber: 5,
        GroupTime: 10,
        BigNumber: 1,
        MiddleNumber: 1,
        LittleNumber: 1,
        SmallNumber: 1
      },
      UserNameList: [],
      setPercent: 1.1 // 设定的向心与离心的百分比
    }
  },

  created() {
    // 从localStorage获取向心离心之比
    if (!window.localStorage.getItem('setPercent')) {
      window.localStorage.setItem('setPercent', '1.1')
    }
    this.setPercent = parseFloat(window.localStorage.getItem('setPercent'))
  },
  mounted() {
    this.UserNameList = this.loadAll()
    this.readCurrentUser() // 读取CurrentUserData配置表的数据，用于初始化配置页面
  },

  methods: {
    AcceptUserInput(text) {
      this.form.UserName = text
      this.HideUserInput()
    },
    ShowUserKeyboard(e) {
      this.input = e.target
      if (!this.UserInputVisible) {
        this.UserInputVisible = true
      }
    },
    HideUserInput() {
      this.UserInputVisible = false
    },

    /* 保存按钮 */
    onSubmit() {
      if (!this.setPercent) {
        this.setPercent = 1.1
      }
      window.localStorage.setItem('setPercent', this.setPercent)
      this.setCurrentUser()
    },

    querySearch(queryString, cb) {
      var UserNameList = this.UserNameList
      var results = queryString
        ? UserNameList.filter(this.createFilter(queryString))
        : UserNameList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return UserNameList => {
        return (
          UserNameList.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    loadAll() {
      var db
      var UserNameList = []
      var request = window.indexedDB.open('Inertia_flywheel_v1')
      request.onerror = event => {
        this.$notify({
          title: '警告',
          message: '数据库丢失，请重启设备！',
          type: 'warning',
          position: 'bottom-left'
        })
      }

      request.onsuccess = event => {
        db = request.result
        var transaction = db.transaction(['UserData'])
        var objectStore = transaction.objectStore('UserData')
        var readrequest = objectStore.getAllKeys()

        readrequest.onsuccess = event => {
          var RequestResult = readrequest.result
          for (var x in RequestResult) {
            UserNameList.push({ value: RequestResult[x] })
          }
        }

        readrequest.onerror = event => {
          this.$notify({
            title: '错误',
            message: '读取失败！',
            type: 'error',
            position: 'bottom-left'
          })
        }
      }
      return UserNameList
    },

    handleSelect(item) {
      this.HideUserInput()
      console.log(item)
    },

    /* 更新CurrentUserData配置表的数据 */
    setCurrentUser() {
      var db
      var request = window.indexedDB.open('Inertia_flywheel_v1')
      request.onerror = event => {
        this.$notify({
          title: '警告',
          message: '数据库丢失，请重启设备！',
          type: 'warning',
          position: 'bottom-left'
        })
      }

      request.onsuccess = event => {
        var dbs = event.target.result
        var transaction = dbs.transaction(['CurrentUserData'], 'readwrite')
        var objectStore = transaction.objectStore('CurrentUserData')
        objectStore.clear()
        var updaterequest = objectStore.add(this.form)
        updaterequest.onsuccess = event => {
          this.$notify({
            title: '提示',
            message: '修改成功！',
            type: 'success',
            position: 'bottom-left'
          })
        }
        updaterequest.onerror = event => {
          this.$notify({
            title: '错误',
            message: '修改失败！',
            type: 'error',
            position: 'bottom-left'
          })
        }
      }
    },

    /* 读取CurrentUserData配置表的数据，用于初始化配置页面 */
    readCurrentUser() {
      var db
      var request = window.indexedDB.open('Inertia_flywheel_v1')
      request.onerror = event => {
        this.$notify({
          title: '警告',
          message: '数据库丢失，请重启设备！',
          type: 'warning',
          position: 'bottom-left'
        })
      }
      request.onsuccess = event => {
        db = request.result
        var transaction = db.transaction(['CurrentUserData'])
        var objectStore = transaction.objectStore('CurrentUserData')
        var readrequest = objectStore.getAll()

        readrequest.onsuccess = event => {
          if (readrequest.result[0]) {
            this.form = readrequest.result[0]
          }
        }

        readrequest.onerror = event => {
          this.$notify({
            title: '错误',
            message: '读取失败！',
            type: 'error',
            position: 'bottom-left'
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.inline-input {
  width: 80%;
  height: 100px;
}
.SubmitStyle {
  width: 160px;
  height: 50px;
  font-size: 25px;
}
.FormLable {
  font-size: 25px;
  line-height: 80px;
  text-align: right;
}
.FormItem {
  font-size: 25px;
  line-height: 80px;
}
.el-input {
  font-size: 25px;
}
.el-input__inner {
  height: 60px;
  line-height: 40px;
}
.el-input-number__decrease,
.el-input-number__increase {
  z-index: 1;
  top: 1px;
  width: 60px;
  height: 58px;
  font-size: 25px;
  line-height: 58px;
}
.el-autocomplete-suggestion li {
  padding: 0 20px;
  margin: 0;
  line-height: 60px;
  font-size: 25px;
}
.el-autocomplete-suggestion__wrap {
  max-height: 75%;
}
.KeyBoardStyle {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 1000;
  width: 80%;
  margin: 0 auto;

  padding: 1em;

  background-color: #eee;
  box-shadow: 0px -3px 10px rgba(black, 0.3);

  border-radius: 10px;
}
</style>
