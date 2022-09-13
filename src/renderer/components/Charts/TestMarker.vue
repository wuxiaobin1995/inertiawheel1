<!--
 * @Author: your name
 * @Date: 2020-02-18 09:35:06
 * @LastEditTime: 2020-09-14 12:01:42
 * @LastEditors : Please set LastEditors
 * @Description: 通用组件-仪表盘
 * @FilePath: \inertiawheel1\src\renderer\components\Charts\TestMarker.vue
 -->
<template>
  <div
    :id="id"
    :class="className"
    :style="{ height: height, width: width }"
    :data="ChartData"
    :BigNumber="BigNumber"
    :MiddleNumber="MiddleNumber"
    :LittleNumber="LittleNumber"
    :SmallNumber="SmallNumber"
  />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'TestMarker',

  props: {
    id: {
      type: String,
      default: 'TestMarker'
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    ChartData: {
      type: Number,
      default: 0
    },
    BigNumber: {
      type: Number,
      default: 0
    },
    MiddleNumber: {
      type: Number,
      default: 0
    },
    LittleNumber: {
      type: Number,
      default: 0
    },
    SmallNumber: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      chart: null
    }
  },

  mounted() {
    this.initChart() // 初始化配置项
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose() // 释放图表实例，释放后实例不再可用
    this.chart = null
  },

  watch: {
    ChartData: {
      handler() {
        // 数据
        let AxisData = [] // 横坐标
        let SpeedData = [] // 转速（r/s）
        let ForceData = [] // 力（kg）
        let PowerData = [] // 功率（kw）
        PowerData.push({
          value: (
            this.BigNumber *
              ((Math.pow(2 * Math.PI * (0.323 / 2) * this.ChartData, 2) * 4.1) /
                0.2 /
                1000) +
            this.MiddleNumber *
              ((Math.pow(2 * Math.PI * (0.27 / 2) * this.ChartData, 2) * 3.2) /
                0.2 /
                1000) +
            this.LittleNumber *
              ((Math.pow(2 * Math.PI * (0.215 / 2) * this.ChartData, 2) * 2.2) /
                0.2 /
                1000) +
            this.SmallNumber *
              ((Math.pow(2 * Math.PI * (0.2 / 2) * this.ChartData, 2) * 1.5) /
                0.2 /
                1000)
          ).toFixed(2),
          name: '功率'
        })
        SpeedData.push({
          value: this.ChartData.toFixed(0),
          name: '速度'
        })
        ForceData.push({
          value: (
            this.BigNumber *
              ((((6.28 * 4.1 * 0.323) / 2) * this.ChartData) / 0.2 / 10) +
            this.MiddleNumber *
              ((((6.28 * 3.2 * 0.27) / 2) * this.ChartData) / 0.2 / 10) +
            this.LittleNumber *
              ((((6.28 * 2.2 * 0.215) / 2) * this.ChartData) / 0.2 / 10) +
            this.SmallNumber *
              ((((6.28 * 1.5 * 0.2) / 2) * this.ChartData) / 0.2 / 10)
          ).toFixed(0),
          name: '公斤'
        })
        // 配置数据
        this.chart.setOption({
          series: [
            {
              name: '速度',
              data: SpeedData
            },
            {
              name: '公斤',
              data: ForceData
            },
            {
              name: '功率',
              data: PowerData
            }
          ]
        })
      }
    }
  },

  methods: {
    /* 初始化配置项 */
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        backgroundColor: '#ffffff',
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            type: 'gauge', // 类型-仪表盘gauge
            name: '公斤',
            radius: '65%', // 仪表盘半径
            min: 0, // 仪表盘范围值min
            max: 99, // 仪表盘范围值max
            splitNumber: 11, // 仪表盘刻度的分割段数
            center: ['50%', '35%'], // 空间位置
            /* 仪表盘轴线相关配置 */
            axisLine: {
              /* 仪表盘轴线样式 */
              lineStyle: {
                /* 不同段的颜色 */
                color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
                width: 3, // 轴线宽度
                shadowBlur: 10, // 图形阴影的模糊大小
                shadowColor: '#000000' //默认透明
              }
            },
            /* 刻度标签 */
            axisLabel: {
              textStyle: {
                fontWeight: 'bolder',
                color: '#000000',
                shadowColor: '#ffffff', //默认透明
                shadowBlur: 10
              }
            },
            /* 刻度样式 */
            axisTick: {
              length: 15, // 线长
              lineStyle: {
                color: 'auto',
                shadowColor: '#000000', //默认透明
                shadowBlur: 10
              }
            },
            /* 分隔线样式 */
            splitLine: {
              length: 25, // 属性length控制线长
              /* 控制线条样式 */
              lineStyle: {
                width: 3, // 线宽
                color: '#000000',
                shadowColor: '#000000', //默认透明
                shadowBlur: 10
              }
            },
            /* 仪表盘指针 */
            pointer: {
              show: true,
              shadowColor: '#fff', //默认透明
              shadowBlur: 5
            },
            /* 仪表盘标题 */
            title: {
              offsetCenter: [0, '-45%'], // 标题相对仪表盘的位置
              textStyle: {
                fontWeight: 'bolder',
                fontSize: 30,
                fontStyle: 'italic',
                color: '#000000', // 颜色
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: 'rgba(30,144,255,0.8)',
              borderWidth: 1,
              borderColor: '#fff',
              shadowColor: '#000000', //默认透明
              shadowBlur: 5,
              offsetCenter: [0, '70%'], // x, y，单位px
              formatter: '{value} KG',
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                color: '#fff',
                fontSize: 28
              }
            },
            data: [{ name: '公斤', value: 0 }] // 数据项
          },
          {
            name: '速度',
            type: 'gauge',
            center: ['22%', '70%'],
            min: 0,
            max: 33,
            splitNumber: 11,
            radius: '60%',
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
                width: 3,
                shadowColor: '#000000', //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: 'bolder',
                color: '#000000',
                shadowColor: '#ffffff', //默认透明
                shadowBlur: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto',
                shadowColor: '#000000', //默认透明
                shadowBlur: 10
              }
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: '#000000',
                shadowColor: '#000000', //默认透明
                shadowBlur: 10
              }
            },
            pointer: {
              // 分隔线
              shadowColor: '#ffffff', //默认透明
              shadowBlur: 5
            },
            title: {
              offsetCenter: [0, '-35%'], // 标题相对仪表盘的位置
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 30,
                fontStyle: 'italic',
                color: '#000000',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: 'rgba(30,144,255,0.8)',
              borderWidth: 1,
              borderColor: '#ffffff',
              shadowColor: '#000000', //默认透明
              shadowBlur: 5,
              offsetCenter: [0, '70%'], // x, y，单位px
              formatter: '{value} r/s',
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                color: '#ffffff',
                fontSize: 28
              }
            },
            data: [{ value: 0, name: '速度' }]
          },
          {
            name: '功率',
            type: 'gauge',
            center: ['78%', '70%'],
            min: 0,
            max: 11,
            splitNumber: 11,
            radius: '60%',
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
                width: 3,
                shadowColor: '#000000', //默认透明
                shadowBlur: 10
              }
            },
            axisLabel: {
              // 坐标轴小标记
              textStyle: {
                // 属性lineStyle控制线条样式
                fontWeight: 'bolder',
                color: '#000000',
                shadowColor: '#ffffff', //默认透明
                shadowBlur: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto',
                shadowColor: '#000000', //默认透明
                shadowBlur: 10
              }
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: '#000000',
                shadowColor: '#ffffff', //默认透明
                shadowBlur: 10
              }
            },
            pointer: {
              // 分隔线
              shadowColor: '#ffffff', //默认透明
              shadowBlur: 5
            },
            title: {
              offsetCenter: [0, '-35%'], // 标题相对仪表盘的位置
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 30,
                fontStyle: 'italic',
                color: '#000000',
                shadowColor: '#ffffff', //默认透明
                shadowBlur: 10
              }
            },
            detail: {
              backgroundColor: 'rgba(30,144,255,0.8)',
              borderWidth: 1,
              borderColor: '#ffffff',
              shadowColor: '#000000', //默认透明
              shadowBlur: 5,
              offsetCenter: [0, '70%'], // x, y，单位px
              formatter: '{value} KW',
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                color: '#ffffff',
                fontSize: 28
              }
            },
            data: [{ value: 0, name: '功率' }]
          }
        ],
        animation: false // 是否开启过渡动画
        // animationDurationUpdate: 180 // 多久渲染一次
      })
    }
  }
}
</script>
