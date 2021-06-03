<template>
  <el-card shadow="hover" v-loading="loading">
    <template #header>
      <div class="subheader_text">
        <span>用户-角色权限管理</span>
      </div>
    </template>
        <el-table :data="tabel_second" style="width: 100%">
          <el-table-column label=" ">
            <template #default="scope">
                <span>{{
                  scope.row.name.name
                }}</span>
            </template>
          </el-table-column>
          <el-table-column v-for="role in table_first" :key="role.id">
            <template #header>
                {{role.name}}
            </template>
            <template #default="scope">
              <el-switch
                v-if="scope.row[role.id]"
                v-model="scope.row[role.id].value"
                @change="(value) => handleUserRoleChange(scope.row[role.id], value)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="right" width="150">
          </el-table-column>
        </el-table>
  </el-card>
</template>

<script>
import {
  getRoleUserTable, 
  userRoleAdd,
  userRoleDel,
} from "@/util/connector";

export default {
  name: "UserDetail",
  emits: ['fetch'],
  props: {
    roleList: Array,
    msId: String,
  },
  data(){
    return {
      open: true,
      loading: true,
      table_first: [],
      tabel_second: [],
    }
  },
  created() {
    this.$watch(
      () => this.roleList,
      (toParams, previousParams) => {
        if (toParams !== previousParams) {
          this.table_first = [...this.roleList]
          this.fetchTable()
        }
      },
      { immediate: true }
    );
  },
  mounted(){
    this.table_first = this.roleList;
    this.fetchTable()
  },
  methods: {
    fetchTable(){
      this.loading = true;
      if(this.table_first){
        getRoleUserTable(this.table_first,
          (data) => {
            this.tabel_second = data;
            this.loading = false;
          },
          (msg) => this.handleError(msg)
        )
      }
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
        type: "success",
        duration: 3000,
      });
    },
    handleUserRoleChange(auth, value) {
      console.debug(auth, value);
      if (value) {
        userRoleAdd(
          auth.auth.userId,
          auth.auth.roleId,
          (userRoleId) => {
            auth.auth.id = userRoleId;
          },
          (msg) => {
            this.handleError(msg);
          }
        );
      } else {
        userRoleDel(
          auth.auth.id,
          (msg) => {
            this.handleError(msg);
          }
        );
      }
    },
  }
};
</script>

<style>
</style>