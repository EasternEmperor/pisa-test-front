<template>
    <div class="air-controller-t2">
      <!-- 使用 Header 组件 -->
      <header-component :userName="userName" />

      <!-- 题干部分 -->
      <div class="container-box">
        <air-controller-up-component ref="upComponentRef" @applyChanges="handleApply" @resetChanges="handleReset" />
      </div>
  
      <!-- 题目部分 -->
      <div class="container-box question-section">
        <div class="question-text">
          <h3>问题2: 调控温度和湿度</h3>
          <p>
            三个控件及其控制的对象如下图连线所示。<br/>
            灵活运用控件，将温度和湿度调整到目标数值。目标数值如温度/湿度计下方所示。<br/>
            你最多能 <b>APPLY</b> 4次，且没有RESET按钮可供使用。<br/>
          </p>
        </div>
        <div class="diagram-section">
          <svg class="lines-svg" ref="svgContainer"></svg>
          <div class="controls-column">
            <div class="control-box" >Top Control</div>
            <div class="control-box" >Central Control</div>
            <div class="control-box" >Bottom Control</div>
          </div>
          <div class="influences-column">
            <div class="influence-box" >Temperature</div>
            <div class="influence-box" >Humidity</div>
          </div>
        </div>
        <el-row style="margin-top: 20px;" type="flex" justify="center">
          <el-button type="primary" @click="submitAnswer">提交</el-button>
        </el-row>
      </div>

    </div>
  </template>
  
  <script>
  import AirControllerUpComponent from './air_controller_up_component_t2.vue';
  import HeaderComponent from '@/components/Header.vue';
  
  export default {
    name: 'AirControllerT1',
    components: {
      AirControllerUpComponent,
      HeaderComponent,
    },
    data() {
      return {
        userName: '',
        ithAnswer: -1,
        selectedControl: null,
        connections: [],
        eventNumber: 1, // 用于记录事件次数
      };
    },
    created() {
        this.userName = JSON.parse(sessionStorage.getItem('userInfo')).userName;
        this.ithAnswer = sessionStorage.getItem('ithAnswer');
        this.no = parseInt(sessionStorage.getItem('no'));
    },
    methods: {
      drawExample() {
        this.handleBoxClick('top');
        this.handleBoxClick('temperature');
        this.handleBoxClick('central');
        this.handleBoxClick('humidity');
        this.handleBoxClick('bottom');
        this.handleBoxClick('humidity');
      },
      startAnswer() {
        this.sendEvent('start');
      },
      submitAnswer() {
        this.sendEvent('submit');
        this.$message({
          message: "提交成功，进入下一题～",
          type: "success",
        });
        this.$getQuestion(this.no + 1);
      },
      handleApply() {
        this.sendEvent('apply');
      },
      handleReset() {
        this.sendEvent('reset');
      },
      handleBoxClick(type) {
        if (this.selectedControl) {
          if ((this.isControl(this.selectedControl) && this.isControl(type)) || 
              (this.isInfluence(this.selectedControl) && this.isInfluence(type))) {
            this.selectedControl = null;  // 重置选择，避免错误连线
            return;
          }
  
          const existingConnection = this.connections.find(
            conn => (conn.start === this.selectedControl && conn.end === type) ||
                    (conn.start === type && conn.end === this.selectedControl)
          );
  
          if (existingConnection) {
            this.connections = this.connections.filter(
              conn => conn !== existingConnection
            );
          } else {
            this.connections.push({ start: this.selectedControl, end: type });
          }
  
          this.selectedControl = null;
          this.drawLines();
  
        //   this.sendEvent('diagram');
        } else {
          this.selectedControl = type;
        }
      },
      sendEvent(eventType) {
        const userName = this.userName;
        const ithAnswer = this.ithAnswer;
  
        const data = {
          tableName: 1,
          htmlName: 'air_controller_t2',
          userName: userName,
          ithAnswer: ithAnswer,
          event: 'ACER_EVENT',
          eventType: eventType,
          eventStartTime: new Date().toISOString(),
          eventNumber: this.eventNumber,
          topSetting: "NULL",
          centralSetting: "NULL",
          bottomSetting: "NULL",
          tempValue: "NULL",
          humidValue: "NULL",
          diagramState: "NULL",
          network: null,
          fareType: null,
          ticketType: null,
          numberTrips: null,
        };

        if (eventType === 'reset' || eventType === 'apply') {
          const upComponent = this.$refs.upComponentRef;
          data.topSetting = upComponent.topControl.toString();
          data.centralSetting = upComponent.centralControl.toString();
          data.bottomSetting = upComponent.bottomControl.toString();
          data.tempValue = upComponent.temperature.toString();
          data.humidValue = upComponent.humidity.toString();
        } else if (eventType === 'diagram') {
          data.diagramState = this.getDiagramState();
        } else if (eventType === 'start') {
          data.event = 'START_ITEM';
          data.eventType = 'NULL';
        } else if (eventType === 'submit') {
          data.event = 'END_ITEM';
          data.eventType = 'NULL';
        } else {
          console.error('未知的动作！');
          return;
        }
  
        this.axios.post('/api/test/exploreData', data)
          .then(response => {
            if (response.data.code === '0') {
                this.eventNumber++;
            }
          })
          .catch(error => {
            console.error('刚才的操作失效，请重新操作！', error);
          });
      },
      isControl(type) {
        return ['top', 'central', 'bottom'].includes(type);
      },
      isInfluence(type) {
        return ['temperature', 'humidity'].includes(type);
      },
      getDiagramState() {
        const state = this.connections.map(conn => {
            const start = conn.start === 'top' ? 'top' : conn.start === 'central' ? 'central' : 'bottom';
            const end = conn.end === 'temperature' ? 'temp' : 'humid';
            return `${start}->${end}`;
        }).join(', ');
        return state;
      },
      drawLines() {
        const svg = this.$refs.svgContainer;
        svg.innerHTML = ''; // 清除现有连线
  
        this.connections.forEach(connection => {
          const startElement = this.$el.querySelector(`[data-type=${connection.start}]`);
          const endElement = this.$el.querySelector(`[data-type=${connection.end}]`);
  
          const startRect = startElement.getBoundingClientRect();
          const endRect = endElement.getBoundingClientRect();
  
          const svgRect = svg.getBoundingClientRect();
  
          const startX = startRect.left + startRect.width / 2 - svgRect.left;
          const startY = startRect.top + startRect.height / 2 - svgRect.top;
  
          const endX = endRect.left + endRect.width / 2 - svgRect.left;
          const endY = endRect.top + endRect.height / 2 - svgRect.top;
  
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', startX);
          line.setAttribute('y1', startY);
          line.setAttribute('x2', endX);
          line.setAttribute('y2', endY);
          line.setAttribute('stroke', 'black');
          line.setAttribute('stroke-width', '2');
  
          svg.appendChild(line);
        });
      }
    },
    mounted() {
      // 开始答题
      this.startAnswer();
      // 初始化 data-type 属性
      this.$el.querySelectorAll('.control-box').forEach(el => {
        el.setAttribute('data-type', el.textContent.trim().toLowerCase().replace(' control', ''));
      });
  
      this.$el.querySelectorAll('.influence-box').forEach(el => {
        el.setAttribute('data-type', el.textContent.trim().toLowerCase());
      });
      // 画线
      this.drawExample();
    }
  };
  </script>
  
  <style scoped>
  .air-controller-t1 {
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }
  
  .container-box {
    border: 2px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .question-section {
    display: flex;
    flex-direction: column;
  }
  
  .question-text {
    margin-bottom: 20px;
  }
  
  .diagram-section {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    gap: 50px;
  }
  
  .lines-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }
  
  .controls-column,
  .influences-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .control-box,
  .influence-box {
    width: 150px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e0e0;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    z-index: 1;
  }
  
  .control-box:hover,
  .influence-box:hover {
    background-color: #d0d0d0;
  }
  </style>
  