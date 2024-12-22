<template>
    <div>
      <!-- 使用 Header 组件 -->
      <Header :userName="userName" />
  
      <!-- 答题历史记录展示 -->
      <el-card class="box-card" v-if="answerHistory.length">
        <h3>历史答题记录</h3>
        <el-row v-for="(item, index) in formattedHistory" :key="index" style="margin-bottom: 10px;">
          <el-col :span="6">用户名: {{ item.userName }}</el-col>
          <el-col :span="6">答题次序: {{ item.ithAnswer }}</el-col>
          <el-col :span="6">答题开始时间: {{ item.testBegin }}</el-col>
          <el-col :span="6">答题结束时间: {{ item.testEnd }}</el-col>
        </el-row>
      </el-card>
      <!-- 无答题记录展示 -->
       <el-card class="box-card" v-else>
        <h3>暂无答题记录</h3>
        <p>您还没有答题记录，请点击下方按钮开始能力测试。</p>
       </el-card>
  
      <!-- 进入能力测试按钮 -->
      <el-row style="margin-top: 20px;" type="flex" justify="center">
        <el-button type="primary" @click="startTest">进入能力测试</el-button>
      </el-row>
    </div>
  </template>
  
  <script>
  import moment from 'moment';
  import Header from '@/components/Header.vue';
  
  export default {
    components: {
      Header
    },
    data() {
      return {
        userName: '', // 从sessionStorage或其他来源获取
        answerHistory: [],
        formattedHistory: []
      };
    },
    created() {
      this.userName = JSON.parse(sessionStorage.getItem('userInfo')).userName;
      this.fetchAnswerHistory();
    },
    methods: {
      fetchAnswerHistory() {
        this.axios.get('/api/user/getAnswerHistory', { params: { userName: this.userName } })
          .then(response => {
            if (response.data.code === '0') {
              this.answerHistory = response.data.data;
              this.formattedHistory = this.answerHistory.map(item => ({
                ...item,
                testBegin: moment(item.testBegin).format('YYYY-MM-DD HH:mm:ss'),
                testEnd: moment(item.testEnd).format('YYYY-MM-DD HH:mm:ss')
              }));
            } else {
              this.$message.error(response.data.message || '获取答题历史失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('获取答题历史失败');
          });
      },
      startTest() {
        if (this.answerHistory.length > 0) {
          sessionStorage.setItem("ithAnswer", this.formattedHistory.reduce((max, item) => {
                                              return item.ithAnswer + 1 > max ? item.ithAnswer + 1 : max;
                                          }, -1));
        } else {
          sessionStorage.setItem("ithAnswer", 1);
        }
        sessionStorage.setItem("testBegin", new Date().toISOString());
        this.$getQuestion(1);
      }
    },
    mounted() {
      // 初始化默认标签
      this.fetchAnswerHistory();
    },
  };
  </script>
  
  <style scoped>
  .box-card {
    margin: 20px;
  }
  
  .el-row {
    margin-bottom: 10px;
  }
  </style>
  