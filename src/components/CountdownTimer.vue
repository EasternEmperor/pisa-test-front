<template>
    <div class="countdown-timer" :class="{ 'not-started': !started }">
      <template v-if="started">⏰ 剩余时间：{{ formattedTime }}</template>
      <template v-else>⏰ 答题时间：未开始（探索阶段不限时）</template>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      duration: {
        type: Number,
        required: true,
      },
      timerKey: {
        type: String,
        required: true, // 用于区分不同题目的倒计时
      },
      autoStart: {
        type: Boolean,
        default: true, // false 时由题目页在首次作答交互时调用 start() 手动开始
      },
    },
    data() {
      return {
        timeLeft: 0,
        intervalId: null,
        started: false,
      };
    },
    computed: {
      formattedTime() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      },
    },
    methods: {
      // 手动开始倒计时（探索阶段结束后由题目首次作答交互触发）
      start() {
        if (this.started) {
          return;
        }
        this.started = true;
        this.loadRemainingTime();
        this.startCountdown();
      },
      startCountdown() {
        this.intervalId = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
            // 每次更新倒计时时，将剩余时间保存到 localStorage
            localStorage.setItem(this.timerKey, this.timeLeft);
          } else {
            this.stopCountdown();
            this.$emit('timeUp'); // 触发父组件的 timeUp 事件
          }
        }, 1000);
      },
      stopCountdown() {
        clearInterval(this.intervalId);
        this.intervalId = null;
      },
      loadRemainingTime() {
        // 从 localStorage 加载剩余时间
        const savedTime = localStorage.getItem(this.timerKey);
        if (savedTime !== null) {
          this.timeLeft = parseInt(savedTime, 10);
        } else {
          // 如果没有保存的时间，则使用默认时长
          this.timeLeft = this.duration;
        }
      },
    },
    mounted() {
      if (this.autoStart) {
        this.started = true;
        this.loadRemainingTime();
        this.startCountdown();
      } else {
        this.timeLeft = this.duration;
      }
    },
    beforeDestroy() {
      this.stopCountdown();
    },
  };
  </script>
  
  <style scoped>
  .countdown-timer {
    font-size: 16px;
    font-weight: bold;
    color: #ff0000;
    text-align: center;
    margin-bottom: 10px;
  }

  .countdown-timer.not-started {
    color: #909399;
  }
  </style>
  