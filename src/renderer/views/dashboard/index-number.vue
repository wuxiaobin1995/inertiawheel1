<!--
 * @Author: 吴晓斌
 * @Date: 2020-02-18 09:35:06
 * @LastEditTime: 2021-07-30 10:55:17
 * @Description: 运动测试-组次模式
 -->
<template>
  <div class="dashboard-container">
    <!-- 语音播放 -->
    <audio ref="audio" controls="controls" hidden :src="audioTipSrc" />

    <!-- 系统名称 -->
    <div class="logo">
      <div class="logo-text">台式离心飞轮训练系统 v1.0.0</div>
    </div>

    <div class="top">
      <!-- LineMarker运动图子组件 -->
      <div class="line-marker-container">
        <line-marker
          width="100%"
          height="100%"
          :ChartData="ChartData"
          :BigNumber="RecordForm.BigNumber"
          :MiddleNumber="RecordForm.MiddleNumber"
          :LittleNumber="RecordForm.LittleNumber"
          :SmallNumber="RecordForm.SmallNumber"
          :resetChart="resetChart"
        />
      </div>
    </div>

    <div class="bottom">
      <!-- TestMarker仪表盘子组件 -->
      <div class="test-marker-container">
        <test-marker
          width="100%"
          height="100%"
          :ChartData="staticChartData"
          :BigNumber="RecordForm.BigNumber"
          :MiddleNumber="RecordForm.MiddleNumber"
          :LittleNumber="RecordForm.LittleNumber"
          :SmallNumber="RecordForm.SmallNumber"
        />
      </div>
      <!-- 控制区 -->
      <div class="button-container">
        <!-- 当前次数 -->
        <el-tag type="success" color="white" hit class="num"
          >当前次数: {{ count }} | {{ GroupNumber }}</el-tag
        >
        <!-- 总做功 -->
        <el-tag type="danger" color="white" hit class="num"
          >功: {{ work }} J</el-tag
        >
        <!-- 向心离心之比 -->
        <el-tag type="success" color="white" hit class="num"
          >离心比值: {{ result }}</el-tag
        >
        <!-- 开始按钮 -->
        <el-button
          round
          class="oc-button"
          type="primary"
          icon="el-icon-caret-right"
          @click="openSerial"
          :disabled="!isConnect"
          v-if="!isOpened"
          >开始</el-button
        >
        <!-- 结束按钮 -->
        <el-button
          round
          class="oc-button"
          type="danger"
          icon="el-icon-loading"
          @click="closeSerial"
          v-else
          >结束</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
/* 路径模块 */
import path from 'path'

/* 通信库 */
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

/* 子组件 */
import LineMarker from '@/components/Charts/LineMarker'
import TestMarker from '@/components/Charts/TestMarker'

export default {
  name: 'index-number',

  components: {
    LineMarker, // 曲线图
    TestMarker // 仪表盘
  },

  data() {
    return {
      F103Port: null,
      parser: null,
      isConnect: true, // USB连接状态
      isOpened: false, // 串口open/close按钮
      ChartData: [], // 动态变化的数据，传给LineMarker组件
      staticChartData: 0, // 静态的数据，传给TestMarker组件
      resetChart: false, // 用于初始化图表，允许在不切换路由时，继续进行下一次记录
      isOne: true, // 保证只保存一次
      count: 0, // 记录次数
      GroupNumber: 1, // 默认次数，次
      status: 'up', // 用于判断波峰
      // 写入RecordData表的数据
      RecordForm: {
        UserName: '', // 用户名
        ChartData: [], // 最终存入index的最终数据，这个LineViewer会用到
        RecordTime: '', // // 记录时间
        Rate: 5, // 评分打星，0~5星
        BigNumber: 0, // 大飞轮数量（4.1kg）
        MiddleNumber: 0, // 中飞轮数量（3.2kg）
        LittleNumber: 0, // 小飞轮数量（2.2kg）
        SmallNumber: 0 // 超小飞轮数量（1.5kg）
      },
      // 向心与离心之比的相关数据
      audioTipSrc: path.join(__static, 'music/ding.mp3'), // 音频路径，符合离心训练时发出提示音
      percentStatus: 'up',
      up: [],
      down: [],
      result: 0, // 离心运动之比
      setPercent: 1.4, // 设定的向心与离心的百分比
      // 计算总功的相关数据
      work: 0, // 总功
      instantaneousPowerArray: [] // 瞬时功率数组
    }
  },

  created() {
    // 从localStorage获取向心离心之比
    if (!window.localStorage.getItem('setPercent')) {
      window.localStorage.setItem('setPercent', '1.4')
    }
    this.setPercent = parseFloat(window.localStorage.getItem('setPercent'))
  },
  mounted() {
    this.readCurrentUser() // 读取CurrentUserData表的数据，用于初始化data中的数据
    this.initSerialPort() // 创建串口通信实例，但记录与否取决于按钮开关
  },
  beforeDestroy() {
    if (this.F103Port) {
      if (this.F103Port.isOpen) {
        this.F103Port.close()
      }
    }
  },

  methods: {
    /* 创建串口通信实例，但记录与否取决于按钮开关 */
    initSerialPort() {
      let comPath = ''
      SerialPort.list((err, ports) => {
        /* 遍历设备的USB串口，目标设备需安装驱动 */
        for (const port of ports) {
          if (/^USB/.test(port.pnpId)) {
            comPath = port.comName // 新版SerialPort的comName被废弃了，请用path
            break
          }
        }

        /* 验证USB有没有连接到电脑，但不能验证有无数据发送给上位机 */
        if (comPath) {
          // 创建串口实例
          this.F103Port = new SerialPort(comPath, {
            baudRate: 9600, // 波特率，与单片机保持一致
            autoOpen: false // 是否自动开启
          })
          /* 开启串口成功，触发 */
          this.F103Port.on('open', msg => {
            this.$notify({
              title: '开启串口成功',
              message: `已连接到${comPath}`,
              type: 'success',
              position: 'bottom-left',
              duration: 2000
            })
          })
          /* 开启串口失败，触发 */
          this.F103Port.on('error', err => {
            this.isConnect = false
            this.$notify({
              title: '没有检测到USB连接',
              message: '请重新连接USB线，然后刷新页面或重启设备',
              type: 'error',
              position: 'bottom-left'
            })
          })
          /* Readline解析器将数据转换成字符串 */
          this.parser = this.F103Port.pipe(new Readline({ delimiter: '\n' })) // 设置读取方法
          /* 流式通信，每隔0.2秒下位机发送一次数据，data是转速（r/s） */
          this.parser.on('data', data => {
            /*  数据预处理 */
            let rotateSpeed = parseFloat(data)

            // 过滤掉转速小于3的data值，直接赋值0
            if (rotateSpeed < 3) {
              rotateSpeed = 0
            }

            // 不能超过600秒，防止内存溢出
            if ((this.ChartData.length - 1) * 0.2 <= 600) {
              this.ChartData.push(rotateSpeed)
              this.staticChartData = rotateSpeed

              /* 实时计算做功的逻辑 */
              const instantaneousPower = parseFloat(
                (
                  (this.RecordForm.BigNumber *
                    ((Math.pow(2 * Math.PI * (0.323 / 2) * rotateSpeed, 2) *
                      4.1) /
                      0.2 /
                      1000) +
                    this.RecordForm.MiddleNumber *
                      ((Math.pow(2 * Math.PI * (0.27 / 2) * rotateSpeed, 2) *
                        3.2) /
                        0.2 /
                        1000) +
                    this.RecordForm.LittleNumber *
                      ((Math.pow(2 * Math.PI * (0.215 / 2) * rotateSpeed, 2) *
                        2.2) /
                        0.2 /
                        1000) +
                    this.RecordForm.SmallNumber *
                      ((Math.pow(2 * Math.PI * (0.2 / 2) * rotateSpeed, 2) *
                        1.5) /
                        0.2 /
                        1000)) *
                  1000
                ).toFixed(0)
              )
              this.instantaneousPowerArray.push(instantaneousPower)
              if (this.instantaneousPowerArray.length >= 2) {
                const lastInstantaneousPower = this.instantaneousPowerArray[
                  this.instantaneousPowerArray.length - 2
                ]
                const nextInstantaneousPower = this.instantaneousPowerArray[
                  this.instantaneousPowerArray.length - 1
                ]
                if (nextInstantaneousPower - lastInstantaneousPower > 0) {
                  this.work +=
                    lastInstantaneousPower * 0.2 +
                    (Math.abs(nextInstantaneousPower - lastInstantaneousPower) *
                      0.2) /
                      2
                } else if (
                  nextInstantaneousPower - lastInstantaneousPower <
                  0
                ) {
                  this.work +=
                    nextInstantaneousPower * 0.2 +
                    (Math.abs(nextInstantaneousPower - lastInstantaneousPower) *
                      0.2) /
                      2
                } else if (
                  nextInstantaneousPower - lastInstantaneousPower ===
                  0
                ) {
                  this.work += nextInstantaneousPower * 0.2
                }
              }
              this.work = parseFloat(this.work.toFixed(0))

              /* 向心与离心百分比逻辑 */
              if (this.ChartData.length >= 2) {
                const s1 = this.ChartData[this.ChartData.length - 2]
                const s2 = this.ChartData[this.ChartData.length - 1]
                if (s2 - s1 >= 0 && this.percentStatus === 'down') {
                  if (this.down.length === 0) {
                    this.result = 0
                  } else {
                    this.result = parseFloat(
                      (this.up.length / this.down.length).toFixed(2)
                    )
                  }
                  if (this.result >= this.setPercent) {
                    this.audioTip() // 发出音效
                  }
                  this.up = []
                  this.down = []
                  this.percentStatus = 'up'
                }
                if (s2 - s1 > 0) {
                  this.percentStatus = 'up'
                  this.up.push(rotateSpeed)
                } else if (s2 - s1 < 0) {
                  this.percentStatus = 'down'
                  this.down.push(rotateSpeed)
                }
              }

              /* 波峰个数逻辑 */
              if (this.count < this.GroupNumber) {
                if (this.ChartData.length >= 2) {
                  let v1 = this.ChartData[this.ChartData.length - 2]
                  let v2 = this.ChartData[this.ChartData.length - 1]
                  if (v2 - v1 > 0) {
                    if (this.status === 'down') {
                      this.status = 'up'
                    }
                  } else if (v2 - v1 < 0) {
                    if (this.status === 'up') {
                      this.count += 1
                      this.status = 'down'
                    }
                  }
                }
              } else if (this.count === this.GroupNumber) {
                if (this.F103Port.isOpen) {
                  this.F103Port.close()
                }
                // 保存数据到数据库
                this.saveRecordForm()
              }
            } else {
              if (this.F103Port.isOpen) {
                this.F103Port.close()
              }
              // 保存数据到数据库
              this.saveRecordForm()
            }
          })
        } else {
          this.isConnect = false
          this.$alert(
            '没有检测到USB连接，请重新连接USB线，然后刷新页面或重启设备',
            '错误',
            {
              confirmButtonText: '确认',
              callback: action => {}
            }
          )
        }
      })
    },

    /* 读取CurrentUserData表，系统配置页面的数据 */
    readCurrentUser() {
      let db
      let request = window.indexedDB.open('Inertia_flywheel_v1')
      // 错误处理
      request.onerror = event => {
        this.$notify({
          title: '警告',
          message: '数据库丢失，请重启设备！',
          type: 'warning',
          position: 'bottom-left'
        })
      }
      // 成功
      request.onsuccess = event => {
        db = request.result
        let transaction = db.transaction(['CurrentUserData'])
        let objectStore = transaction.objectStore('CurrentUserData')
        let readrequest = objectStore.getAll()
        readrequest.onsuccess = event => {
          this.RecordForm.UserName = readrequest.result[0].UserName
          this.GroupNumber = readrequest.result[0].GroupNumber // 一组次数
          this.RecordForm.BigNumber = readrequest.result[0].BigNumber
          this.RecordForm.MiddleNumber = readrequest.result[0].MiddleNumber
          this.RecordForm.LittleNumber = readrequest.result[0].LittleNumber
          this.RecordForm.SmallNumber = readrequest.result[0].SmallNumber
        }
        readrequest.onerror = event => {
          this.$notify({
            title: '错误',
            message: '系统配置页信息读取失败，请重启设备！',
            type: 'error',
            position: 'bottom-left'
          })
        }
      }
    },

    /* 保存数据逻辑 */
    saveRecordForm() {
      if (this.isOne) {
        this.isOne = false
        // 最终数据
        this.RecordForm.ChartData = this.ChartData
        // 记录时间，以测试结束那一刻作为记录时间
        this.RecordForm.RecordTime = this.$moment().format(
          'YYYY-MM-DD HH:mm:ss'
        )
        // 评分打星，直接5分，不要耗费性能去判断了（无用）
        this.RecordForm.Rate = 5
        // 调用createRecordData函数，保存该次的数据到RecordData表中
        this.createRecordData(this.RecordForm)
        this.isOpened = false // 重置open/close按钮的状态
        this.isConnect = true // 重新设置开始按钮为可用状态
      }
    },

    /* 数据写入RecordData表函数 */
    createRecordData(data) {
      let db
      let request = window.indexedDB.open('Inertia_flywheel_v1')
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
        let createrequest = db
          .transaction(['RecordData'], 'readwrite')
          .objectStore('RecordData')
          .add(data)
        createrequest.onsuccess = event => {
          this.$notify({
            title: '提示',
            message: '数据保存成功',
            type: 'success',
            position: 'bottom-left'
          })
        }
        createrequest.onerror = event => {
          this.$notify({
            title: '错误',
            message: '保存数据时发生错误，请重新启动程序！',
            type: 'error',
            position: 'bottom-left'
          })
        }
      }
    },

    /* 开启串口按钮 */
    openSerial() {
      this.count = 0
      this.isOne = true
      this.isOpened = true
      this.isConnect = true
      this.resetChart = !this.resetChart
      this.ChartData = []
      // 向心与离心的百分比数据初始化
      this.up = []
      this.down = []
      this.percentStatus = 'up'
      this.result = 0
      // 计算总功的相关数据初始化
      this.work = 0
      this.instantaneousPowerArray = []
      if (!this.F103Port.isOpen) {
        this.F103Port.open()
      }
    },
    /* 关闭串口按钮 */
    closeSerial() {
      if (this.F103Port.isOpen) {
        this.F103Port.close()
        this.saveRecordForm()
      }
    },

    /**
     * @description: 符合离心训练发出提示音
     */
    audioTip() {
      this.$refs.audio.currentTime = 0 // 从头开始播放提示音
      this.$refs.audio.play() // 播放
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 88vh;

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30px;
    margin-top: 10px;

    .logo-text {
      font-size: 26px;
      font-weight: bold;
      color: green;
    }
  }

  .top {
    display: flex;
    height: 50%;

    .line-marker-container {
      width: 100%;
      height: 100%;
    }
  }

  .bottom {
    display: flex;
    height: 50%;

    .test-marker-container {
      width: 70%;
      height: 100%;
    }

    .button-container {
      width: 30%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .oc-button {
        width: 70%;
        height: 40%;
        font-size: 40px;
      }
      .sc-button {
        width: 70%;
        height: 40%;
        font-size: 40px;
        margin-top: 30px;
        margin-left: 0;
      }
      .num {
        width: 70%;
        height: 66px;
        line-height: 66px;
        margin-bottom: 20px;
        font-size: 30px;
        text-align: center;
      }
    }
  }
}
</style>
