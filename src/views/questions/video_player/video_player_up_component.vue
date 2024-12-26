<template>
    <div class="video-player-up">
      <h2>六、视频播放器</h2>
      <p>
        你的视频播放器年久失修出现故障，需要你通过探索来学习如何使用它播放视频。<br/>
        你可以使用左侧的滑块（-o-）更改顶部、中心和底部控制器。每个控制器的初始设置在▲的位置，<b>控制器只能逐步一格一格调整。</b><br/>
        控制器能够控制视频播放器的播放速度、音量和画质，但三个控制器对播放速度、音量和画质大小的具体影响需要你自己探索。<br/>
        由于基础设定，在控制器归零时（即▲位置）进行调控，视频播放器也会改变某些播放条件。<br/>
        当你设置好控制器后，点击"调控"键，你将在播放速度、音量和画质曲线图中看到视频播放器的任何变化。鼠标置于曲线图的点上能查看该点的具体值。<br/>
        点击"重置"键，你可以将所有控制器重置到初始设置，播放速度、音量和画质数字也将变回初始值。
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
          :speed="speed"
          :volume="volume"
          :quality="quality"
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
    name: 'VideoPlayerUpComponent',
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
        // 播放速度、音量和画质
        speed: 1,
        volume: 20,
        quality: 0.4,
      };
    },
    methods: {
      applyChanges() {
        // 更新播放速度
        const newSpeed = this.speed + 1.5 * this.bottomControl + 0.25;
        this.speed = Math.max(0, newSpeed.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('speed', this.speed);

        // 更新音量
        const newVolume = this.volume + 20 * this.topControl;
        this.volume = Math.max(0, newVolume.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('volume', this.volume);

        // 更新画质
        const newQuality = this.quality + 0.5 * this.centralControl + 0.1;
        this.quality = Math.max(0, newQuality.toFixed(2));
        // 更新曲线图
        this.$refs.chartComponent.addData('quality', this.quality);

        this.$emit('applyChanges');
      },
      resetChanges() {
        this.topControl = 0;
        this.centralControl = 0;
        this.bottomControl = 0;
        this.speed = 1;
        this.volume = 20;
        this.quality = 0.4;

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
  .video-player-up {
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
  