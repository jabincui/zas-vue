<template>
  <div style="display: flex; height: 100%; flex-flow: column nowrap">
    <el-card shadow="hover" class="row">
      <el-descriptions :column="3">
        <template #title>
          <div v-if="!edit" class="header_text" style="font-weight: normal">
            {{ inside_name }}
          </div>
          <el-input
            v-if="edit"
            v-model="inside_name"
            class="header_text"
            style="width: 60vh; font-weight: normal"
            placeholder="微服务标题"
          >
          </el-input>
        </template>
        <template #extra>
          <el-space>
            <el-button
              type="primary"
              size="small"
              @click="handleSave"
              v-if="edit"
              >保存
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="toggleEdit"
              plain
              v-if="!edit"
              >编辑名称
            </el-button>
            <el-button type="info" size="small" @click="toggleEdit" v-if="edit"
              >取消
            </el-button>
            <el-button type="danger" size="small" @click="handleDel" plain
              >删除</el-button
            >
          </el-space>
        </template>
        <el-descriptions-item label="微服务编号" :span="3">
          {{ this.inside_id }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <div style="flex: 1; overflow: hidden" v-loading="loading">
      <el-scrollbar>
        <el-card shadow="hover">
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
                    @click="fetchData"
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
            <el-table-column v-for="role in tabel_first" :key="role.id">
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
                    @click="handleRoleEdit(role)"
                    type="text"
                    size="mini"
                    icon="el-icon-edit"
                    plain
                    circle
                  ></el-button>
                  <el-button
                    v-if="role.edit === 'disable' ? false : role.edit"
                    @click="callRoleNameChange(role, role.name)"
                    type="success"
                    size="mini"
                    icon="el-icon-check"
                    plain
                    circle
                  ></el-button>
                  <el-button
                    v-if="role.edit === 'disable' ? false : role.edit"
                    @click="fetchData"
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
                    @click="callRoleDel(role)"
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
            <el-table-column align="right">
              <template #header>
                <el-button @click="handleNewRole" icon="el-icon-plus" round>
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
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import {
  getMSNameByID,
  getRoleURLTable,
  roleNameChange,
  roleDel,
  roleAdd,
  urlNameChange,
  urlDel,
  urlAdd,
  authAdd,
  authDel,
  msNameChange,
  msDel,
} from "@/util/connector";

export default {
  name: "MSDetail",
  data() {
    return {
      inside_id: "",
      inside_name: "",
      inside_backup_name: "",
      edit: false,
      loading: true,
      tabel_first: [],
      tabel_second: [],
    };
  },
  created() {
    this.$watch(
      () => this.$route.params.id,
      (toParams, previousParams) => {
        if (toParams !== previousParams) {
          this.fetchData();
        }
      },
      { immediate: true }
    );
  },
  methods: {
    fetchData() {
      if (this.$route.params.id) {
        this.inside_id = this.$route.params.id;
        this.loading = true;
        getMSNameByID(
          this.inside_id,
          (data) => {
            this.inside_name = data;
          },
          (msg) => this.handleError(msg)
        );
        getRoleURLTable(
          this.inside_id,
          (data) => {
            this.tabel_first = data.first;
            this.tabel_second = data.second;
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
    toggleEdit() {
      if (this.edit) {
        if (this.$route.params.id !== undefined) {
          this.fetchData();
        }
      } else {
        this.inside_backup_name = this.inside_name;
      }
      this.edit = !this.edit;
    },
    handleSave() {
      if (this.inside_backup_name === this.inside_name) {
        this.edit = false;
      } else {
        msNameChange(
          this.inside_id,
          this.inside_name,
          (msg) => {
            this.edit = false;
            this.handleSuccess(msg);
          },
          (msg) => this.handleError(msg)
        );
      }
    },
    handleDel() {
      msDel(
        this.inside_id,
        this.inside_name,
        (msg) => {
          this.handleSuccess(msg);
          this.$router.back();
        },
        (msg) => this.handleError(msg)
      );
    },
    handleNewRole() {
      this.tabel_first.push({ name: "", edit: true });
    },
    handleNewUrl() {
      this.tabel_second.push({ name: { path: "", edit: true } });
    },
    handleAuthChange(auth, value) {
      console.debug(auth, value);
      if (value) {
        authAdd(
          this.inside_id,
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
    handleRoleEdit(role) {
      role.backup_name = role.name;
      role.edit = true;
    },
    callRoleNameChange(role, name) {
      if (role.id) {
        if (role.backup_name === name) {
          role.edit = false;
        } else {
          roleNameChange(
            role.id,
            name,
            (msg) => {
              role.edit = false;
              this.handleSuccess(msg);
            },
            (msg) => this.handleError(msg)
          );
        }
      } else {
        roleAdd(
          this.inside_id,
          name,
          (msg) => {
            role.edit = false;
            this.handleSuccess(msg);
            this.fetchData();
          },
          (msg) => this.handleError(msg)
        );
      }
    },
    callRoleDel(role) {
      roleDel(
        role.id,
        role.name,
        (msg) => {
          role.edit = false;
          this.tabel_first.splice(
            this.tabel_first.findIndex((item) => item.id === role.id),
            1
          );
          this.fetchData();
          this.handleSuccess(msg);
        },
        (msg) => this.handleError(msg)
      );
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
          this.inside_id,
          path,
          (msg) => {
            url.edit = false;
            this.handleSuccess(msg);
            this.fetchData();
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
          this.fetchData();
          this.handleSuccess(msg);
        },
        (msg) => this.handleError(msg)
      );
    },
  },
};
</script>

<style>
.row {
  margin-bottom: 16px;
}

.main_text {
  color: #303133;
  font-size: 14px;
}

.header_text {
  color: #303133;
  font-size: 18px;
}
</style>