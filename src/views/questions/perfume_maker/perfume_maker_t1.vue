<template>
    <div class="perfume-maker-t1">
      <!-- 使用 Header 组件 -->
      <header-component :userName="userName" />

      <!-- 题干部分 -->
      <div class="container-box">
        <perfume-maker-up-component ref="upComponentRef" @applyChanges="handleApply" @resetChanges="handleReset" @control="handleControl"/>
      </div>
  
      <!-- 题目部分 -->
      <div class="container-box question-section">
        <div class="question-text">
          <h3>问题1: 控制器功能</h3>
          <p>
            通过改变滑块并调控，弄清楚每个控制器控制着浓度和留存时间中的哪些因素。<br/>
            你可以通过"重置"键来重置所有组件。<br/>
            在下方将控制器和你认为其控制的对象连上线。<br/>
            <b>连线的操作是</b>：点击一个控制器方块，然后点击另一个浓度/留存时间方块。<br/>
            <b>取消方块选择</b>：再次点击已选中的方块即可取消选择。<br/>
            <b>取消连线</b>：分别点击已连线的两个方块可取消它们之间的连线。
          </p>
        </div>
        <div class="diagram-section">
          <svg class="lines-svg" ref="svgContainer"></svg>
          <div class="controls-column">
            <div
              class="control-box"
              :class="{ 'selected-box': selectedControl === 'top' }"
              @click="handleBoxClick('top')"
            >
              顶部控制器
            </div>
            <div
              class="control-box"
              :class="{ 'selected-box': selectedControl === 'central' }"
              @click="handleBoxClick('central')"
            >
              中间控制器
            </div>
            <div
              class="control-box"
              :class="{ 'selected-box': selectedControl === 'bottom' }"
              @click="handleBoxClick('bottom')"
            >
              底部控制器
            </div>
          </div>
          <div class="influences-column">
            <div
              class="influence-box"
              :class="{ 'selected-box': selectedControl === 'concentration' }"
              @click="handleBoxClick('concentration')"
            >
              浓度
            </div>
            <div
              class="influence-box"
              :class="{ 'selected-box': selectedControl === 'lastTime' }"
              @click="handleBoxClick('lastTime')"
            >
              留存时间
            </div>
          </div>
        </div>
        <el-row style="margin-top: 20px;" type="flex" justify="center">
          <el-button type="primary" @click="submitAnswer">提交</el-button>
        </el-row>
      </div>

    </div>
  </template>
  
  <script>
  import PerfumeMakerUpComponent from './perfume_maker_up_component.vue';
  import HeaderComponent from '@/components/Header.vue';
  
  export default {
    name: 'PerfumeMakerT1',
    components: {
      PerfumeMakerUpComponent,
      HeaderComponent,
    },
    data() {
      return {
        userName: '',
        ithAnswer: -1,
        no: -1,
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
      checkAnswer() {
        // 判断 connections 中是否包含 start 为 'top', 'central', 'bottom' 的元素
        const hasTop = this.connections.some(conn => conn.start === 'top');
        const hasCentral = this.connections.some(conn => conn.start === 'central');
        const hasBottom = this.connections.some(conn => conn.start === 'bottom');
        
        return hasTop && hasCentral && hasBottom;
      },
      submitAnswer() {
        // if (this.checkAnswer()) {
        //     this.sendEvent('submit');
        //     this.$message({
        //         message: "提交成功，进入下一题～",
        //         type: "success",
        //     });
        //     this.$getQuestion(this.no + 1);
        // } else {
        //     this.$message({
        //         message: "请完成连线作答再提交！",
        //         type: "warning",
        //     });
        // }
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
      handleControl(control) {
        this.sendEvent('control');
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
            if (this.isInfluence(this.selectedControl)) {
              this.connections.push({ start: type, end: this.selectedControl });
            } else {
              this.connections.push({ start: this.selectedControl, end: type });
            }
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
          htmlName: 'perfume_maker_t1',
          userName: userName,
          ithAnswer: ithAnswer,
          event: 'ACER_EVENT',
          eventType: eventType,
          eventStartTime: new Date().toISOString(),
          eventNumber: this.eventNumber,
          topSetting: "NULL",
          centralSetting: "NULL",
          bottomSetting: "NULL",
          concentrationValue: "NULL",
          lastTimeValue: "NULL",
          diagramState: "NULL",
          network: null,
          fareType: null,
          ticketType: null,
          numberTrips: null,
        };

        if (eventType === 'control') {
          const upComponent = this.$refs.upComponentRef;
          data.topSetting = upComponent.topControl.toString();
          data.centralSetting = upComponent.centralControl.toString();
          data.bottomSetting = upComponent.bottomControl.toString();
        } else if (eventType === 'reset' || eventType === 'apply') {
          const upComponent = this.$refs.upComponentRef;
          data.topSetting = upComponent.topControl.toString();
          data.centralSetting = upComponent.centralControl.toString();
          data.bottomSetting = upComponent.bottomControl.toString();
          data.concentrationValue = upComponent.concentration.toString();
          data.lastTimeValue = upComponent.lastTime.toString();
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
        return ['concentration', 'lastTime'].includes(type);
      },
      getDiagramState() {
        const state = this.connections.map(conn => {
            const start = conn.start === 'top' ? 'top' : conn.start === 'central' ? 'central' : 'bottom';
            const end = conn.end === 'concentration' ? 'concentration' : 'lastTime';
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

          // 根据元素相对位置，决定连线从哪条边出发
          const startX = startRect.left > endRect.left
            ? startRect.left - svgRect.left // 如果 start 在 end 右边，从 start 的左边出发
            : startRect.right - svgRect.left; // 否则，从 start 的右边出发

          const startY = startRect.top > endRect.top
            ? startRect.top + startRect.height / 2 - svgRect.top // 从 start 的中间靠上部分
            : startRect.bottom - startRect.height / 2 - svgRect.top;

          const endX = endRect.left > startRect.left
            ? endRect.left - svgRect.left // 如果 end 在 start 右边，从 end 的左边出发
            : endRect.right - svgRect.left; // 否则，从 end 的右边出发

          const endY = endRect.top > startRect.top
            ? endRect.top + endRect.height / 2 - svgRect.top // 从 end 的中间靠上部分
            : endRect.bottom - endRect.height / 2 - svgRect.top;

          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', startX);
          line.setAttribute('y1', startY);
          line.setAttribute('x2', endX);
          line.setAttribute('y2', endY);
          line.setAttribute('stroke', 'black');
          line.setAttribute('stroke-width', '2');

          svg.appendChild(line);
        });
      },
      preventBack() {
        // 阻止用户后退
        history.pushState(null, null, location.href);
        this.$message({
          message: "不能返回上一题，请点击提交或继续答题！",
          type: "warning",
        });
      },
      initPreventBack() {
        // 初始化防止后退逻辑
        history.pushState(null, null, location.href); // 首次向历史记录栈添加当前页面
        window.addEventListener('popstate', this.preventBack); // 监听后退事件
      }
    },
    mounted() {
      // 开始答题
      this.startAnswer();
      // 初始化防止后退
      this.initPreventBack();
      // 初始化 data-type 属性
      this.$el.querySelectorAll('.control-box').forEach(el => {
        let text = el.textContent.trim();
        text = text.replace('顶部', 'top').replace('中间', 'central').replace('底部', 'bottom');
        el.setAttribute('data-type', text.toLowerCase().replace('控制器', ''));
      });
      this.$el.querySelectorAll('.influence-box').forEach(el => {
        let text = el.textContent.trim();
        text = text.replace('浓度', 'concentration').replace('留存时间', 'lastTime');
        el.setAttribute('data-type', text);
      });
    },
    beforeDestroy() {
      window.removeEventListener('popstate', this.preventBack);
    }
  };
  </script>
  
  <style scoped>
  .perfume-maker-t1 {
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

  .selected-box {
    background-color: #007bff; /* 蓝色背景 */
    color: white; /* 改变文字颜色以便在蓝色背景上显示清晰 */
  }
  </style>
  