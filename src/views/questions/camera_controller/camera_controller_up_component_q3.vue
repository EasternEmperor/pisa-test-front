<template>
    <div class="camera-controller-up">
      <h2>十三、照相机</h2>
            <p>
        系统经过一段时间运行后，照相机的工作状态发生了变化。<br/>
        系统已将输出值和按钮恢复到本题开始时的状态，并<b>自动试运行了一次</b>（最后一个控制器设为2，其余为0），试运行结果见曲线图。<br/>
        请根据试运行结果，重新调节控制器，用尽可能少的鼠标点击次数，再次使亮度处于15左右、清晰度处于13左右、虚化程度处于13左右、取景范围处于6左右（目标与问题2相同）。<br/>
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
  import ControllerComponent from './componentsT2/ControllerComponentT2.vue';
  import ChartComponent from './componentsT2/ChartComponentT2.vue';
  import ButtonComponent from './componentsT2/ButtonComponentT2.vue';
  
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
        // 照片亮度、清晰度、虚化程度和取景范围
        brightness: 10,
        definition: 10,
        virtualization: 10,
        range: 10,
      };
    },
    methods: {
      // 标准化试运行：复位 -> 按 trial 设置 -> 按新关系运行一次 -> 记录 -> 再次复位
      runTrial() {
        this.resetChanges();
        this.lastControl = 2;
        const settings = { top: 0, central: 0, bottom: 0, last: 2 };
        this.applyChanges();
        const result = { brightness: this.brightness, definition: this.definition, virtualization: this.virtualization, range: this.range };
        this.$emit('trial', { settings, result });
        // 试运行结束后再次复位输出值和按钮，但继续使用Q3新关系
        this.resetChanges();
        this.$emit('resetChanges');
      },
      isTargetReached() {
        return this.brightness >= 13 && this.brightness <= 17 && this.definition >= 11 && this.definition <= 15 && this.virtualization >= 11 && this.virtualization <= 15 && this.range >= 4 && this.range <= 8;
      },
      applyChanges() {
        this.applyTimes++;
        // 更新亮度
        const newBrightness = this.brightness + 1.5 * this.topControl - 2 * this.bottomControl;
        this.brightness = Math.max(0, newBrightness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('brightness', this.brightness);

        // 更新清晰度
        const newDefinition = this.definition + 2 * this.centralControl - 0.5 * this.lastControl;
        this.definition = Math.max(0, newDefinition.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('definition', this.definition);

        // 更新虚化程度
        const newVirtualization = this.virtualization + 1.5 * this.topControl;
        this.virtualization = Math.max(0, newVirtualization.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('virtualization', this.virtualization);

        // 更新取景范围
        const newRange = this.range + 1 * this.lastControl;
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
        this.brightness = 10;
        this.definition = 10;
        this.virtualization = 10;
        this.range = 10;

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
  