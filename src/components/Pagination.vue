<template>
  <div class="pagination">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="btn btn-nav"
    >
      ← Назад
    </button>

    <div class="pagination-pages">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="['btn', 'btn-page', { active: currentPage === page }]"
      >
        {{ page }}
      </button>
    </div>

    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="btn btn-nav"
    >
      Вперёд →
    </button>

    <div class="pagination-info">
      Страница {{ currentPage }} из {{ totalPages }}
      ({{ totalItems }} записей)
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['pageChange'])

// Show limited page numbers for better UX
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)

  // Adjust start if we're near the end
  start = Math.max(1, end - maxVisible + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

function goToPage(page) {
  if (page >= 1 && page <= props.totalPages) {
    emit('pageChange', page)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-top: 1rem;
  flex-wrap: wrap;
}

.btn-nav {
  padding: 0.5rem 1rem;
  background: var(--background-color);
  color: var(--text-primary);
}

.btn-nav:hover:not(:disabled) {
  background: var(--border-color);
}

.btn-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.btn-page {
  min-width: 2.5rem;
  padding: 0.5rem;
  background: var(--background-color);
  color: var(--text-primary);
}

.btn-page:hover {
  background: var(--border-color);
}

.btn-page.active {
  background: var(--primary-color);
  color: white;
}

.pagination-info {
  width: 100%;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}
</style>
