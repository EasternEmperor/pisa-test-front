<template>
    <div class="air-controller-t1">
      <!-- 题干部分 -->
      <div class="container-box">
        <air-controller-up-component />
      </div>
  
      <!-- 题目部分 -->
      <div class="container-box question-section">
        <div class="question-text">
          <h3>问题1: 控件作用</h3>
          <p>
            通过改变滑块，弄清楚每个控件控制的是温度还是湿度。<br/>
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
      </div>
    </div>
  </template>
  
  <script>
  import AirControllerUpComponent from './air_controller_up_component.vue';
  
  export default {
    name: 'AirControllerT1',
    components: {
      AirControllerUpComponent,
    },
    data() {
      return {
        selectedControl: null,
        connections: [],
      };
    },
    methods: {
      handleBoxClick(type) {
        if (this.selectedControl) {
          // Check if the connection already exists
          const existingConnection = this.connections.find(
            conn => (conn.start === this.selectedControl && conn.end === type) ||
                    (conn.start === type && conn.end === this.selectedControl)
          );
  
          if (existingConnection) {
            // Remove the connection if it exists
            this.connections = this.connections.filter(
              conn => conn !== existingConnection
            );
          } else {
            // Add a new connection
            this.connections.push({ start: this.selectedControl, end: type });
          }
  
          this.selectedControl = null;
        } else {
          this.selectedControl = type;
        }
  
        this.drawLines();
      },
      drawLines() {
        const svg = this.$refs.svgContainer;
        svg.innerHTML = ''; // Clear existing lines
  
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
      // Initialize the data attributes
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
  