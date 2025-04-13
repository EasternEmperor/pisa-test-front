<template>
  <div class="controller-component">
    <div class="control-item">
      <label for="top-control">顶部控制器</label>
      <input
        id="top-control"
        type="range"
        min="-2"
        max="2"
        :value="topControl"
        @input="handleTop(Number($event.target.value))"
      />
      <div class="control-labels">
        <span>-2</span>
        <span>-1</span>
        <span>▲</span>
        <span>1</span>
        <span>2</span>
      </div>
    </div>
    <div class="control-item">
      <label for="central-control">中间控制器</label>
      <input
        id="central-control"
        type="range"
        min="-2"
        max="2"
        :value="centralControl"
        @input="handleCentral(Number($event.target.value))"
      />
      <div class="control-labels">
        <span>-2</span>
        <span>-1</span>
        <span>▲</span>
        <span>1</span>
        <span>2</span>
      </div>
    </div>
    <div class="control-item">
      <label for="bottom-control">底部控制器</label>
      <input
        id="bottom-control"
        type="range"
        min="-2"
        max="2"
        :value="bottomControl"
        @input="handleBottom(Number($event.target.value))"
      />
      <div class="control-labels">
        <span>-2</span>
        <span>-1</span>
        <span>▲</span>
        <span>1</span>
        <span>2</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControllerComponent',
  props: {
    topControl: {
      type: Number,
      default: 0
    },
    centralControl: {
      type: Number,
      default: 0
    },
    bottomControl: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleTop(value) {
      const currentValue = this.topControl;

      // 计算差值
      const diff = value - currentValue;

      // 如果差值绝对值大于1，自动调整到最近的位置
      if (Math.abs(diff) > 1) {
        const adjustedValue = currentValue + Math.sign(diff); // 调整为最近值
        this.topControl = adjustedValue;
        this.$emit(`update:top-control`, adjustedValue);
      } else {
        // 合法调整
        this.topControl = value;
        this.$emit(`update:top-control`, value);
      }
    },
    handleCentral(value) {
      const currentValue = this.centralControl;

      const diff = value - currentValue;

      if (Math.abs(diff) > 1) {
        const adjustedValue = currentValue + Math.sign(diff);
        this.centralControl = adjustedValue;
        this.$emit(`update:central-control`, adjustedValue);
      } else {
        this.centralControl = value;
        this.$emit(`update:central-control`, value);
      }
    },
    handleBottom(value) {
      const currentValue = this.bottomControl;

      const diff = value - currentValue;

      if (Math.abs(diff) > 1) {
        const adjustedValue = currentValue + Math.sign(diff);
        this.bottomControl = adjustedValue;
        this.$emit(`update:bottom-control`, adjustedValue);
      } else {
        this.bottomControl = value;
        this.$emit(`update:bottom-control`, value);
      }
    }
  }
};
</script>

<style scoped>
.controller-component {
  width: 45%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.control-item {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
}

.control-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 18px; /* 增大字体 */
  font-weight: bold; /* 加粗字体 */
}
</style>
