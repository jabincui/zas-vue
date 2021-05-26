<template>
  <el-container style="height: 100vh">
    <el-header>ZAS微服务管理系统</el-header>
    <el-main>
      <el-card header="用户登录" class="login-card">
        <el-form>
          <el-form-item label="用户名">
            <el-input v-model="model.username"> </el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="model.password"> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
    <el-footer> 北京邮电大学电子工程学院通信与网络研究中心（2021） </el-footer>
  </el-container>
</template>

<script>
import { userLogin } from "@/util/connector.js";

export default {
  name: "Login",
  data() {
    return {
      model: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      userLogin(
        this.username,
        this.password,
        (msg, token) => {
          this.$message({
            type: "success",
            message: msg,
          });
          localStorage.token = token;
          this.$router.push("/");
        },
        (msg) => {
          this.$message({
            message: msg,
            type: "error",
            duration: 10000,
          });
        }
      );
      console.info("login");
    },
  },
};
</script>

<style>
.el-footer {
  text-align: center;
}

.el-header {
  font-size: 20px;
}

.el-main {
  background-color: rgb(245, 248, 251);
  padding-bottom: 0;
  overflow: hidden;
}

.login-card {
  width: 25rem;
  margin: 5rem auto;
}
</style>
