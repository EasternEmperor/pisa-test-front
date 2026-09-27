// src/globalMethods.js

// 防止重复获取题目：提交与倒计时同时触发、或快速双击时，
// 多个并发请求会导致页面重复进入同一题（数据中曾出现第7题事件重叠）
let fetchingQuestion = false;

export default {
    install(Vue) {

      // htmlName -> 路由跳转（$getQuestion 与 $getNextQuestion 共用）
      const goPage = (vm, htmlName) => {
              if (htmlName === 'air_controller_t1') {
                vm.$router.push('/questions/air_controller/air_controller_t1');
              } else if (htmlName === 'air_controller_t2') {
                vm.$router.push('/questions/air_controller/air_controller_t2');
              } else if (htmlName === 'air_controller_q3') {
                vm.$router.push('/questions/air_controller/air_controller_q3');
              } else if (htmlName === 'tickets_sale_t1') {
                vm.$router.push('/questions/tickets_sale/tickets_sale_t1');
              } else if (htmlName === 'tickets_sale_t2') {
                vm.$router.push('/questions/tickets_sale/tickets_sale_t2');
              } else if (htmlName === 'tickets_sale_t3') {
                vm.$router.push('/questions/tickets_sale/tickets_sale_t3');
              } else if (htmlName === 'cat_feed_t1') {
                vm.$router.push('/questions/cat_feed/cat_feed_t1');
              } else if (htmlName === 'cat_feed_t2') {
                vm.$router.push('/questions/cat_feed/cat_feed_t2');
              } else if (htmlName === 'cat_feed_q3') {
                vm.$router.push('/questions/cat_feed/cat_feed_q3');
              } else if (htmlName === 'big_air_controller_t1') {
                vm.$router.push('/questions/big_air_controller/big_air_controller_t1');
              } else if (htmlName === 'big_air_controller_t2') {
                vm.$router.push('/questions/big_air_controller/big_air_controller_t2');
              } else if (htmlName === 'big_air_controller_q3') {
                vm.$router.push('/questions/big_air_controller/big_air_controller_q3');
              } else if (htmlName === 'camera_controller_t1') {
                vm.$router.push('/questions/camera_controller/camera_controller_t1');
              } else if (htmlName === 'camera_controller_t2') {
                vm.$router.push('/questions/camera_controller/camera_controller_t2');
              } else if (htmlName === 'camera_controller_q3') {
                vm.$router.push('/questions/camera_controller/camera_controller_q3');
              } else if (htmlName === 'coffee_machine_t1') {
                vm.$router.push('/questions/coffee_machine/coffee_machine_t1');
              } else if (htmlName === 'coffee_machine_t2') {
                vm.$router.push('/questions/coffee_machine/coffee_machine_t2');
              } else if (htmlName === 'coffee_machine_q3') {
                vm.$router.push('/questions/coffee_machine/coffee_machine_q3');
              } else if (htmlName === 'flashlight_t1') {
                vm.$router.push('/questions/flashlight/flashlight_t1');
              } else if (htmlName === 'flashlight_t2') {
                vm.$router.push('/questions/flashlight/flashlight_t2');
              } else if (htmlName === 'flashlight_q3') {
                vm.$router.push('/questions/flashlight/flashlight_q3');
              } else if (htmlName === 'flower_garden_t1') {
                vm.$router.push('/questions/flower_garden/flower_garden_t1');
              } else if (htmlName === 'flower_garden_t2') {
                vm.$router.push('/questions/flower_garden/flower_garden_t2');
              } else if (htmlName === 'flower_garden_q3') {
                vm.$router.push('/questions/flower_garden/flower_garden_q3');
              } else if (htmlName === 'fruit_tea_t1') {
                vm.$router.push('/questions/fruit_tea/fruit_tea_t1');
              } else if (htmlName === 'fruit_tea_t2') {
                vm.$router.push('/questions/fruit_tea/fruit_tea_t2');
              } else if (htmlName === 'fruit_tea_q3') {
                vm.$router.push('/questions/fruit_tea/fruit_tea_q3');
              } else if (htmlName === 'perfume_maker_t1') {
                vm.$router.push('/questions/perfume_maker/perfume_maker_t1');
              } else if (htmlName === 'perfume_maker_t2') {
                vm.$router.push('/questions/perfume_maker/perfume_maker_t2');
              } else if (htmlName === 'perfume_maker_q3') {
                vm.$router.push('/questions/perfume_maker/perfume_maker_q3');
              } else if (htmlName === 'projection_controller_t1') {
                vm.$router.push('/questions/projection_controller/projection_controller_t1');
              } else if (htmlName === 'projection_controller_t2') {
                vm.$router.push('/questions/projection_controller/projection_controller_t2');
              } else if (htmlName === 'projection_controller_q3') {
                vm.$router.push('/questions/projection_controller/projection_controller_q3');
              } else if (htmlName === 'rice_cooker_t1') {
                vm.$router.push('/questions/rice_cooker/rice_cooker_t1');
              } else if (htmlName === 'rice_cooker_t2') {
                vm.$router.push('/questions/rice_cooker/rice_cooker_t2');
              } else if (htmlName === 'rice_cooker_q3') {
                vm.$router.push('/questions/rice_cooker/rice_cooker_q3');
              } else if (htmlName === 'video_player_t1') {
                vm.$router.push('/questions/video_player/video_player_t1');
              } else if (htmlName === 'video_player_t2') {
                vm.$router.push('/questions/video_player/video_player_t2');
              } else if (htmlName === 'video_player_q3') {
                vm.$router.push('/questions/video_player/video_player_q3');
              } else if (htmlName === 'water_dispenser_t1') {
                vm.$router.push('/questions/water_dispenser/water_dispenser_t1');
              } else if (htmlName === 'water_dispenser_t2') {
                vm.$router.push('/questions/water_dispenser/water_dispenser_t2');
              } else if (htmlName === 'water_dispenser_q3') {
                vm.$router.push('/questions/water_dispenser/water_dispenser_q3');
              } else if (htmlName === 'seats_schedule') {
                vm.$router.push('/questions/seats_schedule/seats_schedule');
              } else if (htmlName === 'sunlight_controller_t1') {
                vm.$router.push('/questions/sunlight_controller/sunlight_controller_t1');
              } else if (htmlName === 'sunlight_controller_t2') {
                vm.$router.push('/questions/sunlight_controller/sunlight_controller_t2');
              } else if (htmlName === 'sunlight_controller_q3') {
                vm.$router.push('/questions/sunlight_controller/sunlight_controller_q3');
              } else if (htmlName === 'sauna_controller_t1') {
                vm.$router.push('/questions/sauna_controller/sauna_controller_t1');
              } else if (htmlName ==='sauna_controller_t2') {
                vm.$router.push('/questions/sauna_controller/sauna_controller_t2');
              } else if (htmlName === 'sauna_controller_q3') {
                vm.$router.push('/questions/sauna_controller/sauna_controller_q3');
              } else if (htmlName === 'finished') {
                vm.$router.push('/FinishTest');
              } else {
                this.$message.error('未知的htmlName');
              }
      };
      Vue.prototype.$getQuestion = function(no) {
        if (fetchingQuestion) {
          console.warn('正在跳转下一题，忽略重复请求: no=' + no);
          return;
        }
        fetchingQuestion = true;
        const release = () => { fetchingQuestion = false; };
        this.axios.get('/api/test/getQuestion', { params: { no } })
          .then(response => {
            release();
            if (response.data.code === '0') {
              localStorage.setItem("no", response.data.data.no);
              const { htmlName } = response.data.data;
              goPage(this, htmlName);

            } else {
              this.$message.error(response.data.message || '获取问题失败');
            }
          })
          .catch(error => {
            release();
            console.error(error);
            this.$message.error('获取问题失败');
          });
      };

      // 按当前题目的 htmlName 请求下一题（后端校验当前题已完成，防跳题/防重复）
      Vue.prototype.$getNextQuestion = function(htmlName) {
        if (fetchingQuestion) {
          console.warn('正在跳转下一题，忽略重复请求: ' + htmlName);
          return;
        }
        fetchingQuestion = true;
        const release = () => { fetchingQuestion = false; };
        let info = {};
        try {
          info = JSON.parse(localStorage.getItem('userInfo')) || {};
        } catch (e) {
          info = {};
        }
        this.axios.get('/api/test/getNextQuestion', {
          params: {
            htmlName: htmlName,
            userName: info.userName,
            ithAnswer: localStorage.getItem('ithAnswer')
          }
        })
          .then(response => {
            release();
            if (response.data.code === '0') {
              const data = response.data.data;
              if (data.no !== null && data.no !== undefined) {
                localStorage.setItem("no", data.no);
              }
              goPage(this, data.htmlName);
            } else {
              this.$message.error(response.data.message || '获取下一题失败');
            }
          })
          .catch(error => {
            release();
            console.error(error);
            this.$message.error('获取下一题失败');
          });
      };

      // 查询本次答题的最新进度并跳转（用于重复作答时自动回到最新答题处）
      Vue.prototype.$resumeQuestion = function() {
        if (fetchingQuestion) {
          return;
        }
        fetchingQuestion = true;
        const release = () => { fetchingQuestion = false; };
        let info = {};
        try {
          info = JSON.parse(localStorage.getItem('userInfo')) || {};
        } catch (e) {
          info = {};
        }
        this.axios.get('/api/test/getResumeQuestion', {
          params: {
            userName: info.userName,
            ithAnswer: localStorage.getItem('ithAnswer')
          }
        })
          .then(response => {
            release();
            if (response.data.code === '0') {
              const data = response.data.data;
              if (data.no !== null && data.no !== undefined) {
                localStorage.setItem("no", data.no);
              }
              goPage(this, data.htmlName);
            } else {
              this.$message.error(response.data.message || '获取最新答题位置失败');
            }
          })
          .catch(error => {
            release();
            console.error(error);
            this.$message.error('获取最新答题位置失败');
          });
      };
    }
  };
  