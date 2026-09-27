<template>
    <div class="water-dispenser-up">
      <h2>五、饮水机</h2>
            <p>
        系统经过一段时间运行后，饮水机的工作状态发生了变化。<br/>
        系统已将输出值和按钮恢复到本题开始时的状态，并<b>自动试运行了一次</b>（底部控制器设为2，其余为0），试运行结果见曲线图。<br/>
        请根据试运行结果，重新调节控制器，用尽可能少的鼠标点击次数，再次使出水总量处于250-300毫升之间、出水温度处于30度左右、出水速度处于15毫升/s左右（目标与问题2相同）。<br/>
        达到目标后，请在下方选择你认为系统发生的变化，并点击提交。
      </p>
      <div class="control-and-chart">
        <div class="flex-container">
          <controller-component
            :top-control="topControl"
            :central-control="centralControl"
            :bottom-control="bottomControl"
            @update:top-control="handleTop"
            @update:central-control="handleCentral"
            @update:bottom-control="handleBottom"
          />
          <chart-component
            ref="chartComponent"
            :volume="volume"
            :temp="temp"
            :speed="speed"
          />
        </div>
        <button-component
          @apply="applyChanges"
          @reset="resetChanges"
        />
      </div>
    </div>
  </template>
  
  <script>
  import ControllerComponent from './componentsT2/ControllerComponentT2.vue';
  import ChartComponent from './componentsT2/ChartComponentT2.vue';
  import ButtonComponent from './componentsT2/ButtonComponentT2.vue';
  
  export default {
    name: 'WaterDispenserUpComponent',
    components: {
      ControllerComponent,
      ChartComponent,
      ButtonComponent
    },
    data() {
      return {
        // 控制器值
        topControl: 0,
        centralControl: 0,
        bottomControl: 0,
        // 出水总量、出水温度和出水速度大小
        volume: 600,
        temp: 45,
        speed: 15
      };
    },
    methods: {
      // 标准化试运行：复位 -> 按 trial 设置 -> 按新关系运行一次 -> 记录 -> 再次复位
      runTrial() {
        this.resetChanges();
        this.bottomControl = 2;
        const settings = { top: 0, central: 0, bottom: 2 };
        this.applyChanges();
        const result = { volume: this.volume, temp: this.temp, speed: this.speed };
        this.$emit('trial', { settings, result });
        // 试运行结束后再次复位输出值和按钮，但继续使用Q3新关系
        this.resetChanges();
        this.$emit('resetChanges');
      },
      isTargetReached() {
        return this.volume >= 250 && this.volume <= 300 && this.temp >= 28 && this.temp <= 32 && this.speed >= 13 && this.speed <= 17;
      },
      applyChanges() {
        this.applyTimes++;
        // 更新出水总量
        const newVolume = this.volume + 1.5 * this.centralControl;
        this.volume = Math.max(0, newVolume.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('volume', this.volume);

        // 更新出水温度
        const newTemp = this.temp + 8 * this.bottomControl + 2;
        this.temp = Math.max(0, newTemp.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('temp', this.temp);

        // 更新出水速度
        const newSpeed = this.speed + 10 * this.topControl + 5 * this.centralControl - 0.5;
        this.speed = Math.max(0, newSpeed.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('speed', this.speed);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.volume = 600;
        this.temp = 45;
        this.speed = 15;

        // 调用 ChartComponent 的 resetChart 方法
        this.$refs.chartComponent.resetChart();

        this.$emit('resetChanges');
      },
      handleTop(value) {
        this.topControl = value;
        this.$emit('control');
      },
      handleCentral(value) {
        this.centralControl = value;
        this.$emit('control');
      },
      handleBottom(value) {
        this.bottomControl = value;
        this.$emit('control');
      }
    }
  };
  </script>
  
  <style scoped>
  .water-dispenser-up {
    display: flex;
    flex-direction: column;
    width: 100%; /* 占据整个页面宽度 */
    padding: 0 20px; /* 减少左右内边距 */
    box-sizing: border-box;
  }
  
  .flex-container {
    display: flex;
    flex-direction: row; /* 子组件按列排列 */
    justify-content: center; /* 垂直居中 */
    align-items: center; /* 水平居中 */
  }
  h2 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 20px;
    line-height: 1.6;
  }
  </style>
  