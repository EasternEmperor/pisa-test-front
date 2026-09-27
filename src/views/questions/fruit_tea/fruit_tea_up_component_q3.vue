<template>
    <div class="fruit-tea-up">
      <h2>十二、果茶制作机</h2>
            <p>
        系统经过一段时间运行后，果茶制作机的工作状态发生了变化。<br/>
        系统已将输出值和按钮恢复到本题开始时的状态，并<b>自动试运行了一次</b>（顶部控制器设为1，其余为0），试运行结果见曲线图。<br/>
        请根据试运行结果，重新调节控制器，用尽可能少的鼠标点击次数，再次使容量处于500-510毫升之间、温度处于35度左右、甜度处于9左右、果肉数量处于13左右（目标与问题2相同）。<br/>
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
            :capacity="capacity"
            :temp="temp"
            :sweetness="sweetness"
            :pulp="pulp"
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
    name: 'FruitTeaUpComponent',
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
        // 果茶容量、温度、甜度和果肉数量
        capacity: 550,
        temp: 50,
        sweetness: 10,
        pulp: 10,
      };
    },
    methods: {
      // 标准化试运行：复位 -> 按 trial 设置 -> 按新关系运行一次 -> 记录 -> 再次复位
      runTrial() {
        this.resetChanges();
        this.topControl = 1;
        const settings = { top: 1, central: 0, bottom: 0, last: 0 };
        this.applyChanges();
        const result = { capacity: this.capacity, temp: this.temp, sweetness: this.sweetness, pulp: this.pulp };
        this.$emit('trial', { settings, result });
        // 试运行结束后再次复位输出值和按钮，但继续使用Q3新关系
        this.resetChanges();
        this.$emit('resetChanges');
      },
      isTargetReached() {
        return this.capacity >= 500 && this.capacity <= 510 && this.temp >= 33 && this.temp <= 37 && this.sweetness >= 7 && this.sweetness <= 11 && this.pulp >= 11 && this.pulp <= 15;
      },
      applyChanges() {
        this.applyTimes++;
        // 更新容量
        const newCapacity = this.capacity + 100 * this.centralControl + 120 * this.lastControl;
        this.capacity = Math.max(0, newCapacity.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('capacity', this.capacity);

        // 更新温度
        const newTemp = this.temp - 5 * this.topControl;
        this.temp = Math.max(0, newTemp.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('temp', this.temp);

        // 更新甜度
        const newSweetness = this.sweetness + this.bottomControl + 1.5 * this.lastControl;
        this.sweetness = Math.max(0, newSweetness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('sweetness', this.sweetness);

        // 更新果肉数量
        const newPulp = this.pulp + 1.5 * this.bottomControl;
        this.pulp = Math.max(0, newPulp.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('pulp', this.pulp);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.lastControl = 0;
        this.capacity = 550;
        this.temp = 50;
        this.sweetness = 10;
        this.pulp = 10;

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
  .fruit-tea-up {
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
  