<template>
    <div>
      <el-card>
        <h3>系统信息</h3>
        <p>用户数量: {{ systemInfo.userCount }}</p>
        <p>总答题次数: {{ systemInfo.answerCount }}</p>
        <p>试题数量: {{ systemInfo.questionCount }}</p>
      </el-card>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        systemInfo: {
          userCount: 0,
          answerCount: 0,
          questionCount: 0
        }
      };
    },
    created() {
      this.fetchSystemInfo();
    },
    methods: {
      fetchSystemInfo() {
        this.axios.get('/api/admin/getDescInfo').then(response => {
          if (response.data.code === "0") {
            this.systemInfo = response.data.data;
          } else {
            this.$message.error('获取系统信息失败');
          }
        }).catch(error => {
          console.error(error);
          this.$message.error('获取系统信息失败');
        });
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  