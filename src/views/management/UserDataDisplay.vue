<template>
    <div>
      <!-- 筛选器部分 -->
    <el-form :inline="true" label-width="120px">
        <el-row :gutter="20">
            <el-col :span="8">
            <el-form-item label="问题选择：" style="width: 100%;">
                <el-select v-model="selectedHtmlName" placeholder="选择题目" style="width: 100%;">
                <el-option
                    v-for="htmlName in questionNames"
                    :key="htmlName"
                    :label="htmlName"
                    :value="htmlName"
                ></el-option>
                </el-select>
            </el-form-item>
            </el-col>
        </el-row>

      <!-- 用户选择、答题次序选择、确认按钮在一行 -->
      <el-row :gutter="20" style="margin-top: 10px;">
        <el-col :span="8">
          <el-form-item label="用户选择：" style="width: 100%;">
            <el-select v-model="selectedUserName" placeholder="选择用户" style="width: 100%;">
              <el-option
                v-for="user in userNames"
                :key="user"
                :label="user === '-1' ? '全部' : user"
                :value="user"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="答题次序选择：" style="width: 100%;">
            <el-select v-model="selectedIthAnswer" placeholder="选择答题次序" style="width: 100%;">
              <el-option
                v-for="ith in ithAnswers"
                :key="ith"
                :label="ith === '-1' ? '全部' : ith"
                :value="ith"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="width: 100%; text-align: right;">
            <el-button type="primary" @click="fetchAnswerData">确认</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  
      <!-- 表格展示部分 -->
      <el-table :data="answerData" style="width: 100%; margin-top: 20px;">
        <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop" :label="column.label"></el-table-column>
      </el-table>
  
      <!-- 分页和数据条数信息 -->
      <el-row style="margin-top: 20px;" type="flex" justify="space-between" align="middle">
        <el-col>
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
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import moment from 'moment';
  
  export default {
    data() {
      return {
        questionNames: [],
        userNames: [],
        ithAnswers: [],
        selectedHtmlName: '',
        selectedUserName: '全部',
        selectedIthAnswer: '全部',
        answerData: [],
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
      await this.fetchQuestionNames();
      await this.fetchUserNames();
      await this.fetchIthAnswers();
      this.fetchAnswerData();
    },
    methods: {
      fetchQuestionNames() {
        return this.axios.get('/api/questionBank/getAllQuestionName')
          .then(response => {
            if (response.data.code === '0') {
              this.questionNames = response.data.data;
              this.selectedHtmlName = this.questionNames[0]; // 默认值为第一个题目
            } else {
              this.$message.error(response.data.message || '获取题目名称失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('获取题目名称失败');
          });
      },
      fetchUserNames() {
        return this.axios.get('/api/admin/getAllUserName')
          .then(response => {
            if (response.data.code === '0') {
              this.userNames = response.data.data.map(user => (user === '-1' ? '全部' : user));
              this.selectedUserName = '全部'; // 默认值为全部
            } else {
              this.$message.error(response.data.message || '获取用户名失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('获取用户名失败');
          });
      },
      fetchIthAnswers() {
        return this.axios.get('/api/admin/getAllAnswerNo')
          .then(response => {
            if (response.data.code === '0') {
              this.ithAnswers = response.data.data.map(ith => (ith === '-1' ? '全部' : ith));
              this.selectedIthAnswer = '全部'; // 默认值为全部
            } else {
              this.$message.error(response.data.message || '获取答题次序失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('获取答题次序失败');
          });
      },
      fetchAnswerData() {
        const params = {
          htmlName: this.selectedHtmlName,
          userName: this.selectedUserName === '全部' ? '-1' : this.selectedUserName,
          ithAnswer: this.selectedIthAnswer === '全部' ? '-1' : this.selectedIthAnswer,
          page: this.currentPage,
          size: this.pageSize
        };
        this.axios.get('/api/answerData/getAnswerData', { params })
        .then(response => {
          if (response.data.code === '0') {
            this.answerData = response.data.data.map(item => ({
              ...item,
              eventStartTime: moment(item.eventStartTime).format('YYYY-MM-DD HH:mm:ss')
            }));
            this.totalItems = response.data.total || this.answerData.length;
            this.setupTableColumns(this.answerData[0]?.tableName);
          } else {
            this.$message.error(response.data.message || '获取答题数据失败');
          }
        })
        .catch(error => {
          console.error(error);
          this.$message.error('获取答题数据失败');
        });
      },
      setupTableColumns(tableName) {
        if (tableName === 1) {
          this.tableColumns = [
            { label: '问题名称', prop: 'htmlName' },
            { label: '用户名', prop: 'userName' },
            { label: '答题次序', prop: 'ithAnswer' },
            { label: '操作事件', prop: 'event' },
            { label: '事件类型', prop: 'eventType' },
            { label: '事件开始时间', prop: 'eventStartTime' },
            { label: '事件顺序', prop: 'eventNumber' },
            { label: 'top control设置', prop: 'topSetting' },
            { label: 'central control设置', prop: 'centralSetting' },
            { label: 'bottom control设置', prop: 'bottomSetting' },
            { label: '温度', prop: 'tempValue' },
            { label: '湿度', prop: 'humidValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 2) {
          this.tableColumns = [
            { label: '问题名称', prop: 'htmlName' },
            { label: '用户名', prop: 'userName' },
            { label: '答题次序', prop: 'ithAnswer' },
            { label: '操作事件', prop: 'event' },
            { label: '事件类型', prop: 'eventType' },
            { label: '事件开始时间', prop: 'eventStartTime' },
            { label: '事件顺序', prop: 'eventNumber' },
            { label: '交通网络', prop: 'network' },
            { label: '优惠类型', prop: 'fareType' },
            { label: '票种', prop: 'ticketType' },
            { label: '乘车次数', prop: 'numberTrips' }
          ];
        }
      },
      handlePageChange(page) {
        this.currentPage = page;
        this.fetchAnswerData();
      },
      handleSizeChange(size) {
        this.pageSize = size;
        this.currentPage = 1; // 重置当前页为1
        this.fetchAnswerData();
      }
    }
  };
  </script>
  
  <style scoped>
  .el-row {
    margin-bottom: 10px;
  }
  </style>
  