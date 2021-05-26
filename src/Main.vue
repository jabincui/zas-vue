<template>
  <el-container style="height: 100vh">
    <el-header>ZAS微服务管理系统</el-header>
    <el-container>
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu
            unique-opened
            router
            :default-active="msID"
            v-loading="msLoading"
          >
            <el-menu-item
              v-for="ms in msList"
              :key="ms.id"
              :disabled="ms.name === 'ZASGateway'"
              :index="`/ms/${ms.id}`"
            >
              {{ ms.name }}
            </el-menu-item>
            <el-menu-item index='' @click="handleNew">添加新服务</el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-main>
          <transition name="el-fade-in-linear">
            <router-view />
          </transition>
        </el-main>
        <el-footer>
          北京邮电大学电子工程学院通信与网络研究中心（2021）
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { getAllMicroservice, msAdd } from "@/util/connector.js";

export default {
  name: "Main",
  data() {
    return {
      msLoading: true,
      msList: [],
      msID: '',
    };
  },
  methods: {
    reloadMicroservice() {
      this.msLoading = true;
      getAllMicroservice((data) => {
        this.msList = data;
        this.msLoading = false;
      });
    },
    handleError(msg) {
      this.$message({
        message: msg,
        type: "error",
        duration: 10000,
      });
    },
    handleSuccess(msg) {
      this.$message({
        message: msg,
        type: 'success',
        duration: 3000,
      });
    },
    handleNew() {
      this.$prompt('请输入微服务名称', '新建微服务', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          msAdd(value, 
            (msg, id) => {
              this.handleSuccess(msg)
              this.reloadMicroservice()
              this.$router.push(`/ms/${id}`)
            },
            (msg) => this.handleError(msg)
          )
        })
    }
  },
  mounted() {
    this.reloadMicroservice();
  },
};
</script>

<style>
#app {
  -moz-osx-font-smoothing: grayscale;
}

html,
body {
  margin: 0;
  padding: 0;
}

.el-header,
.el-footer {
  background-color: #003399;
  color: rgb(255, 253, 253);
  line-height: 60px;
}

.el-footer {
  text-align: center;
}

.el-header {
  font-size: 20px;
}

.el-aside {
  color: #333;
  background-color: rgb(238, 241, 246);
}

.el-main {
  background-color: rgb(245, 248, 251);
  padding-bottom: 0;
  overflow: hidden;
}
</style>
