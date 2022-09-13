<!--
 * @Author      : 吴晓斌
 * @CreateData  : 2020-06-11 16:50:18
 * @LastEditTime: 2021-01-04 10:33:20
 * @Description : 视频教程页
-->
<template>
  <div class="video-container">
    <!-- 标签快速跳转 -->
    <el-card class="box-card-navigation">
      <div slot="header">
        <span>快速导航</span>
      </div>
      <div>
        <el-row>
          <span style="font-size: 40px">上肢训练:</span>
          <span v-for="item in oneArr" :key="item.id">
            <el-button
              class="box-card-navigation-btn"
              type="primary"
              plain
              @click="handleGo(item.id)"
            >
              {{ item.title }}
            </el-button>
          </span>
        </el-row>
        <el-row>
          <span style="font-size: 40px">核心训练:</span>
          <span v-for="item in twoArr" :key="item.id">
            <el-button
              class="box-card-navigation-btn"
              type="primary"
              plain
              @click="handleGo(item.id)"
            >
              {{ item.title }}
            </el-button>
          </span>
        </el-row>
        <el-row>
          <span style="font-size: 40px">下肢训练:</span>
          <span v-for="item in threeArr" :key="item.id">
            <el-button
              class="box-card-navigation-btn"
              type="primary"
              plain
              @click="handleGo(item.id)"
            >
              {{ item.title }}
            </el-button>
          </span>
        </el-row>
      </div>
    </el-card>
    <!-- 视频卡片 -->
    <el-card
      :id="item.id"
      v-for="item in videoResource"
      :key="item.id"
      class="box-card"
    >
      <!-- 头部 -->
      <div slot="header" class="title">
        <span>{{ item.title }}</span>
        <el-button
          style="float: right; padding: 3px 0; font-size: 24px"
          type="text"
          icon="el-icon-caret-top"
          @click="handleUp"
          >回到顶部</el-button
        >
      </div>
      <!-- 内容 -->
      <el-row>
        <el-col :span="14">
          <video
            :src="item.src"
            controls="controls"
            width="100%"
            height="500px"
          ></video>
        </el-col>
        <el-col :span="10" class="introduction">
          {{ item.introduction }}
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import path from 'path'

import { videoResource } from './video.js'

export default {
  name: 'trainCourse',

  data() {
    return {
      videoResource: videoResource,
      oneArr: [
        {
          id: 'v8',
          title: '直立上拉'
        },
        {
          id: 'v9',
          title: '双臂弯举'
        },
        {
          id: 'v10',
          title: '单臂划船'
        }
      ],
      twoArr: [
        {
          id: 'v5',
          title: '单腿直腿硬拉'
        },
        {
          id: 'v7',
          title: '髋屈蹬伸划船'
        },
        {
          id: 'v3',
          title: '髋屈伸'
        },
        {
          id: 'v1',
          title: '半蹲蹬伸'
        },
        {
          id: 'v2',
          title: '弓步蹬伸'
        },
        {
          id: 'v4',
          title: '直腿硬拉'
        },
        {
          id: 'v6',
          title: '俯身划船'
        },
        {
          id: 'v11',
          title: '脊柱侧屈'
        },

        {
          id: 'v13',
          title: '单腿伸髋'
        },
        {
          id: 'v15',
          title: '俯撑蹬伸'
        },
        {
          id: 'v17',
          title: '臀桥'
        }
      ],
      threeArr: [
        {
          id: 'v16',
          title: '俯卧腿弯举'
        },
        {
          id: 'v12',
          title: '单腿弯举'
        },
        {
          id: 'v14',
          title: '提髋上抬'
        }
      ]
    }
  },

  methods: {
    /* 回到顶部按钮 */
    handleUp() {
      window.document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    /* 标签链接跳转按钮 */
    handleGo(id) {
      document.querySelector('#' + id).scrollIntoView(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.video-container {
  background: #eeeeee;
  padding: 10px 10px;

  .box-card-navigation {
    margin-bottom: 10px;
    .box-card-navigation-btn {
      font-size: 40px;
      margin: 10px 10px;
    }
  }

  .box-card {
    margin-bottom: 10px;
    .title {
      font-size: 30px;
      color: #f56c6c;
    }
    .introduction {
      font-size: 24px;
      text-indent: 2em;
      line-height: 1.5em;
      padding-left: 5px;
    }
  }
}
</style>
