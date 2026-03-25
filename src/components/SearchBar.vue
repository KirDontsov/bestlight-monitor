<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        v-model="localQuery"
        type="text"
        class="input search-input"
        placeholder="Поиск по всем полям..."
      />
      <button v-if="localQuery" @click="clearSearch" class="clear-button">
        ✕
      </button>
    </div>
    <div class="search-info">
      Найдено: <strong>{{ count }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

const localQuery = ref(props.modelValue)

watch(localQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  localQuery.value = newValue
})

function clearSearch() {
  localQuery.value = ''
}
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}

.clear-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background-color: var(--background-color);
}

.search-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.search-info strong {
  color: var(--text-primary);
}
</style>
