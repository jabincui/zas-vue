<template>
    <el-card shadow="hover" v-loading="loading">
      <template #header>
        <div class="subheader_text">
          <span>路径-角色权限管理</span>
        </div>
      </template>
          <el-table :data="tabel_second" style="width: 100%">
            <el-table-column label=" ">
              <template #default="scope">
                <el-space :size="4">
                  <span v-if="!scope.row.name.edit">{{
                    scope.row.name.path
                  }}</span>
                  <el-input
                    v-if="scope.row.name.edit"
                    v-model="scope.row.name.path"
                    size="mini"
                  />
                  <el-button
                    v-if="!scope.row.name.edit"
                    @click="handleUrlEdit(scope.row.name)"
                    type="text"
                    size="mini"
                    icon="el-icon-edit"
                    plain
                    circle
                  ></el-button>
                  <el-button
                    v-if="scope.row.name.edit"
                    @click="
                      callUrlNameChange(scope.row.name, scope.row.name.path)
                    "
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
                      scope.row.name.id === undefined
                        ? false
                        : scope.row.name.edit
                    "
                    @click="callUrlDel(scope.row.name)"
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
                <el-space :size="4">
                  <span v-if="role.edit === 'disable' ? true : !role.edit">{{
                    role.name
                  }}</span>
                  <el-input
                    v-if="role.edit === 'disable' ? false : role.edit"
                    v-model="role.name"
                    size="mini"
                  />
                  <el-button
                    v-if="role.edit === 'disable' ? false : !role.edit"
                    @click="$emit('roleEdit', role)"
                    type="text"
                    size="mini"
                    icon="el-icon-edit"
                    plain
                    circle
                  ></el-button>
                  <el-button
                    v-if="role.edit === 'disable' ? false : role.edit"
                    @click="$emit('roleNameChange', role, role.name)"
                    type="success"
                    size="mini"
                    icon="el-icon-check"
                    plain
                    circle
                  ></el-button>
                  <el-button
                    v-if="role.edit === 'disable' ? false : role.edit"
                    @click="$emit('fetch')"
                    type="info"
                    size="mini"
                    icon="el-icon-close"
                    plain
                    circle
                  ></el-button>
                  <el-button
                    v-if="
                      role.edit === 'disable' || role.id === undefined
                        ? false
                        : role.edit
                    "
                    @click="$emit('roleDel', role)"
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    plain
                    circle
                  ></el-button>
                </el-space>
              </template>
              <template #default="scope">
                <el-switch
                  v-if="scope.row[role.id]"
                  v-model="scope.row[role.id].value"
                  @change="
                    (value) => handleAuthChange(scope.row[role.id], value)
                  "
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column align="right" width="150">
              <template #header>
                <el-button @click="handleRoleAdd" icon="el-icon-plus" round>
                  添加新角色
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            @click="handleNewUrl"
            style="margin-top: 8px"
            icon="el-icon-plus"
            round
          >
            添加新路径
          </el-button>
    </el-card>
</template>

<script>
import {
  urlNameChange,
  urlDel,
  urlAdd,
  authAdd,
  authDel,
  getRoleURLTable
} from "@/util/connector";

export default {
  name: "PathDetail",
  emits: ['fetch', 'roleAdd', 'roleDel', 'roleNameChange', 'roleEdit'],
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
        getRoleURLTable(this.msId, this.table_first,
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
    handleRoleAdd() {
      this.$emit('roleAdd');
      this.table_first = [...this.roleList]
    },
    handleNewUrl() {
      this.tabel_second.push({ name: { path: "", edit: true } });
    },
    handleAuthChange(auth, value) {
      console.debug(auth, value);
      if (value) {
        authAdd(
          this.msId,
          auth.auth.urlId,
          auth.auth.roleId,
          (authId) => {
            auth.auth.id = authId;
          },
          (msg) => {
            this.handleError(msg);
            auth.value = false;
          }
        );
      } else {
        authDel(auth.auth.id, (msg) => this.handleError(msg));
      }
    },
    handleUrlEdit(url) {
      url.backup_name = url.path;
      url.edit = true;
    },
    callUrlNameChange(url, path) {
      if (url.id) {
        if (url.backup_name === path) {
          url.edit = false;
        } else {
          urlNameChange(
            url.id,
            path,
            (msg) => {
              url.edit = false;
              this.handleSuccess(msg);
            },
            (msg) => this.handleError(msg)
          );
        }
      } else {
        urlAdd(
          this.msId,
          path,
          (msg) => {
            url.edit = false;
            this.handleSuccess(msg);
            this.fetchTable();
          },
          (msg) => this.handleError(msg)
        );
      }
    },
    callUrlDel(url) {
      urlDel(
        url.id,
        url.path,
        (msg) => {
          url.edit = false;
          this.tabel_second.splice(
            this.tabel_second.findIndex((item) => item.name.id === url.id),
            1
          );
          this.$emit('fetch');
          this.handleSuccess(msg);
        },
        (msg) => this.handleError(msg)
      );
    },
  }
};
</script>

<style>
</style>