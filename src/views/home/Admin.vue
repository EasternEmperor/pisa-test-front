<template>
    <el-container>
      <el-header class="header-container">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Sidebar @menu-selected="handleMenuSelected" />
        </el-aside>
        <el-main>
          <TabContent ref="tabContent" />
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script>
  import Header from '@/components/Header.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import TabContent from '@/components/TabContent.vue';
  import DescInfo from '@/views/management/DescInfo.vue';
  import UserManagement from '@/views/management/UserManagement.vue';
  import QuestionBankManagement from '@/views/management/QuestionBankManagement.vue';
  import UserDataDisplay from '@/views/management/UserDataDisplay.vue';
  
  export default {
    components: {
      Header,
      Sidebar,
      TabContent
    },
    mounted() {
      // 初始化默认标签
      this.addDefaultTab();
    },
    methods: {
      addDefaultTab() {
        this.$refs.tabContent.addTab('基本数据', 'descInfo', DescInfo);
      },
      handleMenuSelected(key) {
        let label, component;
        switch (key) {
          case 'descInfo':
            label = '基本数据';
            component = DescInfo;
            break;
          case 'userManagement':
            label = '用户管理';
            component = UserManagement;
            break;
          case 'questionBankManagement':
            label = '题库管理';
            component = QuestionBankManagement;
            break;
          case 'userDataDisplay':
            label = '用户数据展示';
            component = UserDataDisplay;
            break;
          default:
            return;
        }
        this.$refs.tabContent.addTab(label, key, component);
      }
    }
  };
  </script>
  
  <style scoped>
  /* .header-container {
    background-color: #409EFF;
  } */
  </style>
  