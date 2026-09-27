<template>
    <div class="projection-controller-up">
      <h2>四、投影仪遥控</h2>
            <p>
        系统经过一段时间运行后，投影仪的工作状态发生了变化。<br/>
        系统已将输出值和按钮恢复到本题开始时的状态，并<b>自动试运行了一次</b>（底部控制器设为2，其余为0），试运行结果见曲线图。<br/>
        请根据试运行结果，重新调节控制器，用尽可能少的鼠标点击次数，再次使清晰度处于7.5左右、画片大小处于4.5左右（目标与问题2相同）。<br/>
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
            :definition="definition"
            :projection="projection"
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
    name: 'ProjectionControllerUpComponent',
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
        // 清晰度和画片大小
        definition: 6,
        projection: 8,
        applyTimes: 0,
      };
    },
    methods: {
      // 标准化试运行：复位 -> 按 trial 设置 -> 按新关系运行一次 -> 记录 -> 再次复位
      runTrial() {
        this.resetChanges();
        this.bottomControl = 2;
        const settings = { top: 0, central: 0, bottom: 2 };
        this.applyChanges();
        const result = { definition: this.definition, projection: this.projection };
        this.$emit('trial', { settings, result });
        // 试运行结束后再次复位输出值和按钮，但继续使用Q3新关系
        this.resetChanges();
        this.$emit('resetChanges');
      },
      isTargetReached() {
        return this.definition >= 6.5 && this.definition <= 8.5 && this.projection >= 3.5 && this.projection <= 5.5;
      },
      applyChanges() {
        this.applyTimes++;
        // 更新清晰度
        const newDefinition = this.definition + this.topControl + 0.25 * this.centralControl + 0.1;
        this.definition = Math.max(0, newDefinition.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('definition', this.definition);

        // 更新画片大小
        const newProjection = this.projection + 2 * this.topControl - 0.5 * this.bottomControl;
        this.projection = Math.max(0, newProjection.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('projection', this.projection);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.definition = 6;
        this.projection = 8;

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
  .projection-controller-up {
    display: flex;
    flex-direction: column;
    width: 100%; /* 占据整个页面宽度 */
    padding: 0 20px; /* 减少左右内边距 */
    box-sizing: border-box;
  }
  
  .flex-container {
    display: flex;
    /* 可选: 如果需要间距，可以添加 gap 属性 */
    gap: 10px; /* 用于控制组件间的间距 */
  }
  h2 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 20px;
    line-height: 1.6;
  }
  </style>
  