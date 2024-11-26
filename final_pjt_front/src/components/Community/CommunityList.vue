<template>
  <div class="container">
    <div class="list-wrapper">
      <div class="column-headers">
        <div class="list-row">
          <div class="column id">말머리</div>
          <div class="column title">제목</div>
          <div class="column author">작성자</div>
          <div class="column date">작성일</div>
          <div class="column likes">좋아요</div>
        </div>
        <hr class="header-divider">
      </div>

      <!-- 게시글 목록 -->
      <CommunityItem
        v-for="(thread, index) in threads"
        :key="thread.id"
        :thread="thread"
        :index="index + 1"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CommunityItem from './CommunityItem.vue'

const props = defineProps({
  threads: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['select-post'])
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
}

.list-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: rgba(247, 249, 250, 0.815);
  border-radius: 25px;
  font-size: 1.05rem;
}

.list-row, :deep(.post-item) {
  display: flex;
  align-items: center;
  padding: 10px 0;
  width: 100%;
}

.post-title {
  color: #000000;
}

.list-row {
  font-weight: bold;
}

.column, :deep(.post-column) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.id, :deep(.post-id) {
  flex: 0 0 15%;
  text-align: center;
  margin-left: 8px;
}

.title, :deep(.post-title) {
  flex: 1 1 40%;
  text-align: center;
  padding: 0 20px;
  color: #000000;
}

.author, :deep(.post-author) {
  flex: 0 0 15%;
  text-align: center;
}

.date, :deep(.post-date) {
  flex: 0 0 15%;
  text-align: center;
}

.likes, :deep(.post-likes) {
  flex: 0 0 15%;
  text-align: center;
}

.header-divider {
  border: none;
  height: 1px;
  background-color: #ddd;
  margin: 0;
}

@media screen and (max-width: 768px) {
  .date, :deep(.post-date) {
    display: none;
  }
  
  .author, :deep(.post-author) {
    flex: 0 0 20%;
  }
  
  .title, :deep(.post-title) {
    flex: 1 1 45%;
  }
}

@media screen and (max-width: 480px) {
  .author, :deep(.post-author) {
    display: none;
  }
  
  .id, :deep(.post-id) {
    flex: 0 0 20%;
  }
  
  .title, :deep(.post-title) {
    flex: 1 1 60%;
  }
  
  .likes, :deep(.post-likes) {
    flex: 0 0 20%;
  }
}
</style>
