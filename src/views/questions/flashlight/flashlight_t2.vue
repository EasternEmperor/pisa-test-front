<template>
    <div class="flashlight-t2">
      <!-- 使用 Header 组件 -->
      <header-component :userName="userName" />

      <!-- 题干部分 -->
      <div class="container-box">
        <flashlight-up-component ref="upComponentRef" @applyChanges="handleApply" @resetChanges="handleReset" @control="handleControl"/>
      </div>
  
      <!-- 题目部分 -->
      <div class="container-box question-section">
        <div class="question-text">
          <h3>问题2: 调控照射距离、亮度和照射范围</h3>
          <p>
            三个控制器及其控制的对象如下图连线所示。<br/>
            灵活运用控制器，将照射距离、亮度和照射范围调整到目标数值。目标数值如<b>曲线图上方所示。</b><br/>
            你需要在尽可能少的鼠标点击次数中完成目标，且没有重置按钮可供使用。
          </p>
        </div>
        <div class="diagram-section">
          <svg class="lines-svg" ref="svgContainer"></svg>
          <div class="controls-column">
            <div class="control-box" >顶部控制器</div>
            <div class="control-box" >中间控制器</div>
            <div class="control-box" >底部控制器</div>
            <div class="control-box" >横条控制器</div>
          </div>
          <div class="influences-column">
            <div class="influence-box" >照射距离</div>
            <div class="influence-box" >亮度</div>
            <div class="influence-box" >照射范围</div>
          </div>
        </div>
        <el-row style="margin-top: 20px;" type="flex" justify="center">
          <el-button type="primary" @click="submitAnswer">提交</el-button>
        </el-row>
      </div>

    </div>
  </template>
  
  <script>
  import FlashlightUpComponent from './flashlight_up_component_t2.vue';
  import HeaderComponent from '@/components/Header.vue';
  
  export default {
    name: 'FlashlightT2',
    components: {
      FlashlightUpComponent,
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
        this.handleBoxClick('distance');
        this.handleBoxClick('central');
        this.handleBoxClick('distance');
        this.handleBoxClick('central');
        this.handleBoxClick('brightness');
        this.handleBoxClick('bottom');
        this.handleBoxClick('distance');
        this.handleBoxClick('bottom');
        this.handleBoxClick('brightness');
        this.handleBoxClick('last');
        this.handleBoxClick('brightness');
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
          htmlName: 'flashlight_t2',
          userName: userName,
          ithAnswer: ithAnswer,
          event: 'ACER_EVENT',
          eventType: eventType,
          eventStartTime: new Date().toISOString(),
          eventNumber: this.eventNumber,
          topSetting: "NULL",
          centralSetting: "NULL",
          bottomSetting: "NULL",
          lastSetting: "NULL",
          distanceValue: "NULL",
          brightnessValue: "NULL",
          areaValue: "NULL",
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
          data.lastSetting = upComponent.lastControl.toString();
        } else if (eventType === 'reset' || eventType === 'apply') {
          const upComponent = this.$refs.upComponentRef;
          data.topSetting = upComponent.topControl.toString();
          data.centralSetting = upComponent.centralControl.toString();
          data.bottomSetting = upComponent.bottomControl.toString();
          data.lastSetting = upComponent.lastControl.toString();
          data.distanceValue = upComponent.distance.toString();
          data.brightnessValue = upComponent.brightness.toString();
          data.areaValue = upComponent.area.toString();
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
        return ['top', 'central', 'bottom', 'last'].includes(type);
      },
      isInfluence(type) {
        return ['distance', 'brightness', 'area'].includes(type);
      },
      getDiagramState() {
        const state = this.connections.map(conn => {
            const start = conn.start === 'top' ? 'top' : conn.start === 'central' ? 'central' : conn.start === 'bottom' ? 'bottom' : 'last';
            const end = conn.end === 'distance' ? 'distance' : conn.end === 'brightness' ? 'brightness' : 'area';
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
        text = text.replace('顶部', 'top').replace('中间', 'central').replace('底部', 'bottom').replace('横条', 'last');
        el.setAttribute('data-type', text.toLowerCase().replace('控制器', ''));
      });
      this.$el.querySelectorAll('.influence-box').forEach(el => {
        let text = el.textContent.trim();
        text = text.replace('照射距离', 'distance').replace('亮度', 'brightness').replace('照射范围', 'area');
        el.setAttribute('data-type', text);
      });
      // 画线
      this.drawExample();
    },
    beforeDestroy() {
      window.removeEventListener('popstate', this.preventBack);
    }
  };
  </script>
  
  <style scoped>
  .flashlight-t2 {
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
  