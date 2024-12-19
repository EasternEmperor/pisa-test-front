<template>
    <div class="projection-controller-up">
      <h2>四、投影仪遥控</h2>
      <p>
        你的投影仪年久失修出现问题，需要你通过探索如何使用它来播放投影。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心和底部控制器。每个控制器的初始设置在▲的位置，控制器一次只能调整一格。<br/>
        控制器能够控制投影仪投影的清晰度和画片大小，但三个控制器的对清晰度和画片大小的具体影响需要你自己探索。<br/>
        在控制器归零时（即▲位置），由于一些故障，投影仪也可能更改清晰度。<br/>
        当你设置好控制器后，点击"调控"键，你将在清晰度和画片大小曲线图中看到投影仪的任何变化。<br/>
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
        definition: 0,
        projection: 0,
        applyTimes: 0,
      };
    },
    methods: {
      applyChanges() {
        this.applyTimes++;
        // 更新清晰度
        const newDefinition = this.definition + this.topControl + 0.25 * this.centralControl + 0.1;
        this.definition = Math.max(0, newDefinition.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('definition', this.definition);

        // 更新画片大小
        const newProjection = this.projection + 2 * this.topControl + 0.5 * this.bottomControl;
        this.projection = Math.max(0, newProjection.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('projection', this.projection);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.definition = 0;
        this.projection = 0;

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
  