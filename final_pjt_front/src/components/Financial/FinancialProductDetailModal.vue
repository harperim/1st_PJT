<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ product.name }}</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="product-info">
          <div class="info-row">
            <!-- <span>{{ product }}</span> -->
            <span class="info-label">은행명:</span>
            <span class="info-value">{{ product.bankName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">공시일:</span>
            <span class="info-value">{{ product.submitDate }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">상세조건:</span>
            <span class="info-value">{{ product.description }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">가입 방법:</span>
            <span class="info-value">{{ product.joinWay }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">가입 조건:</span>
            <span class="info-value">
              {{ product.joinDeny === '1' ? product.joinMember : '제한 없음' }}
            </span>
          </div>

          <hr>
          
          <h3>금리 정보</h3>
          <div class="interest-rates-grid">
            <div v-for="term in [6, 12, 24, 36]" :key="term" class="rate-info">
              <span class="term">{{ term }}개월</span>
              <span class="rate">{{ getBasicRate(term) }}%</span>
            </div>
          </div>
          
          <div class="chart-section">
            <h3>금리 비교</h3>
            <!-- 예금/적금 구분 -->
            <div v-if="!product.options[0].rsrvTypeNm">
              <!-- 예금 차트 -->
              <div class="chart-container">
                <Bar 
                  :data="depositChartData" 
                  :options="chartOptions"
                />
              </div>
            </div>
            <div v-else>
              <!-- 적금 차트 -->
              <div class="chart-container">
                <h4>자유적립식</h4>
                <Bar 
                  :data="freeChartData" 
                  :options="chartOptions"
                />
              </div>
              <div class="chart-container mt-4">
                <h4>정액적립식</h4>
                <Bar 
                  :data="fixedChartData" 
                  :options="chartOptions"
                />
              </div>
            </div>
          </div>
          
          <div class="subscribe-section">
            <button 
              :class="['action-btn', isSubscribed ? 'unsubscribe-btn' : 'subscribe-btn']" 
              @click="handleSubscriptionToggle"
            >
              {{ isSubscribed ? '해지하기' : '가입하기' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

const isSubscribed = ref(false)

const handleSubscriptionToggle = () => {
  isSubscribed.value = !isSubscribed.value
}

defineEmits(['close'])

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

console.log('Product data:', props.product)

// 현재 상품의 기본 금리
const getBasicRate = (term) => {
  const option = props.product.options?.find(opt => opt.saveTerm === term)
  return option ? Number(option.interestRate) : 0
}

// 적립 방식별 금리 계산 함수들 추가
const getBasicRateByType = (term, rsrvType) => {
  const option = props.product.options?.find(opt => 
    opt.saveTerm === term && opt.rsrvTypeNm === rsrvType
  )
  return option ? Number(option.interestRate) : 0
}

const calculateAverageRateByType = (term, rsrvType) => {
  const matchingProducts = props.product.options?.filter(opt => 
    opt.saveTerm === term && 
    opt.rsrvTypeNm === rsrvType
  )

  if (!matchingProducts || matchingProducts.length === 0) return 0

  const sum = matchingProducts.reduce((acc, product) => {
    return acc + Number(product.interestRate)
  }, 0)

  return (sum / matchingProducts.length).toFixed(2)
}

const getPremiumRateByType = (term, rsrvType) => {
  const option = props.product.options?.find(opt => 
    opt.saveTerm === term && opt.rsrvTypeNm === rsrvType
  )
  return option ? Number(option.intrRate2 || 0).toFixed(2) : 0
}

// 자유적립식 차트 데이터
const freeChartData = computed(() => {
  const terms = [6, 12, 24, 36]
  
  return {
    labels: terms.map(term => `${term}개월`),
    datasets: [
      {
        label: '평균 금리',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        data: terms.map(term => calculateAverageRateByType(term, '자유적립식')),
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      },
      {
        label: '저축 금리',
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
        data: terms.map(term => getBasicRateByType(term, '자유적립식')),
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1
      },
      {
        label: '최고 우대 금리',
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        data: terms.map(term => getPremiumRateByType(term, '자유적립식')),
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  }
})

// 정액적립식 차트 데이터
const fixedChartData = computed(() => {
  const terms = [6, 12, 24, 36]
  
  return {
    labels: terms.map(term => `${term}개월`),
    datasets: [
      {
        label: '평균 금리',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        data: terms.map(term => calculateAverageRateByType(term, '정액적립식')),
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      },
      {
        label: '저축 금리',
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
        data: terms.map(term => getBasicRateByType(term, '정액적립식')),
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1
      },
      {
        label: '최고 우대 금리',
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        data: terms.map(term => getPremiumRateByType(term, '정액적립식')),
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  }
})

// 차금용 차트 데이터 수정
const depositChartData = computed(() => {
  const terms = [6, 12, 24, 36]
  
  return {
    labels: terms.map(term => `${term}개월`),
    datasets: [
      {
        label: '평균 금리',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        data: terms.map(term => {
          const matchingProducts = props.product.options?.filter(opt => 
            opt.saveTerm === term
          )
          if (!matchingProducts || matchingProducts.length === 0) return 0
          const sum = matchingProducts.reduce((acc, product) => {
            return acc + Number(product.interestRate)
          }, 0)
          return (sum / matchingProducts.length).toFixed(2)
        }),
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      },
      {
        label: '저축 금리',
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
        data: terms.map(term => getBasicRate(term)),
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1
      },
      {
        label: '최고 우대 금리',
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        data: terms.map(term => {
          const option = props.product.options?.find(opt => opt.saveTerm === term)
          return option ? Number(option.intrRate2 || 0).toFixed(2) : 0
        }),
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  }
})

// 차트 옵션 수정
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: false,
      min: 2,
      max: 6,
      ticks: {
        stepSize: 0.5,
      },
      title: {
        display: true,
        text: '금리 (%)'
      }
    },
    x: {
      title: {
        display: true,
        text: '가입기간'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: '가입기간별 금리 비교'
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.raw}%`
        }
      }
    },
    datalabels: {
      display: true,
      anchor: 'end',
      align: 'end',
      offset: 0,
      formatter: (value) => value + '%',
      font: {
        weight: 'bold',
        size: 11
      },
      color: '#333',
      padding: {
        top: 5,
        bottom: 5
      },
      textAlign: 'center'
    }
  },
  layout: {
    padding: {
      top: 20,
      right: 20,
      bottom: 0,
      left: 20
    }
  },
  categoryPercentage: 0.8,
  barPercentage: 0.3,
  barThickness: 40,
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  width: 95%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
}

.info-row {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  width: 100px;
  font-weight: bold;
}

.interest-rates-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 1rem 0;
  width: 100%;
}

.rate-info {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  min-width: 120px;
}

.term {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.rate {
  font-size: 1.2em;
  color: #1089FF;
  font-weight: bold;
}

.subscribe-section {
  margin-top: 20px;
  text-align: center;
}

.action-btn {
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.subscribe-btn {
  transition: all 0.3s ease;
  text-decoration: none;
  padding: 10px 20px;
  background: linear-gradient(45deg, #98d49a, #338133) !important;
  color: white;
  border: 2px solid #4b9e40;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.subscribe-btn:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(20, 163, 51, 0.4);
}

.unsubscribe-btn {
  background: linear-gradient(45deg, #db7a7a, #eb1c1c);
  border: 2px solid #b5221a;
  cursor: pointer;
  font-size: 17px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  letter-spacing: 1.3px;
  color: white;
  opacity: 0.8;
  padding: 8px 20px;
  border-radius: 5px;
}

.unsubscribe-btn:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(250, 82, 82, 0.4);
}

.info-row {
  white-space: pre-line; /* 줄바꿈을 유지하면서 텍스트를 여러 줄로 출력 */
  word-wrap: break-word; /* 긴 단어가 넘치지 않게 줄 바꿈 */
}

.chart-section {
  margin-top: 30px;
  padding: 40px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
  background-color: white;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-container + .chart-container {
  margin-top: 40px;  /* 차트 간의 간격 */
}

.chart-container h4 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
}

.mt-4 {
  margin-top: 2.5rem !important;  /* 간격 더 늘림 */
}

/* 모달 내용물의 최대 높이 조정 */
.modal-content {
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .interest-rates-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>