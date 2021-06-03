<template>
  <div style="display: flex; height: 100%; flex-flow: column nowrap;">
        <div class="row">
      <el-page-header icon="el-icon-arrow-left" title="返回"
                      @back="$router.back()"
                      :content='`微服务：${inside_name}`'/>
    </div>
    <div style="flex:1; overflow: hidden">
    <el-scrollbar>
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
          <el-affix :offset="75">
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
          </el-affix>
        </template>
        <el-descriptions-item label="微服务编号" :span="3">
          {{ this.inside_id }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
      
        <path-detail class="row" :roleList="tabel_first" :msId="inside_id" 
                     @fetch="fetchData"
                     @roleAdd="handleNewRole"
                     @roleDel="callRoleDel"
                     @roleNameChange="callRoleNameChange"
                     @roleEdit="handleRoleEdit"
        />
        <signup-detail class="row" :roleList="tabel_first" :msId="inside_id" @fetch="fetchData"/>
        <user-detail class="row" :roleList="tabel_first" :msId="inside_id" @fetch="fetchData" />
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import {
  getMSNameByID,
  getRoleByID,
  msNameChange,
  msDel,
  roleNameChange,
  roleDel,
  roleAdd,
} from "@/util/connector";
import PathDetail from './PathDetail.vue';
import SignupDetail from './SignupDetail.vue';
import UserDetail from './UserDetail.vue';

export default {
  components: { PathDetail, SignupDetail, UserDetail },
  name: "MSDetail",
  data() {
    return {
      inside_id: "",
      inside_name: "",
      inside_backup_name: "",
      edit: false,
      msLoading: true,
      roleLoading: true,
      tabel_first: [],
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
        this.msLoading = true;
        this.roleLoading = true;
        getMSNameByID(
          this.inside_id,
          (data) => {
            this.inside_name = data;
            this.msLoading = false;
          },
          (msg) => this.handleError(msg)
        );
        getRoleByID(this.inside_id,
          (data) => {
            this.tabel_first = data;
            this.roleLoading = false;
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
          this.fetchData()
          this.handleSuccess(msg);
        },
        (msg) => this.handleError(msg)
      );
    },
    handleRoleEdit(role) {
      role.backup_name = role.name;
      role.edit = true;
    },
    callRoleNameChange(role, name) {
      console.info(role, name)
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
            this.fetchData()
          },
          (msg) => this.handleError(msg)
        );
      }
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

.subheader_text {
  color: #303133;
  font-size: 16px;
}
</style>