<template>
  <div class="seats-schedule-up">
    <h2>十四、座位安排</h2>
    <p>
      今天是小明的生日，父母帮小明准备了生日聚会，小明邀请了7位好朋友参加他的聚会，现在小明需要安排每个朋友的座位。<br/>
      下面的图简单地呈现了餐桌和椅子的位置。小明的座位已经确定了，在小明座位确定的情况下，其他7位朋友的座位需要满足以下9个条件（千万要注意否定词和肯定词）：<br/>
      <span class="numbered-condition">（1）小花和小明要坐在一起（也就是这两个人挨着坐）；</span>
      <span class="numbered-condition">（2）小白和小贝要坐在一起；</span>
      <span class="numbered-condition">（3）小可要么和小丽坐一起，要么和小兰坐在一起；</span>
      <span class="numbered-condition">（4）小亮要和小丽坐在一起；</span>
      <span class="numbered-condition">（5）小花和小明两个人不和小白或小贝挨着坐；</span>
      <span class="numbered-condition">（6）小白不和小可或小亮挨着坐；</span>
      <span class="numbered-condition">（7）小丽和小兰不坐在一起；</span>
      <span class="numbered-condition">（8）小明既不跟小丽坐一起，也不跟小兰坐一起；</span>
      <span class="numbered-condition">（9）小花不跟小可坐一起。</span>
      提示：在点击"确定"按钮之前，可以进行任意座位安排的尝试。如将用鼠标左键点击并且一直按住图中右边的"小花"方框，<br/>
      然后把它拖放到左边圆桌周围的其中一个小方块当中，也可以将"小花"从小方块当中移出来，此时小花会自动回到右边最初的位置。
    </p>
    <div class="control-and-chart">
      <div class="flex-container">
        <seats-schedule-diagram
          @applyChanges="applyChanges"
          @resetChanges="resetChanges"
          @submitChanges="submitChanges"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SeatsScheduleDiagram from './seats_schedule_diagram.vue';

export default {
  name: 'SeatsScheduleUp',
  components: {
    SeatsScheduleDiagram,
  },
  data() {
    return {
      
    };
  },
  methods: {
    applyChanges({ diagramState, choosePool }) {

      this.$emit('applyChanges', { diagramState, choosePool });
    },
    resetChanges({ diagramState, choosePool }) {

      this.$emit('resetChanges', { diagramState, choosePool });
    },
    submitChanges({ diagramState, choosePool }) {

      this.$emit('submitChanges', { diagramState, choosePool });
    }
  }
};
</script>

<style scoped>
.seats-schedule-up {
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

.numbered-condition {
  display: block;
  text-align: left;
  margin-left: 40em;
  text-indent: -2em;
}
</style>