<template>
    <div class="cat-feed-up">
      <h2>二、自动喂猫机器</h2>
      <p>
        系统经过一段时间运行后，自动喂猫机器的工作状态发生了变化。<br/>
        系统已将输出值和按钮恢复到本题开始时的状态，并<b>自动试运行了一次</b>（顶部控制器设为1，其余为0），试运行结果见曲线图。<br/>
        请根据试运行结果，重新调节控制器，用尽可能少的鼠标点击次数，再次使<b>食物量处于35-40之间、出水量处于200-250毫升之间</b>（目标与问题2相同）。<br/>
        达到目标并点击提交后，请判断系统发生了什么变化。
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
            :food="food"
            :water="water"
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
    name: 'CatFeedUpComponent',
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
        // 食物和出水值
        food: 55,
        water: 100,
        applyTimes: 0,
      };
    },
    methods: {
      // 标准化试运行：复位 -> 顶部=1 -> 按新关系运行一次 -> 记录 -> 再次复位
      runTrial() {
        this.resetChanges();
        this.topControl = 1;
        this.centralControl = 0;
        this.bottomControl = 0;
        const settings = { top: 1, central: 0, bottom: 0 };
        this.applyChanges();
        const result = { food: this.food, water: this.water };
        this.$emit('trial', { settings, result });
        // 试运行结束后再次复位输出值和按钮，但继续使用Q3新关系
        this.resetChanges();
        this.$emit('resetChanges');
      },
      isTargetReached() {
        return this.food >= 35 && this.food <= 40 && this.water >= 200 && this.water <= 250;
      },
      applyChanges() {
        this.applyTimes++;
        // 更新食物量
        const newFood = this.food + 4 * this.centralControl + 2 * this.bottomControl;
        this.food = Math.max(0, newFood.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('food', this.food);

        // 更新出水量（Q3新关系：顶部控制器的作用强度减半，40 -> 20）
        const newWater = this.water + 20 * this.topControl;
        this.water = Math.max(0, newWater.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('water', this.water);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.food = 55;
        this.water = 100;

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
  .cat-feed-up {
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
  