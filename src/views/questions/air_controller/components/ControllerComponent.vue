<template>
  <div class="controller-component">
    <div class="control-item">
      <label for="top-control">Top Control</label>
      <input
        id="top-control"
        type="range"
        min="-2"
        max="2"
        :value="topControl"
        @input="$emit('update:top-control', Number($event.target.value))"
      />
      <div class="control-labels">
        <span>--</span>
        <span>-</span>
        <span>▲</span>
        <span>+</span>
        <span>++</span>
      </div>
    </div>
    <div class="control-item">
      <label for="central-control">Central Control</label>
      <input
        id="central-control"
        type="range"
        min="-2"
        max="2"
        :value="centralControl"
        @input="$emit('update:central-control', Number($event.target.value))"
      />
      <div class="control-labels">
        <span>--</span>
        <span>-</span>
        <span>▲</span>
        <span>+</span>
        <span>++</span>
      </div>
    </div>
    <div class="control-item">
      <label for="bottom-control">Bottom Control</label>
      <input
        id="bottom-control"
        type="range"
        min="-2"
        max="2"
        :value="bottomControl"
        @input="$emit('update:bottom-control', Number($event.target.value))"
      />
      <div class="control-labels">
        <span>--</span>
        <span>-</span>
        <span>▲</span>
        <span>+</span>
        <span>++</span>
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
