<template>
    <div class="sunlight-controller-up">
      <h2>七、阳光照射控制器</h2>
            <p>
        系统经过一段时间运行后，阳光照射控制器的工作状态发生了变化。<br/>
        系统已将输出值和按钮恢复到本题开始时的状态，并<b>自动试运行了一次</b>（顶部控制器设为1，其余为0），试运行结果见曲线图。<br/>
        请根据试运行结果，重新调节控制器，用尽可能少的鼠标点击次数，再次使照射面积处于15平方米左右、照射时间处于45分钟左右、照射强度处于13左右（目标与问题2相同）。<br/>
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
            :area="area"
            :time="time"
            :strength="strength"
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
    name: 'SunlightControllerUpComponent',
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
        // 温度、湿度和风量
        area: 9,
        time: 60,
        strength: 10,
      };
    },
    methods: {
      // 标准化试运行：复位 -> 按 trial 设置 -> 按新关系运行一次 -> 记录 -> 再次复位
      runTrial() {
        this.resetChanges();
        this.topControl = 1;
        const settings = { top: 1, central: 0, bottom: 0 };
        this.applyChanges();
        const result = { area: this.area, time: this.time, strength: this.strength };
        this.$emit('trial', { settings, result });
        // 试运行结束后再次复位输出值和按钮，但继续使用Q3新关系
        this.resetChanges();
        this.$emit('resetChanges');
      },
      isTargetReached() {
        return this.area >= 13 && this.area <= 17 && this.time >= 43 && this.time <= 47 && this.strength >= 11 && this.strength <= 15;
      },
      applyChanges() {
        // 更新照射面积
        const newArea = this.area + 1.5 * this.bottomControl;
        this.area = Math.max(0, newArea.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('area', this.area);

        // 更新照射时间
        const newTime = this.time + 5 * this.centralControl;
        this.time = Math.max(0, newTime.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('time', this.time);

        // 更新照射强度
        const newStrength = this.strength - 2 * this.topControl + 0.5;
        this.strength = Math.max(0, newStrength.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('strength', this.strength);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.area = 26;
        this.time = 100;
        this.strength = 33;

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
  .sunlight-controller-up {
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
  