<template>
    <div class="flower-garden-up">
      <h2>八、自动养花小棚</h2>
            <p>
        系统经过一段时间运行后，养花小棚的工作状态发生了变化。<br/>
        系统已将输出值和按钮恢复到本题开始时的状态，并<b>自动试运行了一次</b>（底部控制器设为1，其余为0），试运行结果见曲线图。<br/>
        请根据试运行结果，重新调节控制器，用尽可能少的鼠标点击次数，再次使温度处于25度左右、水分处于20左右、养料处于20左右（目标与问题2相同）。<br/>
        达到目标后，请在下方选择你认为系统发生的变化，并点击提交。
      </p>
      <div class="control-and-chart">
        <div class="flex-container">
          <controller-component
            :top-control="topControl"
            :central-control="centralControl"
            :bottom-control="bottomControl"
            :last-control="lastControl"
            @update:top-control="handleTop"
            @update:central-control="handleCentral"
            @update:bottom-control="handleBottom"
            @update:last-control="handleLast"
          />
          <chart-component
            ref="chartComponent"
            :temp="temp"
            :water="water"
            :fertilizer="fertilizer"
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
    name: 'FlowerGardenUpComponent',
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
        lastControl: 0,
        // 温度、水分和养料
        temp: 20,
        water: 25,
        fertilizer: 15,
      };
    },
    methods: {
      // 标准化试运行：复位 -> 按 trial 设置 -> 按新关系运行一次 -> 记录 -> 再次复位
      runTrial() {
        this.resetChanges();
        this.bottomControl = 1;
        const settings = { top: 0, central: 0, bottom: 1, last: 0 };
        this.applyChanges();
        const result = { temp: this.temp, water: this.water, fertilizer: this.fertilizer };
        this.$emit('trial', { settings, result });
        // 试运行结束后再次复位输出值和按钮，但继续使用Q3新关系
        this.resetChanges();
        this.$emit('resetChanges');
      },
      isTargetReached() {
        return this.temp >= 23 && this.temp <= 27 && this.water >= 18 && this.water <= 22 && this.fertilizer >= 18 && this.fertilizer <= 22;
      },
      applyChanges() {
        this.applyTimes++;
        // 更新温度
        const newTemp = this.temp - 2 * this.bottomControl + 0.5;
        this.temp = Math.max(0, newTemp.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('temp', this.temp);

        // 更新水分
        const newWater = this.water + 1.5 * this.centralControl + 0.8 * this.lastControl;
        this.water = Math.max(0, newWater.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('water', this.water);

        // 更新养料
        const newFertilizer = this.fertilizer + 2 * this.topControl + this.lastControl;
        this.fertilizer = Math.max(0, newFertilizer.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('fertilizer', this.fertilizer);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.lastControl = 0;
        this.temp = 20;
        this.water = 25;
        this.fertilizer = 15;

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
      },
      handleLast(value) {
        this.lastControl = value;
        this.$emit('control');
      }
    }
  };
  </script>
  
  <style scoped>
  .flower-garden-up {
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
  