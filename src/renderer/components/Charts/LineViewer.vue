<!--
 * @Author: your name
 * @Date: 2020-02-18 09:35:06
 * @LastEditTime: 2020-09-14 12:00:54
 * @LastEditors : Please set LastEditors
 * @Description: 通用组件（记录管理页面，查看用的图形）
 * @FilePath: \inertiawheel1\src\renderer\components\Charts\LineViewer.vue
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
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
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
    }
  },

  data() {
    return {
      chart: null
    }
  },

  watch: {
    ChartData() {
      this.setData()
    }
  },

  mounted() {
    this.initChart()
    this.setData()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose() // 释放图表实例，释放后实例不再可用
    this.chart = null
  },

  methods: {
    setData() {
      let AxisData = []
      let SpeedData = [] // 转速（r/s）
      let ForceData = [] // 力（kg）
      let PowerData = [] // 功率（kw）
      // 这个for循环看后边能否去掉，用传值的方式，减少性能开销
      for (let i = 0; i < this.ChartData.length; i++) {
        // 横坐标
        AxisData.push((i * 0.2).toFixed(1))

        // 转速
        SpeedData.push(this.ChartData[i].toFixed(2))

        // 力
        if (this.ChartData[i] == 0) {
          ForceData.push((0).toFixed(2))
        } else {
          ForceData.push(
            (
              this.BigNumber *
                ((((6.28 * 4.1 * 0.323) / 2) * this.ChartData[i]) / 0.2 / 10) +
              this.MiddleNumber *
                ((((6.28 * 3.2 * 0.27) / 2) * this.ChartData[i]) / 0.2 / 10) +
              this.LittleNumber *
                ((((6.28 * 2.2 * 0.215) / 2) * this.ChartData[i]) / 0.2 / 10) +
              this.SmallNumber *
                ((((6.28 * 1.5 * 0.2) / 2) * this.ChartData[i]) / 0.2 / 10)
            ).toFixed(2)
          )
        }

        // 功率
        if (this.ChartData[i] == 0) {
          PowerData.push((0).toFixed(2))
        } else {
          PowerData.push(
            (
              this.BigNumber *
                ((Math.pow(2 * Math.PI * (0.323 / 2) * this.ChartData[i], 2) *
                  4.1) /
                  0.2 /
                  1000) +
              this.MiddleNumber *
                ((Math.pow(2 * Math.PI * (0.27 / 2) * this.ChartData[i], 2) *
                  3.2) /
                  0.2 /
                  1000) +
              this.LittleNumber *
                ((Math.pow(2 * Math.PI * (0.215 / 2) * this.ChartData[i], 2) *
                  2.2) /
                  0.2 /
                  1000) +
              this.SmallNumber *
                ((Math.pow(2 * Math.PI * (0.2 / 2) * this.ChartData[i], 2) *
                  1.5) /
                  0.2 /
                  1000)
            ).toFixed(2)
          )
        }
      }

      // 配置数据
      this.chart.setOption({
        xAxis: {
          data: AxisData
        },
        series: [
          {
            name: '速度',
            data: SpeedData
          },
          {
            name: '力',
            data: ForceData
          },
          {
            name: '功率',
            data: PowerData
          }
        ]
      })
    },

    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          show: false,
          top: 20,
          text: '',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 24,
          itemHeight: 10,
          itemGap: 26,
          data: ['速度', '力', '功率'],
          right: '4%',
          textStyle: {
            fontSize: 16,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
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
        yAxis: [
          {
            type: 'value',
            name: '速度/力/功率',
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
            splitLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }
        ],
        series: [
          {
            name: '速度',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
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
            data: []
          },
          {
            name: '力',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
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
                borderWidth: 12
              }
            },
            data: []
          },
          {
            name: '功率',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
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
                borderWidth: 12
              }
            },
            data: []
          }
        ],
        animation: false // 关闭过渡动画，节省性能
        // animationDurationUpdate: 180,
        // animationEasingUpdate: 'quinticInOut'
      })
    }
  }
}
</script>
