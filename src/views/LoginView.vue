<template>
  <div class="login-view">
    <button @click="toggleTheme" class="theme-toggle" :title="isDark ? 'Светлая тема' : 'Тёмная тема'">
      <span v-if="isDark">☀️</span>
      <span v-else>🌙</span>
    </button>
    <div class="login-card">
      <h1 class="login-title">Bestlight Monitor</h1>
      <p class="login-subtitle">Войдите для продолжения</p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="login" class="form-label">Логин</label>
          <input
            id="login"
            v-model="loginForm.login"
            type="text"
            class="input"
            :class="{ 'input-error': error }"
            placeholder="Введите логин"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            class="input"
            :class="{ 'input-error': error }"
            placeholder="Введите пароль"
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn btn-primary login-button"
          :disabled="isLoading || !loginForm.login || !loginForm.password"
        >
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Войти</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { login, isLoading, error } = useAuth()
const { isDark, toggleTheme } = useTheme()

const loginForm = reactive({
  login: '',
  password: ''
})

async function handleSubmit() {
  const success = await login(loginForm.login, loginForm.password)
  if (success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
}

.theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 0.5rem 0.75rem;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s;
  box-shadow: var(--shadow);
}

.theme-toggle:hover {
  background: var(--background-color);
}

.login-card {
  background: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.login-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.login-button {
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
