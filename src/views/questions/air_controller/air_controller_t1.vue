<template>
    <div class="air-controller-t1">
      <!-- 使用 Header 组件 -->
      <header-component :userName="userName" />

      <!-- 题干部分 -->
      <div class="container-box">
        <air-controller-up-component ref="upComponentRef" @applyChanges="handleApply" @resetChanges="handleReset" />
      </div>
  
      <!-- 题目部分 -->
      <div class="container-box question-section">
        <div class="question-text">
          <h3>问题1: 控件作用</h3>
          <p>
            通过改变滑块并应用，弄清楚每个控件控制的是温度还是湿度。<br/>
            你可以通过"RESET"键来重置所有组件。<br/>
            在下方将你认为控件对应控制的对象连上线。<br/>
            连线的操作是：点击一个控件，然后点击另一个温度/湿度键。分别点击已连线的两个方块可取消它们之间的连线。
          </p>
        </div>
        <div class="diagram-section">
          <svg class="lines-svg" ref="svgContainer"></svg>
          <div class="controls-column">
            <div class="control-box" @click="handleBoxClick('top')">Top Control</div>
            <div class="control-box" @click="handleBoxClick('central')">Central Control</div>
            <div class="control-box" @click="handleBoxClick('bottom')">Bottom Control</div>
          </div>
          <div class="influences-column">
            <div class="influence-box" @click="handleBoxClick('temperature')">Temperature</div>
            <div class="influence-box" @click="handleBoxClick('humidity')">Humidity</div>
          </div>
        </div>
        <el-row style="margin-top: 20px;" type="flex" justify="center">
          <el-button type="primary" @click="submitAnswer">提交</el-button>
        </el-row>
      </div>

    </div>
  </template>
  
  <script>
  import AirControllerUpComponent from './air_controller_up_component.vue';
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
      startAnswer() {
        this.sendEvent('start');
      },
      submitAnswer() {
        this.sendEvent('submit');
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
  
          this.sendEvent('diagram');
        } else {
          this.selectedControl = type;
        }
      },
      sendEvent(eventType) {
        const userName = this.userName;
        const ithAnswer = this.ithAnswer;
  
        const data = {
          tableName: 1,
          htmlName: 'air_controller_t1',
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
  