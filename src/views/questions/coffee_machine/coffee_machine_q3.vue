<template>
    <div class="cat-feed-q3">
      <!-- 使用 Header 组件 -->
      <header-component :userName="userName" />

      <!-- 题干部分 -->
      <div class="container-box">
        <coffee_machine-up-component-q3
          ref="upComponentRef"
          @applyChanges="handleApply"
          @resetChanges="handleReset"
          @control="handleControl"
          @trial="handleTrial"
        />
      </div>

      <!-- 题目部分 -->
      <div class="container-box question-section">
        <countdown-timer ref="countdownTimer" :duration="duration" :timerKey="`timer_${this.no}`" @timeUp="handleTimeUp" />
        <div class="question-text">
          <h3>问题3: 判断系统变化并重新达标</h3>
        </div>
        <!-- 变化判断选项（单选，常驻显示，未选择不允许提交） -->
        <div class="judge-section">
          <h3 class="judge-title">变化判断选项</h3>
          <el-radio-group v-model="judgeChoice" class="judge-options">
            <el-radio label="A">A. 顶部控制器对容量的作用减弱了</el-radio>
            <el-radio label="B">B. 中间控制器对酸涩度的作用减弱了</el-radio>
            <el-radio label="C">C. 底部控制器对甜度的作用减弱了</el-radio>
            <el-radio label="D">D. 最后一个控制器对浓稠度的作用方向改变了</el-radio>
          </el-radio-group>
        </div>

        <el-row style="margin-top: 20px;" type="flex" justify="center">
          <el-button type="primary" @click="submitAnswer">提交</el-button>
        </el-row>
      </div>

    </div>
  </template>

  <script>
  import CoffeeMachineUpComponentQ3 from './coffee_machine_up_component_q3.vue';
  import HeaderComponent from '@/components/Header.vue';
  import CountdownTimer from '@/components/CountdownTimer.vue';

  export default {
    name: 'CoffeeMachineQ3',
    components: {
      CoffeeMachineUpComponentQ3,
      HeaderComponent,
      CountdownTimer,
    },
    data() {
      return {
        userName: '',
        ithAnswer: -1,
        no: -1,
        eventNumber: 1, // 用于记录事件次数
        duration: 360, // 倒计时时间
        judgeChoice: null,
      };
    },
    created() {
        this.userName = JSON.parse(localStorage.getItem('userInfo')).userName;
        this.ithAnswer = localStorage.getItem('ithAnswer');
        this.no = parseInt(localStorage.getItem('no'));
    },
    mounted() {
      this.startAnswer();
      // 标准化试运行：复位 -> 顶部=1 -> 按新关系运行一次 -> 记录 -> 再次复位
      this.$refs.upComponentRef.runTrial();
    },
    methods: {
      startAnswer() {
        this.sendEvent('start');
      },
      handleTrial({ settings, result }) {
        this.sendEvent('trial', { settings, result });
      },
      handleControl() {
        this.sendEvent('control');
      },
      handleApply() {
        this.sendEvent('apply');
      },
      handleReset() {
        this.sendEvent('reset');
      },
      submitAnswer() {
        // 单选题未作答不允许提交
        if (!this.judgeChoice) {
          this.$message({
            message: '请先在"变化判断选项"中选择一个选项再提交',
            type: 'warning',
          });
          return;
        }
        const upComponent = this.$refs.upComponentRef;
        if (!upComponent.isTargetReached()) {
          this.$message({
            message: '尚未达到目标（目标值见曲线图上方），请继续调整控制器',
            type: 'warning',
          });
          return;
        }
        this.sendEvent('submit');
        this.sendEvent('judge', { diagramState: 'Q3_CHOICE:' + this.judgeChoice });
        this.$message({
          message: '提交成功，进入下一题～',
          type: 'success',
        });
        this.$getQuestion(this.no + 1);
        // 删除缓存倒计时
        localStorage.removeItem(`timer_${this.no}`);
      },
      handleTimeUp() {
        // 自动提交答案
        this.sendEvent('timeup');
        this.$message({
          message: '时间到，自动提交并跳转到下一题！',
          type: 'warning',
        });
        // 跳转下一题
        this.$getQuestion(this.no + 1);
        // 删除缓存倒计时
        localStorage.removeItem(`timer_${this.no}`);
      },
      sendEvent(eventType, { settings, result, diagramState } = {}) {
        const userName = this.userName;
        const ithAnswer = this.ithAnswer;

        const data = {
          tableName: 1,
          htmlName: 'coffee_machine_q3',
          userName: userName,
          ithAnswer: ithAnswer,
          event: 'ACER_EVENT',
          eventType: eventType,
          eventStartTime: new Date().toISOString(),
          eventNumber: this.eventNumber,
          topSetting: "NULL",
          centralSetting: "NULL",
          bottomSetting: "NULL",
          capacityValue: "NULL",
          bitternessValue: "NULL",
          sweetnessValue: "NULL",
          consistenceValue: "NULL",
          diagramState: "NULL",
          network: null,
          fareType: null,
          ticketType: null,
          numberTrips: null,
        };

        const upComponent = this.$refs.upComponentRef;

        if (eventType === 'start') {
          data.event = 'START_ITEM';
          data.eventType = 'NULL';
        } else if (eventType === 'submit') {
          // 提交时同时记录最终按钮设置与输出值（用于判定是否达标）
          data.event = 'END_ITEM';
          data.eventType = 'NULL';
          data.topSetting = upComponent.topControl.toString();
          data.centralSetting = upComponent.centralControl.toString();
          data.bottomSetting = upComponent.bottomControl.toString();
          data.lastSetting = upComponent.lastControl.toString();
          data.capacityValue = upComponent.capacity.toString();
          data.bitternessValue = upComponent.bitterness.toString();
          data.sweetnessValue = upComponent.sweetness.toString();
          data.consistenceValue = upComponent.consistence.toString();
        } else if (eventType === 'timeup') {
          data.event = 'TIME_UP';
          data.eventType = 'NULL';
          data.topSetting = upComponent.topControl.toString();
          data.centralSetting = upComponent.centralControl.toString();
          data.bottomSetting = upComponent.bottomControl.toString();
          data.lastSetting = upComponent.lastControl.toString();
          data.capacityValue = upComponent.capacity.toString();
          data.bitternessValue = upComponent.bitterness.toString();
          data.sweetnessValue = upComponent.sweetness.toString();
          data.consistenceValue = upComponent.consistence.toString();
        } else if (eventType === 'trial') {
          // 标准化试运行：记录试运行按钮设置与输出结果
          data.topSetting = String(settings.top);
          data.centralSetting = String(settings.central);
          data.bottomSetting = String(settings.bottom);
          data.lastSetting = String(settings.last);
          data.capacityValue = String(result.capacity);
          data.bitternessValue = String(result.bitterness);
          data.sweetnessValue = String(result.sweetness);
          data.consistenceValue = String(result.consistence);
        } else if (eventType === 'judge') {
          // Q3变化判断选项，diagramState 记录为 Q3_CHOICE:A/B/C/D
          data.diagramState = diagramState;
        } else if (eventType === 'control') {
          data.topSetting = upComponent.topControl.toString();
          data.centralSetting = upComponent.centralControl.toString();
          data.bottomSetting = upComponent.bottomControl.toString();
          data.lastSetting = upComponent.lastControl.toString();
        } else if (eventType === 'reset' || eventType === 'apply') {
          data.topSetting = upComponent.topControl.toString();
          data.centralSetting = upComponent.centralControl.toString();
          data.bottomSetting = upComponent.bottomControl.toString();
          data.lastSetting = upComponent.lastControl.toString();
          data.capacityValue = upComponent.capacity.toString();
          data.bitternessValue = upComponent.bitterness.toString();
          data.sweetnessValue = upComponent.sweetness.toString();
          data.consistenceValue = upComponent.consistence.toString();
        } else {
          console.error('未知的动作！');
          return;
        }

        this.axios.post('/api/test/exploreData', data)
          .then(response => {
            if (response.data.code === '0') {
                this.eventNumber++;
            }
          })
          .catch(error => {
            console.error('刚才的操作失效，请重新操作！', error);
          });
      },
    }
  };
  </script>

  <style scoped>
  .cat-feed-q3 {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .container-box {
    padding: 0 20px;
    margin-bottom: 10px;
  }

  .question-section {
    border-top: 1px solid #eee;
    padding-top: 10px;
  }

  .judge-section {
    margin-top: 10px;
    padding: 15px 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background-color: #f8f9fb;
  }

  .judge-title {
    font-size: 16px;
    margin-bottom: 5px;
  }

  .judge-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 14px;
    column-gap: 40px;
    margin-top: 10px;
  }

  .judge-options .el-radio {
    margin-right: 0;
    justify-content: flex-start;
  }
  </style>
