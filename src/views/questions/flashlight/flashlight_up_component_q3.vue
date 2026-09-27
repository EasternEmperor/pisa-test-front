<template>
    <div class="flashlight-up">
      <h2>九、手电筒</h2>
            <p>
        系统经过一段时间运行后，手电筒的工作状态发生了变化。<br/>
        系统已将输出值和按钮恢复到本题开始时的状态，并<b>自动试运行了一次</b>（底部控制器设为1，其余为0），试运行结果见曲线图。<br/>
        请根据试运行结果，重新调节控制器，用尽可能少的鼠标点击次数，再次使照射距离处于22米左右、亮度处于20左右、照射范围处于15左右（目标与问题2相同）。<br/>
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
            :distance="distance"
            :brightness="brightness"
            :area="area"
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
    name: 'FlashlightUpComponent',
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
        // 照射距离、亮度、范围
        distance: 30,
        brightness: 20,
        area: 30,
      };
    },
    methods: {
      // 标准化试运行：复位 -> 按 trial 设置 -> 按新关系运行一次 -> 记录 -> 再次复位
      runTrial() {
        this.resetChanges();
        this.bottomControl = 1;
        const settings = { top: 0, central: 0, bottom: 1, last: 0 };
        this.applyChanges();
        const result = { distance: this.distance, brightness: this.brightness, area: this.area };
        this.$emit('trial', { settings, result });
        // 试运行结束后再次复位输出值和按钮，但继续使用Q3新关系
        this.resetChanges();
        this.$emit('resetChanges');
      },
      isTargetReached() {
        return this.distance >= 20 && this.distance <= 24 && this.brightness >= 18 && this.brightness <= 22 && this.area >= 13 && this.area <= 17;
      },
      applyChanges() {
        this.applyTimes++;
        // 更新照射距离
        const newDistance = this.distance + 5 * this.topControl + 2 * this.centralControl - this.bottomControl;
        this.distance = Math.max(0, newDistance.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('distance', this.distance);

        // 更新亮度
        const newBrightness = this.brightness + 3 * this.centralControl - this.bottomControl + 0.5 * this.lastControl;
        this.brightness = Math.max(0, newBrightness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('brightness', this.brightness);

        // 更新照射范围
        const newArea = this.area + 2.5 * this.bottomControl;
        this.area = Math.max(0, newArea.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('area', this.area);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.lastControl = 0;
        this.distance = 30;
        this.brightness = 20;
        this.area = 30;

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
  .flashlight-up {
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
  