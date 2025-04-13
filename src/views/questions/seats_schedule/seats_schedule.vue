<template>
    <div class="seats-schedule">
      <!-- 使用 Header 组件 -->
      <header-component :userName="userName" />

      <!-- 题干部分 -->
      <div class="container-box">
        <countdown-timer :duration="duration" :timerKey="`timer_${this.no}`" @timeUp="handleTimeUp" />
        <seats-schedule-up ref="upComponentRef" @applyChanges="handleApply" @resetChanges="handleReset" @submitChanges="handleSubmit"/>
      </div>
    </div>
  </template>
  
  <script>
  import SeatsScheduleUp from './seats_schedule_up.vue';
  import HeaderComponent from '@/components/Header.vue';
  import CountdownTimer from '@/components/CountdownTimer.vue';
  
  export default {
    name: 'SeatsSchedule',
    components: {
      SeatsScheduleUp,
      HeaderComponent,
      CountdownTimer,
    },
    data() {
      return {
        userName: '',
        ithAnswer: -1,
        no: -1,
        selectedControl: null,
        connections: [],
        eventNumber: 1, // 用于记录事件次数
        duration: 480, // 倒计时时间
      };
    },
    created() {
        this.userName = JSON.parse(sessionStorage.getItem('userInfo')).userName;
        this.ithAnswer = sessionStorage.getItem('ithAnswer');
        this.no = parseInt(sessionStorage.getItem('no'));
    },
    methods: {
      startAnswer() {
        this.sendEvent('start');
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
      handleApply({ diagramState, choosePool }) {
        this.sendEvent('apply', { diagramState, choosePool });
      },
      handleReset({ diagramState, choosePool }) {
        this.sendEvent('reset', { diagramState, choosePool });
      },
      handleSubmit({ diagramState, choosePool }) {
        this.sendEvent('submit', { diagramState, choosePool });
        this.$message({
            message: "提交成功，进入下一题～",
            type: "success",
        });
        this.$getQuestion(this.no + 1);
        // 删除缓存倒计时
        localStorage.removeItem(`timer_${this.no}`);
      },
      sendEvent(eventType, {diagramState, choosePool} = {}) {
        const userName = this.userName;
        const ithAnswer = this.ithAnswer;

        console.log('发送事件：', eventType, diagramState, choosePool)
  
        const data = {
          tableName: 1,
          htmlName: 'seats_schedule',
          userName: userName,
          ithAnswer: ithAnswer,
          event: 'ACER_EVENT',
          eventType: eventType,
          eventStartTime: new Date().toISOString(),
          eventNumber: this.eventNumber,
          choosePool: 'NULL',
          diagramState: 'NULL',
        };

        if (eventType === 'apply') {
          data.choosePool = choosePool;
          data.diagramState = diagramState;
        } else if (eventType === 'reset') {
          data.choosePool = choosePool;
          data.diagramState = diagramState;
        } else if (eventType === 'start') {
          data.event = 'START_ITEM';
          data.eventType = 'NULL';
        } else if (eventType === 'submit') {
          data.event = 'END_ITEM';
          data.eventType = 'NULL';
        } else if (eventType === 'timeup') {
          data.event = 'TIME_UP';
          data.eventType = 'NULL';
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
            this.$message({
                message: "刚才的操作失效，请重新操作！",
                type: "warning",
            });
          });
      },
      preventBack() {
        // 阻止用户后退
        history.pushState(null, null, location.href);
        this.$message({
          message: "不能返回上一题，请点击提交或继续答题！",
          type: "warning",
        });
      },
      initPreventBack() {
        // 初始化防止后退逻辑
        history.pushState(null, null, location.href); // 首次向历史记录栈添加当前页面
        window.addEventListener('popstate', this.preventBack); // 监听后退事件
      }
    },
    mounted() {
      // 开始答题
      this.startAnswer();
      // 初始化防止后退
      this.initPreventBack();
    },
    beforeDestroy() {
      window.removeEventListener('popstate', this.preventBack);
    }
  };
  </script>
  
  <style scoped>
  .seats-schedule {
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }
  
  .container-box {
    border: 2px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .question-section {
    display: flex;
    flex-direction: column;
  }
  
  .question-text {
    margin-bottom: 20px;
  }
  
  .diagram-section {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    gap: 50px;
  }
  
  .lines-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }
  
  .controls-column,
  .influences-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .control-box,
  .influence-box {
    width: 150px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e0e0;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    z-index: 1;
  }
  
  .control-box:hover,
  .influence-box:hover {
    background-color: #d0d0d0;
  }

  .selected-box {
    background-color: #007bff; /* 蓝色背景 */
    color: white; /* 改变文字颜色以便在蓝色背景上显示清晰 */
  }
  </style>
  