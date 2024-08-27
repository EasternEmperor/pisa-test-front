<template>
    <div class="button-component">
      <button @click="$emit('apply')">APPLY</button>
      <img src="@/assets/air_conditioner.png" alt="Air Conditioner" class="air-conditioner-image"/>
      <button @click="$emit('reset')">RESET</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ButtonComponent'
  };
  </script>
  
  <style scoped>
  .button-component {
    text-align: center;
    margin-top: 20px;
  }

  .air-conditioner-image {
    max-width: 50%;
    height: auto;
  }
  
  button {
    width: 100px;
    padding: 10px;
    margin: 0 10px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #1890ff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #40a9ff;
  }
  
  button:last-child {
    background-color: #ff4d4f;
  }
  
  button:last-child:hover {
    background-color: #ff7875;
  }
  </style>
  