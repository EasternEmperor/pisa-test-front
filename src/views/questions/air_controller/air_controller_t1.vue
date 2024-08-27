<template>
    <div class="air-controller-t1">
      <h1>Air Controller Task 1</h1>
      <air-controller-up-component />
    </div>
  </template>
  
  <script>
  // 导入air_controller_up_component组件
  import AirControllerUpComponent from './air_controller_up_component.vue';
  
  export default {
    name: 'AirControllerT1',
    components: {
      AirControllerUpComponent
    }
  };
  </script>
  
  <style scoped>
  .air-controller-t1 {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  h1 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
  }
  </style>
  