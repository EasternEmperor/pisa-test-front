<template>
    <div class="sunlight-controller-up">
      <h2>七、阳光照射控制器</h2>
      <p>
        某公司为行动不便的人群开发了一种可调控的阳光房设备，通过配套的控制器，<br/>
        可以将室外的阳光按自己的需求引入到阳光房中，从而使房中的住户可以晒到太阳。<br/>
        由于房主的粗心，控制器的说明书不小心被弄丢了，只剩下控制器。你现在需要知道控制器中的各个按钮分别有什么作用。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心和底部控制器。每个控制器的初始设置在▲的位置，<b>控制器只能逐步一格一格调整。</b><br/>
        控制器能够控制阳光的照射面积、照射时间和照射强度，但三个控制器对照射面积、照射时间和照射强度大小的具体影响需要你自己探索。<br/>
        由于基础设定，在控制器归零时（即▲位置）进行调控，也会调整某些照射参数。<br/>
        当你设置好控制器后，点击"调控"键，你将在照射面积、照射时间和照射强度曲线图中看到阳光照射的任何变化。<br/>
        点击"重置"键，你可以将所有控制器重置到初始设置，照射面积、照射时间和照射强度数字也将变回初始值。鼠标置于曲线图的点上能查看该点的具体值。
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
  import ControllerComponent from './components/ControllerComponent.vue';
  import ChartComponent from './components/ChartComponent.vue';
  import ButtonComponent from './components/ButtonComponent.vue';
  
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
        const newStrength = this.strength + 2 * this.topControl + 0.5;
        this.strength = Math.max(0, newStrength.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('strength', this.strength);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.area = 9;
        this.time = 60;
        this.strength = 10;

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
  