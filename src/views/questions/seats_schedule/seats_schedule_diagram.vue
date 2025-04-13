<template>
    <div class="container" @drop="onEmptyAreaDrop" @dragover="onEmptyAreaDragOver">
      <div class="seats-diagram">
        <div class="flex-container">
          <!-- 餐桌区域 -->
          <div class="table-container">
            <!-- 自定义圆形餐桌 -->
            <div class="table-circle">
              <img 
                :src="require('@/assets/seats_schedule.png')" 
                class="table-image" 
                alt="餐桌"
              >
            </div>
            
            <!-- 固定的小明位置 -->
            <div 
              class="seat fixed-seat" 
              :style="getSeatPosition(0)"
            >
              <div class="label">小明</div>
            </div>
        
            <!-- 其他7个可拖动的椅子 -->
            <div
              v-for="(seat, index) in seats"
              :key="index"
              class="seat"
              :style="getSeatPosition(index + 1)"
              :class="{ 
                'can-drop': isDragOverSeat === index && seat.person === null,
                'cannot-drop': isDragOverSeat === index && seat.person !== null && seat.person !== draggedPerson
              }"
              @drop="onSeatDrop($event, index)"
              @dragover="onSeatDragOver($event, index)"
              @dragleave="onSeatDragLeave(index)"
            >
              <div
                v-if="seat.person !== null"
                class="person"
                draggable="true"
                @dragstart="onDragStart($event, index)"
              >
                {{ seat.person }}
              </div>
            </div>
          </div>
  
          <!-- 人员池区域，位于右侧 -->
          <div 
            class="person-pool"
            @drop="onPoolDrop($event)"
            @dragover="onPoolDragOver($event)"
          >
            <div
              v-for="person in initialPeople"
              :key="person"
              class="person"
              draggable="true"
              @dragstart="onDragStart($event, null, person)"
              v-if="isPersonAvailable(person)"
            >
              {{ person }}
            </div>
          </div>
        </div>
      </div>
  
      <!-- 按钮放在页面底部居中 -->
      <div class="button-area">
        <button-component
          @submit="submitChanges"
          @reset="resetSeats"
        />
      </div>
    </div>
  </template>
  
  <script>
  import ButtonComponent from './ButtonComponent.vue';
  
  export default {
    name: 'SeatsScheduleDiagram',
    components: {
      ButtonComponent
    },
    data() {
      return {
        seats: [
          { person: null },
          { person: null },
          { person: null },
          { person: null },
          { person: null },
          { person: null },
          { person: null },
        ],
        initialPeople: ['小花', '小白', '小贝', '小可', '小丽', '小兰', '小亮'],
        draggedPerson: null,
        draggedFromSeatIndex: null,
        isDragOverSeat: null,
        tableRadius: 150, // 餐桌半径
        seatRadius: 30,   // 座椅半径
        seatDistance: 180 // 座椅到餐桌中心的距离
      };
    },
    computed: {
      seatedPeople() {
        return this.seats.map(seat => seat.person).filter(Boolean);
      }
    },
    methods: {
      getSeatPosition(index) {
        // 计算座椅位置 (0号位置是小明，1-7号是其他座椅)
        const totalSeats = 8; // 总共8个位置(包括小明)
        const angle = (index * 2 * Math.PI / totalSeats) - Math.PI / 2; // 从顶部开始
        const centerX = this.tableRadius + this.seatDistance * 0.6;
        const centerY = this.tableRadius + this.seatDistance * 0.6;
        
        const x = centerX + this.seatDistance * Math.cos(angle);
        const y = centerY + this.seatDistance * Math.sin(angle);
        
        return {
          left: `${x}px`,
          top: `${y}px`,
        };
      },
      
      isPersonAvailable(person) {
        return !this.seatedPeople.includes(person);
      },
      
      onDragStart(event, seatIndex, person) {
        if (seatIndex !== null) {
          this.draggedFromSeatIndex = seatIndex;
          this.draggedPerson = this.seats[seatIndex].person;
        } else {
          this.draggedFromSeatIndex = null;
          this.draggedPerson = person;
        }
        event.dataTransfer.setData('text/plain', this.draggedPerson);
      },
      
      onSeatDrop(event, seatIndex) {
        event.preventDefault();
        const seat = this.seats[seatIndex];
        this.isDragOverSeat = null;
        
        if (seat.person !== null) return;
        
        if (this.draggedFromSeatIndex !== null) {
            this.seats[this.draggedFromSeatIndex].person = null;
        }
        
        seat.person = this.draggedPerson;
        this.clearDragState();
        
        // 触发变更事件 - 座椅到座椅
        this.emitChanges('applyChanges');
      },
      
      onSeatDragOver(event, seatIndex) {
        event.preventDefault();
        this.isDragOverSeat = seatIndex;
        
        const seat = this.seats[seatIndex];
        if (seat.person === null) {
          event.dataTransfer.dropEffect = 'move';
        } else {
          event.dataTransfer.dropEffect = 'none';
        }
      },
      
      onSeatDragLeave(seatIndex) {
        if (this.isDragOverSeat === seatIndex) {
          this.isDragOverSeat = null;
        }
      },
      
      onPoolDrop(event) {
        event.preventDefault();
        if (this.draggedFromSeatIndex !== null) {
            this.seats[this.draggedFromSeatIndex].person = null;
        }
        this.clearDragState();
        
        // 触发变更事件 - 座椅到人员池
        this.emitChanges('applyChanges');
      },
      
      onPoolDragOver(event) {
        event.preventDefault();
      },
      
      onEmptyAreaDrop(event) {
        event.preventDefault();
        this.isDragOverSeat = null;
        if (this.draggedFromSeatIndex !== null && 
            !event.target.classList.contains('seat') && 
            !event.target.classList.contains('person-pool')) {
            this.seats[this.draggedFromSeatIndex].person = null;
            // 触发变更事件 - 座椅拖到空白区域
            this.emitChanges('applyChanges');
        }
        this.clearDragState();
      },
      
      onEmptyAreaDragOver(event) {
        event.preventDefault();
      },
      
      clearDragState() {
        this.draggedPerson = null;
        this.draggedFromSeatIndex = null;
        this.isDragOverSeat = null;
      },
      
      resetSeats() {
        this.seats = [
          { person: null },
          { person: null },
          { person: null },
          { person: null },
          { person: null },
          { person: null },
          { person: null },
        ];

        this.emitChanges('resetChanges');
      },

      // 统一触发变更事件
      emitChanges(eventType) {
        // 构建座位字典 {1: '小明', 2: '小花', ... 8: ''}
        const seatsDict = {
            1: '小明' // 固定的小明位置
        };
        
        // 填充其他7个座位 (2-8)
        this.seats.forEach((seat, index) => {
            seatsDict[index + 2] = seat.person || 'NULL';
        });
        var seatsStr = '{';
        Object.keys(seatsDict).forEach(key => {
            seatsStr += key + ':' + seatsDict[key] + ',';
        });
        seatsStr = seatsStr.slice(0, -1) + '}';
        
        const unseatedPeople = this.initialPeople.filter(p => 
            !Object.values(seatsDict).includes(p)
        );
        var poolStr = '[' + unseatedPeople.join(',') + ']';

        console.log('座位安排：', seatsStr);
        console.log('人员池：', poolStr);
        
        this.$emit(eventType, {
            diagramState: seatsStr, // 修改后的字典格式
            choosePool: poolStr     // 未坐位人员数组格式
        });
      },
      
      submitChanges() {
        this.emitChanges('submitChanges');
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    min-height: 100vh;
    padding: 20px;
  }
  .seats-diagram {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
  }
  .table-container {
    position: relative;
    width: calc(150px * 2 + 180px * 2 * 0.6);
    height: calc(150px * 2 + 180px * 2 * 0.6);
    margin-right: 40px;
  }
  
  .table-circle {
    width: calc(150px * 2);
    height: calc(150px * 2);
    border-radius: 50%;
    background: #f8f8f8;
    border: 2px solid #ddd;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .table-image {
    width: 90%;
    height: 90%;
    object-fit: contain;
    border-radius: 50%;
  }
  
  .seat {
    width: 60px;
    height: 60px;
    position: absolute;
    border: 2px solid #888;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #6495ed;
    cursor: pointer;
    transition: all 0.2s;
    transform: translate(-50%, -50%);
    z-index: 10;
  }
  
  .seat.fixed-seat {
    background-color: #d0e0ff;
  }
  
  .seat.can-drop {
    background-color: #4CAF50;
    border-color: #2E7D32;
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  .seat.cannot-drop {
    background-color: #F44336;
    border-color: #C62828;
  }
  
  .label {
    font-weight: bold;
    color: white;
  }
  .person-pool {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 16px;
    align-content: flex-start;
    min-width: 150px;
    padding: 10px;
    border: 1px dashed #ccc;
    border-radius: 8px;
    background-color: #f5f5f5;
  }
  .person {
    width: 55px;
    height: 40px;
    background-color: #6495ed;
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    cursor: grab;
    user-select: none;
  }
  .person:active {
    cursor: grabbing;
  }
  .button-area {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
  .flex-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  </style>