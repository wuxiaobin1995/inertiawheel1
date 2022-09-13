<!--
 * @Author: your name
 * @Date: 2020-02-18 09:35:06
 * @LastEditTime: 2020-09-14 11:59:32
 * @LastEditors : Please set LastEditors
 * @Description: 通用组件-运动图
 * @FilePath: \inertiawheel1\src\renderer\components\Charts\LineMarker.vue
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
    :resetChart="resetChart"
  />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'LineMarker',

  props: {
    id: {
      type: String,
      default: 'LineMarker'
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
      type: Array,
      default: function() {
        return []
      }
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
    },
    // resetChart用于初始化图表，允许在不切换路由时，继续进行下一次记录，为true时重置
    resetChart: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      chart: null,
      AxisData: [], // 横坐标
      SpeedData: [], // 转速（r/s）
      ForceData: [], // 力（kg）
      PowerData: [] // 功率（kw）
    }
  },

  mounted() {
    this.initChart() // 初始化配置项
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose() //释放图表实例，释放后实例不再可用
    this.chart = null
  },

  watch: {
    ChartData() {
      let currentData
      if (!this.ChartData[this.ChartData.length - 1]) {
        currentData = 0
      } else {
        currentData = this.ChartData[this.ChartData.length - 1]
      }

      // 横坐标
      this.AxisData.push(((this.ChartData.length - 1) * 0.2).toFixed(1))
      // console.log(this.AxisData)

      // 转速
      this.SpeedData.push(currentData.toFixed(2))
      // console.log(this.SpeedData)

      // 力
      if (currentData == 0) {
        this.ForceData.push((0).toFixed(2))
      } else {
        this.ForceData.push(
          (
            this.BigNumber *
              ((((6.28 * 4.1 * 0.323) / 2) * currentData) / 0.2 / 10) +
            this.MiddleNumber *
              ((((6.28 * 3.2 * 0.27) / 2) * currentData) / 0.2 / 10) +
            this.LittleNumber *
              ((((6.28 * 2.2 * 0.215) / 2) * currentData) / 0.2 / 10) +
            this.SmallNumber *
              ((((6.28 * 1.5 * 0.2) / 2) * currentData) / 0.2 / 10)
          ).toFixed(2)
        )
      }
      // console.log(this.ForceData)

      // 功率
      if (currentData == 0) {
        this.PowerData.push((0).toFixed(2))
      } else {
        this.PowerData.push(
          (
            this.BigNumber *
              ((Math.pow(2 * Math.PI * (0.323 / 2) * currentData, 2) * 4.1) /
                0.2 /
                1000) +
            this.MiddleNumber *
              ((Math.pow(2 * Math.PI * (0.27 / 2) * currentData, 2) * 3.2) /
                0.2 /
                1000) +
            this.LittleNumber *
              ((Math.pow(2 * Math.PI * (0.215 / 2) * currentData, 2) * 2.2) /
                0.2 /
                1000) +
            this.SmallNumber *
              ((Math.pow(2 * Math.PI * (0.2 / 2) * currentData, 2) * 1.5) /
                0.2 /
                1000)
          ).toFixed(2)
        )
      }
      // console.log(this.PowerData)

      // 配置数据
      this.chart.setOption({
        xAxis: {
          data: this.AxisData
        },
        series: [
          {
            name: '速度',
            data: this.SpeedData
          },
          {
            name: '力',
            data: this.ForceData
          },
          {
            name: '功率',
            data: this.PowerData
          }
        ]
      })
    },
    // resetChart用于初始化图表，允许在不切换路由时，继续进行下一次记录
    resetChart() {
      // console.log('启动重置')
      this.chart.dispose() //释放图表实例，释放后实例不再可用
      this.chart = null
      this.AxisData = []
      this.SpeedData = []
      this.ForceData = []
      this.PowerData = []
      this.initChart()
    }
  },

  methods: {
    /* 初始化配置项 */
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        backgroundColor: '#ffffff', // 背景颜色
        /* 提示框组件 */
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        // 图例组件，展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 24,
          itemHeight: 10,
          itemGap: 26,
          data: ['速度', '力', '功率'],
          right: '4%',
          textStyle: {
            fontSize: 22,
            color: '#000000' // 字体颜色
          },
          // 默认下是否选中
          selected: {
            速度: true,
            力: false,
            功率: false
          }
        },
        // 直角坐标系内绘图网格，单个 echarts 实例中可存放多个 grid 组件
        grid: {
          top: 70,
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        // 直角坐标系 grid 中的 x 轴
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: [] // X轴的定义
          }
        ],
        // 直角坐标系 grid 中的 y 轴
        yAxis: [
          {
            type: 'value',
            name: '速度-力-功率',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            /* 网格线 */
            splitLine: {
              lineStyle: {
                color: '#DEDEDE'
              }
            }
          }
        ],
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [
          // 折线图-速度
          {
            name: '速度',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(137, 189, 27, 0.3)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(137, 189, 27, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12
              }
            },
            markPoint: {
              symbolSize: 68,
              data: [{ type: 'max', name: '最大值' }]
            },
            data: [0]
          },
          // 柱状图-力
          {
            name: '力',
            type: 'bar',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(0, 136, 212, 0.3)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(0, 136, 212, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(0,136,212)',
                borderColor: 'rgba(0,136,212,0.2)',
                borderWidth: 1
              }
            },
            data: [0]
          },
          // 柱状图-功率
          {
            name: '功率',
            type: 'bar',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(219, 50, 51, 0.3)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(219, 50, 51, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(219,50,51)',
                borderColor: 'rgba(219,50,51,0.2)',
                borderWidth: 1
              }
            },
            data: [0]
          }
        ],
        animation: true,
        animationDurationUpdate: 180 // 数据更新动画的时长，默认300毫秒渲染一次
        // animationEasingUpdate: 'quinticInOut' // 数据更新动画的缓动效果
      })
    }
  }
}
</script>
