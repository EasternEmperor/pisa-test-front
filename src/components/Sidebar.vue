<template>
    <el-aside width="200px">
      <el-menu :default-active="activeMenu" @select="handleSelect">
        <el-menu-item index="userManagement">用户管理</el-menu-item>
        <el-menu-item index="questionBankManagement">题库管理</el-menu-item>
        <el-menu-item index="userDataDisplay">用户数据展示</el-menu-item>
      </el-menu>
    </el-aside>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activeMenu: 'userManagement'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        this.$emit('menu-selected', key);
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  