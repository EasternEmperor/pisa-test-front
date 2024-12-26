<template>
    <div class="cat-feed-up">
      <h2>二、自动喂猫机器</h2>
      <p>
        你的自动喂猫机器年久失修出现问题，需要你通过探索如何使用它来投喂猫咪。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心和底部控制器。每个控制器的初始设置在▲的位置，<b>控制器只能逐步一格一格调整。</b><br/>
        控制器能够控制自动喂猫机器的食物量和出水量，但三个控制器的对食物量和出水量的具体影响需要你自己探索。<br/>
        由于一些故障，在控制器归零时（即▲位置）点击调控后，自动喂猫机器也会调整某些投喂条件。<br/>
        当你设置好控制器后，点击"调控"键，你将在机器的食物量和出水量曲线图中看到自动喂猫机器的任何变化。<br/>
        点击"重置"键，你可以将所有控制器重置到初始设置，食物量和出水量曲线图也将变回初始值。<br/>
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
  import ControllerComponent from './components/ControllerComponent.vue';
  import ChartComponent from './components/ChartComponent.vue';
  import ButtonComponent from './components/ButtonComponent.vue';
  
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
        // 食物量和出水量
        food: 25,
        water: 25,
        applyTimes: 0
      };
    },
    methods: {
      applyChanges() {
        this.applyTimes++;
        // 更新食物量
        const newFood = this.food + 15 * this.centralControl + 8 * this.bottomControl + 2;
        this.food = Math.max(0, newFood.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('food', this.food);

        // 更新出水量
        const newWater = this.water + 50 * this.topControl + 20;
        this.water = Math.max(0, newWater.toFixed(2));
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
  