// src/globalMethods.js
export default {
    install(Vue) {
      Vue.prototype.$getQuestion = function(no) {
        sessionStorage.setItem("no", no);
        this.axios.get('/api/test/getQuestion', { params: { no } })
          .then(response => {
            if (response.data.code === '0') {
              const { htmlName } = response.data.data;
              if (htmlName === 'air_controller_t1') {
                this.$router.push('/questions/air_controller/air_controller_t1');
              } else if (htmlName === 'air_controller_t2') {
                this.$router.push('/questions/air_controller/air_controller_t2');
              } else if (htmlName === 'tickets_sale_t1') {
                this.$router.push('/questions/tickets_sale/tickets_sale_t1');
              } else if (htmlName === 'tickets_sale_t2') {
                this.$router.push('/questions/tickets_sale/tickets_sale_t2');
              } else if (htmlName === 'tickets_sale_t3') {
                this.$router.push('/questions/tickets_sale/tickets_sale_t3');
              } else if (htmlName === 'finished') {
                this.$router.push('/FinishTest');
              } else {
                this.$message.error('未知的htmlName');
              }
            } else {
              this.$message.error(response.data.message || '获取问题失败');
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('获取问题失败');
          });
      };
    }
  };
  