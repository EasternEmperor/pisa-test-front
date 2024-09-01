<template>
    <div>
    <!-- 筛选器部分 -->
    <el-form :inline="true" label-width="120px">
      <el-row :gutter="20">
        <!-- 用户选择 -->
        <el-col :span="8">
          <el-form-item label="用户选择：" style="width: 100%;">
            <el-select v-model="selectedUser" placeholder="选择用户" style="width: 100%;">
              <el-option
                v-for="user in users"
                :key="user"
                :label="user === '-1' ? '全部' : user"
                :value="user"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 答题次序选择 -->
        <el-col :span="8">
          <el-form-item label="答题次序选择：" style="width: 100%;">
            <el-select v-model="selectedQuestion" placeholder="选择题目ID" style="width: 100%;">
              <el-option
                v-for="question in questions"
                :key="question"
                :label="question === '-1' ? '全部' : question"
                :value="question"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 确认按钮 -->
        <el-col :span="8">
          <el-form-item style="width: 100%; text-align: right;">
            <el-button type="primary" @click="filterData">确认</el-button>
            <el-button type="primary" @click="downloadUserAnswers">导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!--表格展示部分-->
      <el-table :data="displayData">
        <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop" :label="column.label"></el-table-column>
      </el-table>
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
  import moment from 'moment';
  
  export default {
    data() {
      return {
        users: [],
        questions: [],
        selectedUser: '-1',
        selectedQuestion: '-1',
        filteredData: [],
        displayData: [],
        tableColumns: [],
        totalItems: 0,
        pageSize: 10,
        currentPage: 1
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.totalItems / this.pageSize);
      }
    },
    async created() {
      await this.fetchUsers();
      await this.fetchQuestions();
      this.fetchUserAnswers();
    },
    methods: {
      getDisplayData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + Math.min(this.totalItems - start + 1, this.pageSize);
        return this.filteredData.slice(start, end);
      },
      fetchUsers() {
        return this.axios.get('/api/admin/getAllUserName')
          .then(response => {
            if (response.data.code === '0') {
              this.users = response.data.data;
            } else {
              this.$message.error(response.data.message || '获取用户名失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('获取用户名失败');
          });
      },
      fetchQuestions() {
        return this.axios.get('/api/admin/getAllAnswerNo')
          .then(response => {
            if (response.data.code === '0') {
              this.questions = response.data.data;
            } else {
              this.$message.error(response.data.message || '获取答题次序失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('获取答题次序失败');
          });
      },
      fetchUserAnswers() {
        const params = {
          userName: this.selectedUser,
          ith: this.selectedQuestion
        };
        this.axios.post('/api/admin/getUserAnswerList', params)
          .then(response => {
            if (response.data.code === '0') {
              this.filteredData = response.data.data.map(item => ({
                ...item,
                testBegin: moment(item.testBegin).format('YYYY-MM-DD HH:mm:ss'),
                testEnd: moment(item.testEnd).format('YYYY-MM-DD HH:mm:ss')
              }));
              this.totalItems = response.data.data.length;
              this.displayData = this.getDisplayData();
            } else {
              this.$message.error(response.data.message || '获取用户答题信息失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('获取用户答题信息失败');
          });
      },
      downloadUserAnswers() {
        const params = {
          userName: this.selectedUser,
          ith: this.selectedQuestion,
          downloadInfo: {
            headers: this.tableColumns.reduce((acc, column) => {
                      acc[column.label] = column.prop;
                      return acc;
                    }, {}),
            fileName: `用户测验_${moment().format('YYYYMMDDHHmmss')}`,
            fileType: 'xlsx'
          }
        };
        this.axios.post('/api/admin/getUserAnswerList', params,
          { responseType: 'blob' }
        ).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;

          let fileName = "download.xlsx";
          const contentDisposition = response.headers['content-disposition'];
          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
            if (fileNameMatch && fileNameMatch.length === 2) {
              fileName = decodeURIComponent(fileNameMatch[1]); // 解码文件名
            } else {
              const fallbackFileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
              if (fallbackFileNameMatch && fallbackFileNameMatch.length === 2) {
                  fileName = decodeURIComponent(fallbackFileNameMatch[1]); // 解码文件名
              }
            }
          }
          link.setAttribute('download', fileName);

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error(error);
          this.$message.error('获取答题数据失败');
        });
      },
      filterData() {
        this.currentPage = 1;
        this.fetchUserAnswers();
      },
      handlePageChange(page) {
        this.currentPage = page;
      },
      handleSizeChange(size) {
        this.pageSize = size;
        this.currentPage = 1; // 重置当前页为1
      },
      setupTableColumns() {
        this.tableColumns = [
          { prop: 'id', label: 'ID' },
          { prop: 'userName', label: '用户名' },
          { prop: 'ithAnswer', label: '答题次序' },
          { prop: 'testBegin', label: '测试开始时间' },
          { prop: 'testEnd', label: '测试结束时间' }
        ];
      }
    },
    mounted() {
      this.setupTableColumns();
    }
  };
  </script>
  
  <style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  </style>
  