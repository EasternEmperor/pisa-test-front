<template>
    <div>
      <!-- 表格顶部的操作按钮行 -->
      <el-row :justify="'end'" :gutter="20" class="action-row">
        <el-col>
          <el-button v-if="!isEditing" type="primary" @click="startEditing">批量修改</el-button>
          <el-button v-if="isEditing" type="danger" @click="confirmEdit">确认</el-button>
        </el-col>
      </el-row>
  
      <!-- 表格展示 -->
      <el-table :data="displayData" style="width: 100%">
        <el-table-column prop="no" label="题号">
          <template slot-scope="scope">
            <el-input v-if="isEditing" v-model="scope.row.no"></el-input>
            <span v-else>{{ scope.row.no }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="htmlName" label="题目名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteQuestion(scope.row)" :disabled="isEditing">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页组件 -->
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :total="totalItems"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        :current-page.sync="currentPage"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        questions: [],
        displayData: [],
        totalItems: 0,
        pageSize: 10,
        currentPage: 1,
        isEditing: false,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.totalItems / this.pageSize);
      }
    },
    created() {
      this.fetchQuestions();
    },
    methods: {
      getDisplayData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + Math.min(this.totalItems - start + 1, this.pageSize);
        return this.questions.slice(start, end);
      },
      fetchQuestions() {
        this.currentPage = 1;
        this.axios.get('/api/questionBank/getAllQuestions')
          .then(response => {
            if (response.data.code === '0') {
              this.questions = response.data.data;
              this.sortQuestions();
              this.totalItems = response.data.total || this.questions.length;
              this.displayData = this.getDisplayData();
            } else {
              this.$message.error(response.data.message || '获取问题列表失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('获取问题列表失败');
          });
      },
      sortQuestions() {
        this.questions.sort((a, b) => {
          if (a.no === -1) return 1; // 将 no 为 -1 的项放在最后
          if (b.no === -1) return -1; 
          return a.no - b.no; // 按 no 升序排序
        });
      },
      startEditing() {
        this.isEditing = true;
      },
      confirmEdit() {
        this.axios.post('/api/questionBank/modifyQuestionNo', this.questions)
          .then(response => {
            if (response.data.code === '0') {
              this.$message.success('修改成功');
            } else {
              this.$message.error(response.data.message || '修改失败');
            }
            this.isEditing = false;
            this.fetchQuestions(); // 刷新列表
          })
          .catch(error => {
            console.error(error);
            this.$message.error('修改失败');
            this.isEditing = false;
            this.fetchQuestions(); // 刷新列表
          });
      },
      deleteQuestion(question) {
        this.axios.post('/api/questionBank/deleteQuestion', question)
          .then(response => {
            if (response.data.code === '0') {
              this.$message.success('删除成功');
            } else {
              this.$message.error(response.data.message || '删除失败');
            }
            this.fetchQuestions(); // 刷新列表
          })
          .catch(error => {
            console.error(error);
            this.$message.error('删除失败');
            this.fetchQuestions(); // 刷新列表
          });
      },
      handlePageChange(page) {
        this.currentPage = page;
      },
      handleSizeChange(size) {
        this.pageSize = size;
        this.currentPage = 1; // 重置当前页为1
      }
    }
  };
  </script>
  
  <style scoped>
  .action-row {
    margin-bottom: 10px;
    text-align: right;
  }
  .page-info {
    text-align: right;
    margin-top: 10px;
  }
  </style>
  