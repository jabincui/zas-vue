<template>
  <el-card shadow="hover" v-loading="loading">
    <template #header>
      <div class="subheader_text">
        <span>注册-角色权限管理</span>
      </div>
    </template>
    <el-table :data="tabel_second" style="width: 100%">
      <el-table-column label=" ">
        <template #default="scope">
          <el-space :size="4">
            <span v-if="!scope.row.name.edit">
              <el-tooltip effect="light" placement="right">
                <template #content>
                  signupID: {{ scope.row.name.id }}
                </template>
                <span>
                  {{ scope.row.name.name }}
                </span>
              </el-tooltip>
            </span>
            <el-input
              v-if="scope.row.name.edit"
              v-model="scope.row.name.name"
              size="mini"
            />
            <el-button
              v-if="!scope.row.name.edit"
              @click="handleSignupEdit(scope.row.name)"
              type="text"
              size="mini"
              icon="el-icon-edit"
              plain
              circle
            ></el-button>
            <el-button
              v-if="scope.row.name.edit"
              @click="callSignupNameChange(scope.row.name, scope.row.name.name)"
              type="success"
              size="mini"
              icon="el-icon-check"
              plain
              circle
            ></el-button>
            <el-button
              v-if="scope.row.name.edit"
              @click="fetchTable"
              type="info"
              size="mini"
              icon="el-icon-close"
              plain
              circle
            ></el-button>
            <el-button
              v-if="
                scope.row.name.id === undefined ? false : scope.row.name.edit
              "
              @click="callSignupDel(scope.row.name)"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              plain
              circle
            ></el-button>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column v-for="role in table_first" :key="role.id">
        <template #header>
          {{ role.name }}
        </template>
        <template #default="scope">
          <el-switch
            v-if="scope.row[role.id]"
            v-model="scope.row[role.id].value"
            @change="
              (value) =>
                handleSignupRoleChange(scope.row.name.id, role.id, value)
            "
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="right" width="150"> </el-table-column>
    </el-table>
    <el-button
      @click="handleNewSignup"
      style="margin-top: 8px"
      icon="el-icon-plus"
      round
    >
      添加新注册入口
    </el-button>
  </el-card>
</template>

<script>
import {
  getRoleSignupTable,
  signupRoleAdd,
  signupRoleDel,
  signupNameChange,
  signupAdd,
  signupDel,
} from "@/util/connector";

export default {
  name: "SignupDetail",
  emits: ["fetch"],
  props: {
    roleList: Array,
    msId: String,
  },
  data() {
    return {
      open: true,
      loading: true,
      table_first: [],
      tabel_second: [],
    };
  },
  created() {
    this.$watch(
      () => this.roleList,
      (toParams, previousParams) => {
        if (toParams !== previousParams) {
          this.table_first = [...this.roleList];
          this.fetchTable();
        }
      },
      { immediate: true }
    );
  },
  mounted() {
    this.table_first = this.roleList;
    this.fetchTable();
  },
  methods: {
    fetchTable() {
      this.loading = true;
      if (this.table_first) {
        getRoleSignupTable(
          this.table_first,
          (data) => {
            this.tabel_second = data;
            this.loading = false;
          },
          (msg) => this.handleError(msg)
        );
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
    handleNewSignup() {
      this.tabel_second.push({ name: { name: "", edit: true } });
    },
    handleSignupRoleChange(signupId, roleId, value) {
      console.debug(signupId, roleId, value);
      if (value) {
        signupRoleAdd(signupId, roleId, (msg) => {
          this.handleError(msg);
        });
      } else {
        signupRoleDel(signupId, roleId, (msg) => {
          this.handleError(msg);
        });
      }
    },
    handleSignupEdit(signup) {
      signup.backup_name = signup.name;
      signup.edit = true;
    },
    callSignupNameChange(signup, name) {
      if (signup.id) {
        if (signup.backup_name === name) {
          signup.edit = false;
        } else {
          signupNameChange(
            signup.id,
            name,
            (msg) => {
              signup.edit = false;
              this.handleSuccess(msg);
            },
            (msg) => this.handleError(msg)
          );
        }
      } else {
        signupAdd(
          name,
          (msg) => {
            signup.edit = false;
            this.handleSuccess(msg);
            this.fetchTable();
          },
          (msg) => this.handleError(msg)
        );
      }
    },
    callSignupDel(signup) {
      signupDel(
        signup.id,
        signup.name,
        (msg) => {
          signup.edit = false;
          this.tabel_second.splice(
            this.tabel_second.findIndex((item) => item.name.id === signup.id),
            1
          );
          this.$emit("fetch");
          this.handleSuccess(msg);
        },
        (msg) => this.handleError(msg)
      );
    },
  },
};
</script>

<style>
</style>