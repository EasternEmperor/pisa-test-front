<template>
    <div class="flashlight-up">
      <h2>九、手电筒</h2>
      <p>
        你新买的手电筒没有说明书，需要你通过探索来学习如何调控手电筒的照射。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心、底部和横条控制器。每个控制器的初始设置在▲的位置，<b>控制器只能逐步一格一格调整。</b><br/>
        控制器能够控制手电筒灯光照射的距离、亮度和范围，但四个控制器对照射距离、亮度和照射范围大小的具体影响需要你自己探索。<br/>
        当你设置好控制器后，点击"调控"键，你将在照射距离、亮度和照射范围曲线图中看到养花小棚的任何变化。鼠标置于曲线图的点上能查看该点的具体值。<br/>
        点击"重置"键，你可以将所有控制器重置到初始设置，照射距离、亮度和照射范围数字也将变回初始值。
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
  import ControllerComponent from './components/ControllerComponent.vue';
  import ChartComponent from './components/ChartComponent.vue';
  import ButtonComponent from './components/ButtonComponent.vue';
  
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
        distance: 0,
        brightness: 0,
        area: 0,
      };
    },
    methods: {
      applyChanges() {
        // 更新照射距离
        const newDistance = this.distance + 10 * this.topControl + 2 * this.centralControl - this.bottomControl;
        this.distance = Math.max(0, newDistance.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('distance', this.distance);

        // 更新亮度
        const newBrightness = this.brightness + 3 * this.centralControl - this.bottomControl + 0.5 * this.lastControl;
        this.brightness = Math.max(0, newBrightness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('brightness', this.brightness);

        // 更新照射范围
        const newArea = this.area + 5 * this.bottomControl;
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
        this.distance = 0;
        this.brightness = 0;
        this.area = 0;

        // 调用 ChartComponent 的 resetChart 方法
        this.$refs.chartComponent.resetChart();

        this.$emit('resetChanges');
      },
      handleTop(value) {
        this.topControl = value;
        this.$emit('control', value);
      },
      handleCentral(value) {
        this.centralControl = value;
        this.$emit('control', value);
      },
      handleBottom(value) {
        this.bottomControl = value;
        this.$emit('control', value);
      },
      handleLast(value) {
        this.lastControl = value;
        this.$emit('control', value);
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
  