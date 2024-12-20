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
            <el-button type="primary" @click="downloadAnswerData">导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  
      <!-- 表格展示部分 -->
      <el-table :data="displayData" style="width: 100%; margin-top: 20px;">
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
      await this.fetchQuestionNames();
      await this.fetchUserNames();
      await this.fetchIthAnswers('-1');
      this.fetchAnswerData();
    },
    watch: {
      // 监听题目名称变化，重新获取答题数据
      selectedHtmlName: {
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.fetchUserNames();
          }
        }
      },
      // 监听用户名称变化，重新获取答题数据
      selectedUserName: {
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.fetchIthAnswers(this.selectedUserName == '全部' ? '-1' : this.selectedUserName);
          }
        }
      },
    },
    methods: {
      getDisplayData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + Math.min(this.totalItems - start + 1, this.pageSize);
        this.displayData = this.answerData.slice(start, end);
      },
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
      fetchIthAnswers(userName) {
        return this.axios.get('/api/admin/getAllAnswerNo', {params: { userName: userName }})
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
        this.currentPage = 1;
        const answerDataQuery = {
          htmlName: this.selectedHtmlName,
          userName: this.selectedUserName === '全部' ? '-1' : this.selectedUserName,
          ithAnswer: this.selectedIthAnswer === '全部' ? '-1' : this.selectedIthAnswer,
          downloadInfo: null
        };
        this.axios.post('/api/answerData/getAnswerData', answerDataQuery)
        .then(response => {
          if (response.data.code === '0') {
            this.answerData = response.data.data.map(item => ({
              ...item,
              eventStartTime: moment(item.eventStartTime).format('YYYY-MM-DD HH:mm:ss')
            }));
            this.totalItems = response.data.total || this.answerData.length;
            this.getDisplayData();
            if (this.answerData.length > 0) {
              this.setupTableColumns(this.answerData[0]?.tableName);
            } else {
              this.tableColumns = [];
            }
          } else {
            this.$message.error(response.data.message || '获取答题数据失败');
          }
        })
        .catch(error => {
          console.error(error);
          this.$message.error('获取答题数据失败');
        });
      },
      downloadAnswerData() {
        const answerDataQuery = {
          htmlName: this.selectedHtmlName,
          userName: this.selectedUserName === '全部' ? '-1' : this.selectedUserName,
          ithAnswer: this.selectedIthAnswer === '全部' ? '-1' : this.selectedIthAnswer,
          downloadInfo: {
            headers: this.tableColumns.reduce((acc, column) => {
                      acc[column.label] = column.prop;
                      return acc;
                    }, {}),
            fileName: `答题数据_${moment().format('YYYYMMDDHHmmss')}`,
            fileType: 'xlsx'
          }
        };
        this.axios.post('/api/answerData/getAnswerData', answerDataQuery,
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
        } else if (tableName === 3) {
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
            { label: '食物量', prop: 'foodValue' },
            { label: '出水量', prop: 'waterValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 4) {
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
            { label: '浓度', prop: 'concentrationValue' },
            { label: '留存时间', prop: 'lastTimeValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 5) {
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
            { label: '清晰度', prop: 'definitionValue' },
            { label: '画片大小', prop: 'projectionValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 6) {
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
            { label: '出水总量', prop: 'volumeValue' },
            { label: '出水温度', prop: 'tempValue' },
            { label: '出水速度', prop: 'speedValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 7) {
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
            { label: '播放速度', prop: 'speedValue' },
            { label: '音量', prop: 'volumeValue' },
            { label: '画质', prop: 'qualityValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 8) {
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
            { label: '风量', prop: 'windValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 9) {
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
            { label: 'last control设置', prop: 'lastSetting' },
            { label: '温度', prop: 'tempValue' },
            { label: '水分', prop: 'waterValue' },
            { label: '养料', prop: 'fertilizerValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 10) {
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
            { label: 'last control设置', prop: 'lastSetting' },
            { label: '照射距离', prop: 'distanceValue' },
            { label: '亮度', prop: 'brightnessValue' },
            { label: '照射范围', prop: 'areaValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 11) {
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
            { label: 'last control设置', prop: 'lastSetting' },
            { label: '硬度', prop: 'hardnessValue' },
            { label: '香甜度', prop: 'sweetnessValue' },
            { label: '煮饭时间', prop: 'cookTimeValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 12) {
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
            { label: 'last control设置', prop: 'lastSetting' },
            { label: '容量', prop: 'capacityValue' },
            { label: '苦涩度', prop: 'bitternessValue' },
            { label: '甜度', prop: 'sweetnessValue' },
            { label: '浓稠度', prop: 'consistenceValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 13) {
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
            { label: 'last control设置', prop: 'lastSetting' },
            { label: '容量', prop: 'capacityValue' },
            { label: '温度', prop: 'tempValue' },
            { label: '甜度', prop: 'sweetnessValue' },
            { label: '果肉数量', prop: 'pulpValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else if (tableName === 14) {
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
            { label: 'last control设置', prop: 'lastSetting' },
            { label: '亮度', prop: 'brightnessValue' },
            { label: '清晰度', prop: 'definationValue' },
            { label: '虚化程度', prop: 'virtualizationValue' },
            { label: '取景范围', prop: 'rangeValue' },
            { label: '连线答案', prop: 'diagramState' }
          ];
        } else {
          this.tableColumns = [];
        }
      },
      handlePageChange(page) {
        this.currentPage = page;
        this.getDisplayData();
      },
      handleSizeChange(size) {
        this.pageSize = size;
        this.currentPage = 1; // 重置当前页为1
        this.getDisplayData();
      }
    }
  };
  </script>
  
  <style scoped>
  .el-row {
    margin-bottom: 10px;
  }
  </style>
  