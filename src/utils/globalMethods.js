// src/globalMethods.js
export default {
    install(Vue) {
      Vue.prototype.$getQuestion = function(no) {
        this.axios.get('/api/test/getQuestion', { params: { no } })
          .then(response => {
            if (response.data.code === '0') {
              sessionStorage.setItem("no", response.data.data.no);
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
              } else if (htmlName === 'cat_feed_t1') {
                this.$router.push('/questions/cat_feed/cat_feed_t1');
              } else if (htmlName === 'cat_feed_t2') {
                this.$router.push('/questions/cat_feed/cat_feed_t2');
              } else if (htmlName === 'big_air_controller_t1') {
                this.$router.push('/questions/big_air_controller/big_air_controller_t1');
              } else if (htmlName === 'big_air_controller_t2') {
                this.$router.push('/questions/big_air_controller/big_air_controller_t2');
              } else if (htmlName === 'camera_controller_t1') {
                this.$router.push('/questions/camera_controller/camera_controller_t1');
              } else if (htmlName === 'camera_controller_t2') {
                this.$router.push('/questions/camera_controller/camera_controller_t2');
              } else if (htmlName === 'coffee_machine_t1') {
                this.$router.push('/questions/coffee_machine/coffee_machine_t1');
              } else if (htmlName === 'coffee_machine_t2') {
                this.$router.push('/questions/coffee_machine/coffee_machine_t2');
              } else if (htmlName === 'flashlight_t1') {
                this.$router.push('/questions/flashlight/flashlight_t1');
              } else if (htmlName === 'flashlight_t2') {
                this.$router.push('/questions/flashlight/flashlight_t2');
              } else if (htmlName === 'flower_garden_t1') {
                this.$router.push('/questions/flower_garden/flower_garden_t1');
              } else if (htmlName === 'flower_garden_t2') {
                this.$router.push('/questions/flower_garden/flower_garden_t2');
              } else if (htmlName === 'fruit_tea_t1') {
                this.$router.push('/questions/fruit_tea/fruit_tea_t1');
              } else if (htmlName === 'fruit_tea_t2') {
                this.$router.push('/questions/fruit_tea/fruit_tea_t2');
              } else if (htmlName === 'perfume_maker_t1') {
                this.$router.push('/questions/perfume_maker/perfume_maker_t1');
              } else if (htmlName === 'perfume_maker_t2') {
                this.$router.push('/questions/perfume_maker/perfume_maker_t2');
              } else if (htmlName === 'projection_controller_t1') {
                this.$router.push('/questions/projection_controller/projection_controller_t1');
              } else if (htmlName === 'projection_controller_t2') {
                this.$router.push('/questions/projection_controller/projection_controller_t2');
              } else if (htmlName === 'rice_cooker_t1') {
                this.$router.push('/questions/rice_cooker/rice_cooker_t1');
              } else if (htmlName === 'rice_cooker_t2') {
                this.$router.push('/questions/rice_cooker/rice_cooker_t2');
              } else if (htmlName === 'video_player_t1') {
                this.$router.push('/questions/video_player/video_player_t1');
              } else if (htmlName === 'video_player_t2') {
                this.$router.push('/questions/video_player/video_player_t2');
              } else if (htmlName === 'water_dispenser_t1') {
                this.$router.push('/questions/water_dispenser/water_dispenser_t1');
              } else if (htmlName === 'water_dispenser_t2') {
                this.$router.push('/questions/water_dispenser/water_dispenser_t2');
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
  