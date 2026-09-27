<template>
  <div>
    <h2>欢迎{{ user.userName }}</h2>
    <el-button @click="logout"> 登出 </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        userName: "",
        id: null,
        role: "",
      },
    };
  },
  methods: {
    logout(){
      // 移除本地用户登录信息
      localStorage.removeItem('userInfo');
      // 跳转页面到登录页
      this.$router.push('/login');
    }
  },
  mounted() {
    if (localStorage.getItem('userInfo')) {
      // 将用户信息存储到localStorage中
      this.user = JSON.parse(localStorage.getItem('userInfo'));
    }
  },
};
</script>

<style scoped>
</style>