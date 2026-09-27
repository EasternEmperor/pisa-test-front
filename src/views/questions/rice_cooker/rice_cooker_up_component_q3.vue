<template>
    <div class="rice-cooker-up">
      <h2>十、二手电饭煲</h2>
            <p>
        系统经过一段时间运行后，电饭煲的工作状态发生了变化。<br/>
        系统已将输出值和按钮恢复到本题开始时的状态，并<b>自动试运行了一次</b>（顶部控制器设为2，其余为0），试运行结果见曲线图。<br/>
        请根据试运行结果，重新调节控制器，用尽可能少的鼠标点击次数，再次使硬度处于12左右、香甜度处于14左右、煮饭时间处于60分钟左右（目标与问题2相同）。<br/>
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
            :hardness="hardness"
            :sweetness="sweetness"
            :cookTime="cookTime"
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
    name: 'RiceCookerUpComponent',
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
        // 米饭硬度、香甜度和煮饭时间
        hardness: 10,
        sweetness: 10,
        cookTime: 100,
      };
    },
    methods: {
      // 标准化试运行：复位 -> 按 trial 设置 -> 按新关系运行一次 -> 记录 -> 再次复位
      runTrial() {
        this.resetChanges();
        this.topControl = 2;
        const settings = { top: 2, central: 0, bottom: 0, last: 0 };
        this.applyChanges();
        const result = { hardness: this.hardness, sweetness: this.sweetness, cookTime: this.cookTime };
        this.$emit('trial', { settings, result });
        // 试运行结束后再次复位输出值和按钮，但继续使用Q3新关系
        this.resetChanges();
        this.$emit('resetChanges');
      },
      isTargetReached() {
        return this.hardness >= 10 && this.hardness <= 14 && this.sweetness >= 12 && this.sweetness <= 16 && this.cookTime >= 50 && this.cookTime <= 70;
      },
      applyChanges() {
        this.applyTimes++;
        // 更新硬度
        const newHardness = this.hardness + 0.5 * this.topControl + this.bottomControl;
        this.hardness = Math.max(0, newHardness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('hardness', this.hardness);

        // 更新香甜度
        const newSweetness = this.sweetness + 1.5 * this.centralControl + 0.5 * this.lastControl;
        this.sweetness = Math.max(0, newSweetness.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('sweetness', this.sweetness);

        // 更新煮饭时间
        const newCookTime = this.cookTime + 10 * this.topControl;
        this.cookTime = Math.max(0, newCookTime.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('cookTime', this.cookTime);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.lastControl = 0;
        this.hardness = 10;
        this.sweetness = 10;
        this.cookTime = 100;

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
  .rice-cooker-up {
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
  