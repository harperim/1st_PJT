import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useProfileStore = defineStore('profile', () => {
  // localStorage에서 저장된 테스트 결과와 habitScore 불러오기
  const savedResult = localStorage.getItem('testResult')
  const savedHabitScore = localStorage.getItem('habitScore')
  const habitScore = ref(savedHabitScore ? parseInt(savedHabitScore) : 0)
  const testResult = ref(savedResult ? JSON.parse(savedResult) : null)
  const currentView = ref('edit')
  const userInfo = ref(null)  // 사용자 정보 저장용
  const totalScore = ref(0)
  
  const setTotalScore = (score) => {
    totalScore.value = score
  }

  const setTestResult = async (result) => {
    testResult.value = result
    localStorage.setItem('testResult', JSON.stringify(result))
    
    // 사용자 정보를 먼저 가져옵니다
    try {
      await fetchUserInfo()
      const score = calculateFinancialScore()
      if (score) {
        const token = localStorage.getItem('token')
        await axios.put('http://127.0.0.1:8000/accounts/update/', {
          total_score: score.finalScore,
          age_score: score.ageScore,
          income_score: score.incomeScore,
          consumption_score: score.habitScore,
          test_date: new Date().toISOString()
        }, {
          headers: {
            Authorization: `Token ${token}`
          }
        })

        // 추천 상품 정보 추가
        const recommendations = getRecommendedProducts(score.finalScore)
        testResult.value = { ...testResult.value, ...recommendations }
        localStorage.setItem('testResult', JSON.stringify(testResult.value))
      }
    } catch (error) {
      console.error('점수 업데이트 실패:', error)
      throw error
    }
  }

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://127.0.0.1:8000/accounts/user/', {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      userInfo.value = response.data
      return response.data
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error)
      throw error
    }
  }

  // 사용자 정보 업데이트
  const updateUserInfo = async (updatedData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put('http://127.0.0.1:8000/accounts/user/update/', updatedData, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      userInfo.value = response.data
      return response.data
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error)
      throw error
    }
  }

  // 새로운 코드 추가
  const calculateFinancialScore = () => {
    if (!userInfo.value) {
      console.log('userInfo가 없습니다:', userInfo.value)
      return null
    }

    // 연령대 점수 계산
    let ageScore = 0
    const age = calculateAge(userInfo.value.birth_date)
    if (age <= 39) ageScore = 50
    else if (age >= 40 && age <= 59) ageScore = 100
    else if (age >= 60) ageScore = 75

    // 소득수준 점수 계산
    let incomeScore = 0
    switch (userInfo.value.income_level) {
      case 'low': incomeScore = 30; break
      case 'middle': incomeScore = 60; break
      case 'high': incomeScore = 100; break
      default: incomeScore = 0
    }

    // habitScore 참조 방식 수정
    // console.log('원래습관점수: ', habitScore.value)
    const habitScoreValue = Math.round((habitScore.value / 24) * 50)
    // console.log('최종습관점수: ', habitScoreValue)

    // 최종 점수 계산
    const finalScore = Math.round(
      (ageScore * 0.2) + 
      (incomeScore * 0.3) + 
      (habitScoreValue)  // 수정된 변수 사용
    )
    
    return {
      ageScore,
      incomeScore,
      habitScore: habitScoreValue,  // 수정된 변수 사용
      finalScore
    }

  }


  // 만 나이 계산 함수 추가
  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // 금융 상품 추천 함수 추가
  const getRecommendedProducts = (score) => {
    if (score >= 90) {
      return {
        type: '꼬꼬마 저축왕 병아리',
        image: 'src/assets/꼬꼬마병아리.png',
        description: '안정성과 장기 투자를 선호하는 유형입니다.',
        recommendations: [
          { 
            name: '3~5년 장기 예금', 
            description: '장기적인 자산 증식을 원하는 사람에게 적합한 예금 상품입니다. 3년 또는 5년 동안 자금을 예치하며, 안정적인 이자 수익을 얻을 수 있습니다. 예금자 보호가 보장되어 원금 손실 우려가 없고, 이자는 고정금리로 제공되어 예측 가능한 수익을 제공합니다.'
          },
          { 
            name: '우대 금리 적금', 
            description: '일정 기간 동안 금액을 매달 정해진 금액만큼 저축하는 적금 상품입니다. 특정 조건을 충족할 경우 우대 금리를 제공하여 기본 이자율보다 높은 수익을 기대할 수 있습니다. 예금자 보호가 보장되며, 정기적인 금액 적립을 통해 안정적인 자산 증식이 가능합니다.'
          }
        ]
      }
    } else if (score >= 70) {
      return {
        type: '차곡차곡 알토란 병아리',
        image: 'src/assets/알토란병아리.png',
        description: '중기적으로 계획적인 저축을 선호하는 유형입니다.',
        recommendations: [
          { 
            name: '6개월~12개월 정기 예금', 
            description: '중기적으로 자금을 예치하여 이자를 얻고 싶은 사람에게 적합한 예금 상품입니다. 예치 기간이 짧아 비교적 빠른 시간 내에 만기를 맞추어 이자를 수령할 수 있습니다. 예금자 보호가 보장되며, 이자는 고정금리로 지급되어 예측 가능한 수익을 제공합니다.'
          },
          { 
            name: '정기 적금', 
            description: '매달 일정 금액을 저축하여 만기 시 원금과 이자를 받는 적금 상품입니다. 정해진 기간 동안 자금을 적립하여 일정 목표를 달성하고자 하는 사람에게 적합합니다. 중기적인 저축 목표를 가진 사람들에게 안정적인 수익을 제공합니다.'
          }
        ]
      }
    } else if (score >= 50) {
      return {
        type: '자유로운 깃털 병아리',
        image: 'src/assets/깃털병아리.png',
        description: '단기적으로 자금 활용을 선호하는 유형입니다.',
        recommendations: [
          { 
            name: '1~6개월 정기 예금', 
            description: '짧은 기간 동안 자금을 예치하고, 일정 이자 수익을 얻을 수 있는 예금 상품입니다. 급하게 자금을 운용하고자 하는 경우 적합하며, 예금 기간이 짧고 이자 수익을 빠르게 얻을 수 있습니다. 예금자 보호가 보장됩니다.'
          },
          { 
            name: '자유 적금', 
            description: '매달 일정 금액을 자유롭게 납입할 수 있는 적금 상품입니다. 정해진 금액을 고정적으로 납입하지 않고, 여유 자금에 맞게 자유롭게 적립할 수 있어 유연한 자금 운용이 가능합니다. 자금을 유연하게 운용하고자 하는 사람에게 적합합니다.'
          }
        ]
      }
    } else {
      return {
        type: '폴짝폴짝 즉흥 병아리',
        image: 'src/assets/즉흥병아리.png',
        description: '즉시 자금 유동성이 필요하고 자산 운용이 자유로운 성향입니다.',
        recommendations: [
          { 
            name: '입출금 자유 예금', 
            description: '자금을 언제든지 입출금할 수 있는 예금 상품입니다. 예치한 자금을 필요할 때 즉시 출금할 수 있어 자금 유동성이 중요한 사람에게 적합합니다. 이자율은 고정적이지 않고 낮지만, 유동성이 중요할 경우 유용한 상품입니다.'
          },
          { 
            name: '입출금 자유 적금', 
            description: '적금에 입출금 기능이 결합된 상품으로, 일정 금액을 매달 납입하면서도 언제든지 자금을 입출금할 수 있습니다. 급하게 자금을 사용할 필요가 있을 때 유용하며, 유동성을 중시하는 사람에게 적합한 상품입니다.'
          }
        ]
      }
    }
  }

  // setHabitScore 함수 수정
  const setHabitScore = (score) => {
    habitScore.value = score
    localStorage.setItem('habitScore', score.toString())
  }

  return {
    testResult,
    currentView,
    userInfo,
    setTestResult,
    fetchUserInfo,
    updateUserInfo,
    calculateFinancialScore,
    ageScore: computed(() => calculateFinancialScore()?.ageScore || 0),
    incomeScore: computed(() => calculateFinancialScore()?.incomeScore || 0),
    habitScore: computed(() => calculateFinancialScore()?.habitScore || 0),
    finalScore: computed(() => calculateFinancialScore()?.finalScore || 0),
    setHabitScore,
    totalScore,
    setTotalScore
  }
})