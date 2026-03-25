<template>
  <div class="dashboard-view">
    <header class="dashboard-header">
      <h1 class="dashboard-title">Bestlight Monitor</h1>
      <div class="header-actions">
        <button @click="handleRefresh" class="btn btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>🔄 Обновить</span>
        </button>
        <button @click="handleLogout" class="btn btn-danger">Выйти</button>
      </div>
    </header>

    <div v-if="lastUpdated" class="last-updated">
      Последнее обновление: {{ formatTime(lastUpdated) }}
    </div>

    <div v-if="error" class="error-banner">
      {{ error }}
    </div>

    <div class="dashboard-content">
      <SearchBar v-model="searchQuery" :count="count" />

      <div v-if="isLoading && !hasData" class="loading-container">
        <div class="spinner-large"></div>
        <p>Загрузка данных...</p>
      </div>

      <div v-else-if="error && !hasData" class="error-container">
        <p>Не удалось загрузить данные</p>
        <button @click="handleRefresh" class="btn btn-primary">Попробовать снова</button>
      </div>

      <DataTable
        v-else
        :data="filteredData"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        @sort="handleSort"
      />

      <Pagination
        v-if="showPagination"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="filteredData.length"
        @page-change="currentPage = $event"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGoogleSheets } from '../composables/useGoogleSheets'
import { useAuth } from '../composables/useAuth'
import { config } from '../config'
import SearchBar from '../components/SearchBar.vue'
import DataTable from '../components/DataTable.vue'
import Pagination from '../components/Pagination.vue'

const router = useRouter()
const { data, isLoading, error, lastUpdated, hasData, count, loadData, refresh } = useGoogleSheets()
const { logout } = useAuth()

const searchQuery = ref('')
const sortKey = ref(null)
const sortOrder = ref('asc')
const currentPage = ref(1)

// Show pagination if more than threshold items
const showPagination = computed(() => {
  return filteredData.value.length > config.pagination.threshold
})

const totalPages = computed(() => {
  if (!showPagination.value) return 1
  return Math.ceil(filteredData.value.length / config.pagination.pageSize)
})

// Filter data based on search query
const filteredData = computed(() => {
  let result = [...data.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(row => {
      return Object.values(row).some(value =>
        String(value).toLowerCase().includes(query)
      )
    })
  }

  // Apply sorting
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = a[sortKey.value] || ''
      const bVal = b[sortKey.value] || ''
      
      // Try numeric comparison first
      const aNum = parseFloat(aVal.replace(/\s/g, ''))
      const bNum = parseFloat(bVal.replace(/\s/g, ''))
      
      let comparison = 0
      if (!isNaN(aNum) && !isNaN(bNum)) {
        comparison = aNum - bNum
      } else {
        comparison = String(aVal).localeCompare(String(bVal), 'ru')
      }
      
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  }

  return result
})

// Get paginated data
const paginatedData = computed(() => {
  if (!showPagination.value) return filteredData.value
  
  const start = (currentPage.value - 1) * config.pagination.pageSize
  const end = start + config.pagination.pageSize
  return filteredData.value.slice(start, end)
})

function handleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

function handleRefresh() {
  refresh()
  currentPage.value = 1
}

function handleLogout() {
  logout()
  router.push('/')
}

function formatTime(date) {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: var(--background-color);
}

.dashboard-header {
  background: var(--card-background);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 10;
}

.dashboard-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.last-updated {
  padding: 0.5rem 2rem;
  background: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.error-banner {
  margin: 1rem 2rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius);
  color: var(--danger-color);
}

.dashboard-content {
  padding: 1.5rem 2rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  background: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
