<template>
    <div class="perfume-maker-up">
      <h2>三、香水制作机</h2>
      <p>
        你新买的香水制作机没有说明书，需要你通过探索如何使用它来制作香水。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心和底部控制器。每个控制器的初始设置在▲的位置，<b>控制器只能逐步一格一格调整。</b><br/>
        控制器能够控制香水制作机制作的香水的浓度和留存时间，但三个控制器的对浓度和留存时间的具体影响需要你自己探索。<br/>
        当你设置好控制器后，点击"调控"键，你将在机器的浓度和留存时间曲线图中看到香水制作机的任何变化。鼠标置于曲线图的点上能查看该点的具体值。
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
            :concentration="concentration"
            :lastTime="lastTime"
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
    name: 'PerfumeMakerUpComponent',
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
        // 浓度和留存时间值
        concentration: 0,
        lastTime: 0,
        applyTimes: 0,
      };
    },
    methods: {
      applyChanges() {
        this.applyTimes++;
        // 更新浓度
        const newConcentration = this.concentration + this.topControl + 1.5 * this.bottomControl;
        this.concentration = Math.max(0, newConcentration.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('concentration', this.concentration);

        // 更新留存时间
        const newLastTime = this.lastTime + 1.5 * this.centralControl;
        this.lastTime = Math.max(0, newLastTime.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('lastTime', this.lastTime);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.concentration = 0;
        this.lastTime = 0;

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
  .perfume-maker-up {
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
  