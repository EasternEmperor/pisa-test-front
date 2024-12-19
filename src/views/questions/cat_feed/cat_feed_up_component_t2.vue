<template>
    <div class="cat-feed-up">
      <h2>二、自动喂猫机器</h2>
      <p>
        你的自动喂猫机器年久失修出现问题，需要你通过探索如何使用它来投喂猫咪。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心和底部控制器。每个控制器的初始设置在▲的位置，控制器一次只能调整一格。<br/>
        控制器能够控制自动喂猫机器的食物量和出水量，但三个控制器的对食物量和出水量的具体影响需要你自己探索。<br/>
        在控制器归零时（即▲位置），由于一些故障，自动喂猫机器也可能投喂食物和水。<br/>
        当你设置好控制器后，点击"调控"键，你将在机器的食物量和出水量曲线图中看到自动喂猫机器的任何变化。<br/>
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
        food: 25,
        water: 25,
        applyTimes: 0,
      };
    },
    methods: {
      applyChanges() {
        this.applyTimes++;
        // 更新食物量
        const newFood = this.food + 15 * this.centralControl + 8 * this.bottomControl + 2;
        this.food = Math.max(0, newFood);
        // 更新曲线图
        this.$refs.chartComponent.addData('food', this.food);

        // 更新出水量
        const newWater = this.water + 50 * this.topControl + 20;
        this.water = Math.max(0, newWater);
        // 更新曲线图
        this.$refs.chartComponent.addData('water', this.water);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.food = 25;
        this.water = 25;

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
  