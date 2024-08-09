<template>
    <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" closable>
      <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
        <component :is="tab.component"></component>
      </el-tab-pane>
    </el-tabs>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activeTab: '', // 默认不选中任何标签
        tabs: []
      };
    },
    methods: {
      addTab(label, name, component) {
        // 检查标签是否已经存在
        if (!this.tabs.find(tab => tab.name === name)) {
          this.tabs.push({ label, name, component });
        }
        this.activeTab = name; // 激活新的标签
      },
      removeTab(targetName) {
        const tabs = this.tabs;
        let activeTab = this.activeTab;
        if (activeTab === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeTab = nextTab.name;
              }
            }
          });
        }
        this.activeTab = activeTab;
        this.tabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  