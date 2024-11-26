<template>
  <div class="books-container">
    <h1 class="page-title">✏️ 도서 추천</h1>
    <p class="page-explain">엄선된 도서를 통해 시작하는 금융 공부, 재테크 시작!</p>
    <div class="books-grid">
      <div v-for="book in displayedBooks" :key="book.id" class="book-card">
        <div class="book-thumbnail" @click="goToBookSite(book.link)">
          <img :src="book.image" :alt="book.title" class="book-image">
          <div class="link-button">
            <i class="fas fa-external-link-alt"></i>
          </div>
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <p class="book-description">{{ book.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- 페이지네이션 추가 -->
    <div class="pagination">
      <button 
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="page-button"
      >
        이전
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        :disabled="currentPage === totalPages"
        @click="currentPage++"
        class="page-button"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const books = ref([])
const currentPage = ref(1)
const booksPerPage = 8

// 현재 페이지에 표시될 책들을 계산하는 computed 속성 추가
const displayedBooks = computed(() => {
  const start = (currentPage.value - 1) * booksPerPage
  const end = start + booksPerPage
  return books.value.slice(start, end)
})

// 전체 페이지 수를 계산하는 computed 속성 추가
const totalPages = computed(() => {
  return Math.ceil(books.value.length / booksPerPage)
})

const goToBookSite = (link) => {
  window.open(link, '_blank')
}

const fetchBooks = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/library/books/')
    books.value = response.data.data.map(book => ({
      id: book.isbn13,
      title: book.title,
      author: book.author,
      description: book.description,
      image: book.cover.replace('coversum', 'cover'),
      link: book.link
    }))
  } catch (error) {
    console.error('도서 정보를 가져오는데 실패했습니다:', error)
  }
}

onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.books-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  margin: 20px auto;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #056800;
  font-weight: 600;
}

.page-explain {
  margin-left: 20px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #000000;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  padding: 20px;
}

.book-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  overflow: hidden;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-thumbnail {
  position: relative;
  cursor: pointer;
}

.book-image {
  width: 100%;
  height: 300px;
  object-fit: contain;
  background-color: #f5f5f5;
  padding: 10px;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.link-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(5, 104, 0, 0.8);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-thumbnail:hover .link-button {
  opacity: 1;
}

.link-button i {
  color: white;
  font-size: 20px;
}

.book-info {
  padding: 15px;
}

.book-title {
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  color: rgba(10, 80, 6, 0.938);
}

.book-author {
  color: #666;
  margin: 5px 0;
}

.book-description {
  font-size: 0.9rem;
  color: #777;
  margin: 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .books-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .book-image {
    height: 250px;
  }
}

/* 페이지네이션 스타일 추가 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 20px;
}

.page-button {
  padding: 8px 16px;
  background-color: #056800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.page-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-button:hover:not(:disabled) {
  background-color: #045600;
}

.page-info {
  font-size: 1.1rem;
  color: #333;
}
</style>