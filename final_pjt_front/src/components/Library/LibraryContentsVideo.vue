<template>
  <div class="videos-container">
    <h1 class="page-title">🎥 교육 콘텐츠</h1>
    <p class="page-explain">엄선된 추천 알고리즘으로 제공하는 금융 초보를 위한 콘텐츠 !</p>
    <div v-if="videos.length" class="videos-grid">
      <div v-for="video in videos" :key="video.id.videoId" class="video-card">
        <div class="video-thumbnail">
          <iframe
            width="100%"
            height="215"
            :src="'https://www.youtube.com/embed/' + video.id.videoId"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
        <div class="video-info">
          <h3 class="video-title" v-html="video.snippet.title"></h3>
          <p class="video-description">{{ video.snippet.description }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>로딩 중이거나 영상이 없습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LibraryContentsVideo",
  data() {
    return {
      videos: [], // 유튜브 영상 데이터를 저장
    };
  },
  mounted() {
    this.fetchVideos();
  },
  methods: {
    async fetchVideos() {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const searchQuery = encodeURIComponent("금융교육 재테크 초보강의 투자");
      const maxResults = 9;
      const order = "relevance";
      const regionCode = "KR";
      const relevanceLanguage = "ko";

      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&key=${apiKey}&maxResults=${maxResults}&order=${order}&regionCode=${regionCode}&relevanceLanguage=${relevanceLanguage}`;

      try {
        const response = await axios.get(apiUrl);
        this.videos = response.data.items.map(item => ({
          ...item,
          snippet: {
            ...item.snippet,
            title: this.decodeHTMLEntities(item.snippet.title),
            description: this.decodeHTMLEntities(item.snippet.description)
          }
        }));
      } catch (error) {
        console.error("유튜브 API 요청 중 에러 발생:", error);
      }
    },
    
    decodeHTMLEntities(text) {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      return textarea.value;
    }
  },
};
</script>

<style scoped>
.videos-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
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

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px;
}

.video-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  overflow: hidden;
}

.video-card:hover {
  transform: translateY(-5px);
}

.video-thumbnail {
  position: relative;
  padding-top: 10px;
}

.video-info {
  padding: 15px;
}

.video-title {
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  margin: 0 0 10px 0;
  color: rgba(10, 80, 6, 0.938);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-description {
  font-size: 0.9rem;
  color: #777;
  margin: 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .videos-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .videos-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>
