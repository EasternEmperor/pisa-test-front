<template>
    <el-header>
      <div style="float: right;">
        <span>欢迎 {{ user.userName }}</span>
        <el-button @click="logout" type="text">登出</el-button>
      </div>
    </el-header>
  </template>
  
  <script>
  export default {
    data() {
      return user : {
        userName: "" // 示例用户名，实际应该从后台获取
        id: null
        role: ""
      };
    },
    methods: {
        logout() {
            // 执行登出操作
            // 移除本地用户登录信息
            sessionStorage.removeItem('userInfo');
            // 跳转页面到登录页
            this.$router.push('/login');
            console.log('登出');
        },
        mounted() {
            if (sessionStorage.getItem('userInfo')) {
            // 从本地sessionStorage获取用户信息
            this.user = JSON.parse(sessionStorage.getItem('userInfo'));
            }
        },
    }
  };
  </script>
  
  <style scoped>
  </style>
  