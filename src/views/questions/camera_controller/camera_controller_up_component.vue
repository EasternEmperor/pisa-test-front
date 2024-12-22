<template>
    <div class="camera-controller-up">
      <h2>十三、照相机</h2>
      <p>
        你新买的照相机没有说明书，需要你通过探索来学习如何调控照相机拍摄美丽的照片。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心、底部和横条控制器。每个控制器的初始设置在▲的位置，<b>控制器一次只能调整一格。</b><br/>
        控制器能够控制照相机拍摄照片的亮度、清晰度、虚化程度和取景范围，但四个控制器对照片亮度、清晰度、虚化程度和取景范围大小的具体影响需要你自己探索。<br/>
        当你设置好控制器后，点击"调控"键，你将在照片亮度、清晰度、虚化程度和取景范围曲线图中看到照相机的任何变化。<br/>
        点击"重置"键，你可以将所有控制器重置到初始设置，亮度、清晰度、虚化程度和取景范围数字也将变回初始值。
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
          :brightness="brightness"
          :definition="definition"
          :virtualization="virtualization"
          :range="range"
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
    name: 'CameraControllerUpComponent',
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
        // 咖啡容量、苦涩度、甜度和浓稠度
        brightness: 0,
        definition: 0,
        virtualization: 0,
        range: 0
      };
    },
    methods: {
      applyChanges() {
        // 更新亮度
        const newBrightness = this.brightness + 1.5 * this.topControl - this.bottomControl;
        this.brightness = Math.max(0, newBrightness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('brightness', this.brightness);

        // 更新清晰度
        const newDefinition = this.definition + 2 * this.centralControl - 0.5 * this.lastControl;
        this.definition = Math.max(0, newDefinition.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('definition', this.definition);

        // 更新虚化程度
        const newVirtualization = this.virtualization + 3 * this.topControl;
        this.virtualization = Math.max(0, newVirtualization.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('virtualization', this.virtualization);

        // 更新取景范围
        const newRange = this.range + 2 * this.lastControl;
        this.range = Math.max(0, newRange.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('range', this.range);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.lastControl = 0;
        this.brightness = 0;
        this.definition = 0;
        this.virtualization = 0;
        this.range = 0;

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
  .camera-controller-up {
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
  