
<template>
  <div>
    <el-card class="box-card">
      <h2>登录</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="70px"
        class="login-form"
      >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName"></el-input>
      </el-form-item>

      <div style="font-size: 12px; color: #606266; text-align: left;">
          注：用户名填写姓名拼音+出生日期。如：wangxiaoming19700101 <br/>
          <br/>
      </div>

      </el-form>
      <div class="btnGroup">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          v-loading="loading"
          >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        userName: "",
      },
      rules: {
        userName: [
          { required: true, message: "用户名不能为空！", trigger: "blur" },
        ],
      },
      loading: false, // 是否显示加载动画
    };
  },
  methods: {
    checkSession() {
      if (sessionStorage.getItem('userInfo') != null) {
        const role = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).role);
        if (role === 0) {
          this.$router.push('/user');
          } else if (res.data.data.role === 1) {
            this.$router.push('/admin');
          } else {
            this.$router.push('/home');
          }
      }
    },
    submitForm(formName) {
      // 验证表单中的用户名是否有效，因为在上面rules中定义为了必填 required: true
      this.$refs[formName].validate((valid) => {
        // 点击登录后，让登录按钮开始转圈圈（展示加载动画）
        this.loading = true;
        // 如果经过校验，用户名不为空，则发送请求到后端登录接口
        if (valid) {
          let _this = this;
          // 使用 axios 将登录信息发送到后端
          this.axios({
            url: "/api/user/login",               // 请求地址
            method: "post",                       // 请求方法
            headers: {                            // 请求头
              "Content-Type": "application/json",
            },
            params: {                             // 请求参数
              userName: _this.ruleForm.userName,
            },
          }).then((res) => { // 当收到后端的响应时执行该括号内的代码，res 为响应信息，也就是后端返回的信息
            if (res.data.code === "0") {  // 当响应的编码为 0 时，说明登录成功
              // 将用户信息存储到sessionStorage中
              sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
              // 根据用户身份跳转页面到首页
              if (res.data.data.role === 0) {
                this.$router.push('/user');
              } else if (res.data.data.role === 1) {
                this.$router.push('/admin');
              } else {
                this.$router.push('/home');
              }
              // 显示后端响应的成功信息
              this.$message({
                message: res.data.message,
                type: "success",
              });
            } else {  // 当响应的编码不为 0 时，说明登录失败
              // 显示后端响应的失败信息
              this.$message({
                message: res.data.message,
                type: "warning",
              });
            }
            // 不管响应成功还是失败，收到后端响应的消息后就不再让登录按钮显示加载动画了
            _this.loading = false;
            console.log(res);
          });
        } else {  // 如果用户名没有填，就直接提示必填，不向后端请求
          console.log("error submit!!");
          this.loading = false;
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  mounted() {
    this.checkSession();
  }
};
</script>

<style scoped>
/* 设置登录面板居中，宽度为400px */
.box-card {
  margin: auto auto;
  width: 400px;
}
/* 设置登录面板中的表单居中 */
.login-form {
  margin: auto auto;
}
</style>
