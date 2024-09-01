<template>
    <div>
      <!-- 使用 Header 组件 -->
      <Header :userName="userName" />
  
      <!-- 答题历史记录展示 -->
      <el-card class="box-card" v-if="answerHistory.length">
        <h3>答题历史记录</h3>
        <el-row v-for="(item, index) in formattedHistory" :key="index" style="margin-bottom: 10px;">
          <el-col :span="6">用户名: {{ item.userName }}</el-col>
          <el-col :span="6">答题次序: {{ item.ithAnswer }}</el-col>
          <el-col :span="6">答题开始时间: {{ item.testBegin }}</el-col>
          <el-col :span="6">答题结束时间: {{ item.testEnd }}</el-col>
        </el-row>
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
        sessionStorage.setItem("ithAnswer", this.formattedHistory.reduce((max, item) => {
                                              return item.ithAnswer + 1 > max ? item.ithAnswer + 1 : max;
                                          }, -1));
        sessionStorage.setItem("testBegin", new Date().toISOString());
        this.$getQuestion(1);
        // this.axios.get('/api/test/getQuestion', { params: { no: 1 } })
        //   .then(response => {
        //     if (response.data.code === '0') {
        //       const { htmlName } = response.data.data;
        //       if (htmlName === 'air_controller_t1') {
        //         this.$router.push('/questions/air_controller/air_controller_t1');
        //       } else if (htmlName === 'air_controller_t2') {
        //         this.$router.push('/questions/air_controller/air_controller_t2');
        //       } else if (htmlName === 'tickets_sale_t1') {
        //         this.$router.push('/questions/tickets_sale/tickets_sale_t1');
        //       } else if (htmlName === 'tickets_sale_t2') {
        //         this.$router.push('/questions/tickets_sale/tickets_sale_t2');
        //       } else if (htmlName === 'tickets_sale_t3') {
        //         this.$router.push('/questions/tickets_sale/tickets_sale_t3');
        //       } else {
        //         this.$message.error('未知的htmlName');
        //       }
        //     } else {
        //       this.$message.error(response.data.message || '获取问题失败');
        //     }
        //   })
        //   .catch(error => {
        //     console.error(error);
        //     this.$message.error('获取问题失败');
        //   });
      }
    }
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
  