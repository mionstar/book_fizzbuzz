<template>
  <div class="app">
    <h1 class="app-title">レーダーチャート</h1>

    <div class="app-body">
      <!-- 設定パネル -->
      <div class="panel-col">
        <SettingsPanel :config="config" />
      </div>

      <!-- プレビュー -->
      <div class="preview-col">
        <h2 class="preview-title">プレビュー</h2>
        <div class="preview-area">
          <RadarChart
            :config="config"
            :data="data"
            :base-data="baseData"
            :active-labels="activeLabels"
            :score-max="scoreMax"
            :format-score="formatScore"
          />
        </div>

        <!-- データ入力（デモ用） -->
        <div class="data-inputs">
          <h3 class="data-title">データ入力（デモ）</h3>
          <div class="data-grid">
            <label
              v-for="(label, i) in activeLabels"
              :key="i"
              class="data-row"
            >
              <span class="data-axis-name">{{ label }}</span>
              <input
                type="range"
                min="0"
                max="100"
                :value="data[i] ?? 50"
                @input="e => updateData(i, Number(e.target.value))"
              />
              <span class="data-value">{{ data[i] ?? 50 }}</span>
            </label>
          </div>

          <div v-if="config.useBaseChart" class="data-grid base-data-grid">
            <p class="base-label">基準グラフ</p>
            <label
              v-for="(label, i) in activeLabels"
              :key="i"
              class="data-row"
            >
              <span class="data-axis-name">{{ label }}</span>
              <input
                type="range"
                min="0"
                max="100"
                :value="baseData[i] ?? 50"
                @input="e => updateBaseData(i, Number(e.target.value))"
              />
              <span class="data-value">{{ baseData[i] ?? 50 }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useChartConfig } from './composables/useChartConfig.js'
import RadarChart from './components/RadarChart.vue'
import SettingsPanel from './components/SettingsPanel.vue'

const { config, activeLabels, scoreMax, formatScore } = useChartConfig()

const data = ref(Array.from({ length: 12 }, () => 50))
const baseData = ref(Array.from({ length: 12 }, () => 50))

function updateData(index, value) {
  data.value[index] = value
}
function updateBaseData(index, value) {
  baseData.value[index] = value
}

watch(() => config.axes, (n) => {
  while (data.value.length < n) data.value.push(50)
  while (baseData.value.length < n) baseData.value.push(50)
})
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: sans-serif; background: #eef0f3; color: #333; }
</style>

<style scoped>
.app {
  min-height: 100vh;
  padding: 24px;
}
.app-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #222;
}
.app-body {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.panel-col {
  flex: 0 0 auto;
}
.preview-col {
  flex: 1;
  min-width: 300px;
}
.preview-title {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 12px;
}
.preview-area {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: inline-block;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.data-inputs {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.data-title {
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 10px;
}
.data-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.base-data-grid {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}
.base-label {
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
}
.data-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.data-axis-name {
  width: 100px;
  font-size: 12px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.data-row input[type="range"] {
  flex: 1;
  accent-color: #3b82f6;
}
.data-value {
  width: 28px;
  text-align: right;
  font-size: 12px;
  color: #333;
}
</style>
