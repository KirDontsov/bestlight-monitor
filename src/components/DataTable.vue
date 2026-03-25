<template>
  <div class="data-table">
    <table>
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            @click="handleSort(column.key)"
            class="sortable"
            :class="{
              'sorted-asc': sortKey === column.key && sortOrder === 'asc',
              'sorted-desc': sortKey === column.key && sortOrder === 'desc'
            }"
          >
            {{ column.label }}
            <span class="sort-icon">
              {{ getSortIcon(column.key) }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.id">
          <td v-for="column in columns" :key="column.key">
            {{ row[column.key] }}
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="empty-message">
            Нет данных для отображения
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  sortKey: {
    type: String,
    default: null
  },
  sortOrder: {
    type: String,
    default: 'asc'
  }
})

const emit = defineEmits(['sort'])

// Column definitions based on Google Sheets structure
const columns = [
  { key: 'убыток', label: 'Убыток' },
  { key: 'автомобиль', label: 'Автомобиль' },
  { key: 'гос_номер', label: 'Гос. номер' },
  { key: 'vin', label: 'VIN' },
  { key: 'текущий_статус', label: 'Текущий статус' }
]

function handleSort(key) {
  emit('sort', key)
}

function getSortIcon(key) {
  if (props.sortKey !== key) return ''
  return props.sortOrder === 'asc' ? '↑' : '↓'
}
</script>

<style scoped>
.data-table {
  background: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--table-header-bg);
}

th {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  white-space: nowrap;
}

th:hover {
  background-color: var(--border-color);
}

th.sortable {
  position: relative;
  padding-right: 2rem;
}

/* Last column wider */
th:last-child {
  width: 40%;
  min-width: 300px;
}

th.sorted-asc,
th.sorted-desc {
  background-color: var(--primary-color);
  color: white;
}

.sort-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
}

td {
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--text-primary);
  vertical-align: middle;
}

/* Last column wider */
td:last-child {
  width: 40%;
  min-width: 300px;
  white-space: normal;
  word-wrap: break-word;
}

tr:hover td {
  background-color: var(--table-row-hover);
}

tr:last-child td {
  border-bottom: none;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

/* Responsive table */
@media (max-width: 768px) {
  .data-table {
    overflow-x: auto;
  }
  
  table {
    min-width: 800px;
  }
}
</style>
