<template>
    <div class="finish-test-container">
      <p class="message">你已完成所有试题，点击确定返回主页。</p>
      <el-button type="primary" @click="goHome">确定</el-button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      finishTest() {
        const data = {
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          ithAnswer: sessionStorage.getItem('ithAnswer'),
          testBegin: sessionStorage.getItem('testBegin'),
          testEnd: new Date().toISOString(),
        };
        this.axios.post('/api/test/finishTest', data)
            .then(response => {
            if (response.data.code === '0') {
                // 显示后端响应的成功信息
                this.$message({
                    message: res.data.message,
                    type: "success",
                });
            } else {
                // 显示后端响应的失败信息
                this.$message({
                    message: res.data.message,
                    type: "warning",
                });
            }
          })
          .catch(error => {
            console.error('刚才的操作失效，请重新操作！', error);
          });
      },
      goHome() {
        this.finishTest();
        this.$router.push('/user');
      }
    }
  }
  </script>
  
  <style scoped>
  .finish-test-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* 使容器高度填满整个视窗 */
    text-align: center;
  }
  
  .message {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  .el-button {
    width: 120px;
  }
  </style>
  