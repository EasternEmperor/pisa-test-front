<template>
    <el-header>
      <div style="float: right;">
        <span>欢迎 {{ userName }}</span>
        <el-button @click="logout" type="text">登出</el-button>
      </div>
    </el-header>
  </template>
  
  <script>

  export default {
    data() {
      return {
        userName : "",
      };
    },
    methods: {
      logout() {
        this.axios.post('/api/user/logout')
          .then(response => {
            if (response.data.code === "0") {
              // 清理用户信息
              sessionStorage.removeItem('userInfo');
              // 重定向到登录页面
              this.$router.push('/login');
              this.$message.success('成功登出');
            } else {
              this.$message.error('登出失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('登出失败');
          });
      }
    },
    mounted() {
        if (sessionStorage.getItem('userInfo')) {
            // 将用户信息存储到sessionStorage中
            this.userName = JSON.parse(sessionStorage.getItem('userInfo')).userName;
        }
    },
  };
  </script>
  
  <style scoped>
  .header {
    background-color: #409EFF;
    color: white;
    text-align: right;
    padding-right: 20px;
  }
  .header-content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
  }
  .header-content span {
    margin-right: 20px;
  }
  </style>
  