<template>
    <div class="coffee-machine-up">
      <h2>十一、二手咖啡机</h2>
            <p>
        系统经过一段时间运行后，咖啡机的工作状态发生了变化。<br/>
        系统已将输出值和按钮恢复到本题开始时的状态，并<b>自动试运行了一次</b>（顶部控制器设为2，其余为0），试运行结果见曲线图。<br/>
        请根据试运行结果，重新调节控制器，用尽可能少的鼠标点击次数，再次使容量处于350毫升左右、酸涩度处于5左右、甜度处于5左右、浓稠度处于10左右（目标与问题2相同）。<br/>
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
            :bitterness="bitterness"
            :sweetness="sweetness"
            :consistence="consistence"
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
    name: 'CoffeeMachineUpComponent',
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
        // 咖啡容量、酸涩度、甜度和浓稠度
        capacity: 800,
        bitterness: 10,
        sweetness: 10,
        consistence: 15,
      };
    },
    methods: {
      // 标准化试运行：复位 -> 按 trial 设置 -> 按新关系运行一次 -> 记录 -> 再次复位
      runTrial() {
        this.resetChanges();
        this.topControl = 2;
        const settings = { top: 2, central: 0, bottom: 0, last: 0 };
        this.applyChanges();
        const result = { capacity: this.capacity, bitterness: this.bitterness, sweetness: this.sweetness, consistence: this.consistence };
        this.$emit('trial', { settings, result });
        // 试运行结束后再次复位输出值和按钮，但继续使用Q3新关系
        this.resetChanges();
        this.$emit('resetChanges');
      },
      isTargetReached() {
        return this.capacity >= 320 && this.capacity <= 380 && this.bitterness >= 3 && this.bitterness <= 7 && this.sweetness >= 3 && this.sweetness <= 7 && this.consistence >= 8 && this.consistence <= 12;
      },
      applyChanges() {
        this.applyTimes++;
        // 更新容量
        const newCapacity = this.capacity + 100 * this.topControl;
        this.capacity = Math.max(0, newCapacity.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('capacity', this.capacity);

        // 更新酸涩度
        const newBitterness = this.bitterness + 2 * this.centralControl + 0.5 * this.lastControl;
        this.bitterness = Math.max(0, newBitterness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('bitterness', this.bitterness);

        // 更新甜度
        const newSweetness = this.sweetness - this.centralControl + 3 * this.bottomControl;
        this.sweetness = Math.max(0, newSweetness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('sweetness', this.sweetness);

        // 更新浓稠度
        const newConsistence = this.consistence + 2.5 * this.lastControl;
        this.consistence = Math.max(0, newConsistence.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('consistence', this.consistence);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.lastControl = 0;
        this.capacity = 0;
        this.bitterness = 0;
        this.sweetness = 0;
        this.consistence = 0;

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
  .coffee-machine-up {
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
  