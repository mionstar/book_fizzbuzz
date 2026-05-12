<template>
  <div class="settings-panel">

    <!-- 表示種別 -->
    <section class="setting-row">
      <label class="setting-label">表示種別</label>
      <div class="setting-control axis-count-group">
        <label v-for="n in axisOptions" :key="n" class="radio-label">
          <input type="radio" :value="n" v-model="config.axes" />
          {{ n }}軸
        </label>
      </div>
    </section>

    <!-- 表示軸 -->
    <section class="setting-row align-start">
      <label class="setting-label">表示軸</label>
      <div class="setting-control">
        <AxisSelector :config="config" />
      </div>
    </section>

    <hr class="divider" />

    <!-- レイアウト -->
    <section class="setting-row">
      <label class="setting-label">レイアウト</label>
      <div class="setting-control layout-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="config.fullBackground" />
          全面背景色
        </label>
        <label class="radio-label">
          <input type="radio" value="wide" v-model="config.layout" />
          広い
        </label>
        <label class="radio-label">
          <input type="radio" value="narrow" v-model="config.layout" />
          狭い
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="config.rounded" />
          角丸にする
        </label>
      </div>
    </section>

    <!-- グラフ -->
    <section class="setting-row">
      <label class="setting-label">グラフ</label>
      <div class="setting-control color-group">
        <label class="color-label">
          グラフ背景色
          <input type="color" v-model="config.chartBgColor" />
        </label>
        <label class="color-label">
          グラフ色
          <input type="color" :value="colorToHex(config.chartColor)" @input="e => config.chartColor = e.target.value" />
        </label>
        <label class="color-label">
          枠線
          <input type="color" v-model="config.borderColor" />
        </label>
        <label class="color-label">
          メモリ色
          <input type="color" :value="colorToHex(config.gridColor)" @input="e => config.gridColor = e.target.value" />
        </label>
      </div>
    </section>

    <!-- 基準グラフ -->
    <section class="setting-row">
      <label class="setting-label">基準グラフ</label>
      <div class="setting-control">
        <label class="checkbox-label">
          <input type="checkbox" v-model="config.useBaseChart" />
          利用する
        </label>
      </div>
    </section>

    <hr class="divider" />

    <!-- テキスト -->
    <section class="setting-row">
      <label class="setting-label">テキスト</label>
      <div class="setting-control font-group">
        <span class="setting-sub-label">フォント</span>
        <button
          class="font-btn"
          :class="{ active: config.fontFamily === 'serif' }"
          style="font-family: serif; font-style: italic;"
          @click="config.fontFamily = 'serif'"
        >T</button>
        <button
          class="font-btn"
          :class="{ active: config.fontFamily === 'sans-serif' }"
          style="font-family: sans-serif;"
          @click="config.fontFamily = 'sans-serif'"
        >T</button>
        <button
          class="font-btn font-btn--color"
          title="文字色（ラベル色は現在固定）"
        >A</button>
        <button
          class="font-btn"
          :class="{ active: config.fontBold }"
          style="font-weight: bold;"
          @click="config.fontBold = !config.fontBold"
        >B</button>
        <button
          class="font-btn"
          :class="{ active: config.fontItalic }"
          style="font-style: italic;"
          @click="config.fontItalic = !config.fontItalic"
        >I</button>
      </div>
    </section>

    <hr class="divider" />

    <!-- スコア表示 -->
    <section class="setting-row align-start">
      <label class="setting-label">スコア表示</label>
      <div class="setting-control score-group">
        <div class="score-radio-row">
          <label v-for="opt in scoreOptions" :key="opt.value" class="radio-label">
            <input type="radio" :value="opt.value" v-model="config.scoreMode" />
            {{ opt.label }}
          </label>
        </div>
        <div class="score-label-row">
          <span class="setting-sub-label">スコアラベル</span>
          <input
            type="text"
            v-model="config.scoreLabel"
            class="score-label-input"
            placeholder="例: 点"
          />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import AxisSelector from './AxisSelector.vue'

defineProps({
  config: { type: Object, required: true },
})

const axisOptions = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const scoreOptions = [
  { value: 'total', label: '合計点' },
  { value: '100',   label: '100点表示' },
  { value: '10',    label: '10点表示' },
  { value: '10d',   label: '10点表示（小数）' },
  { value: '5',     label: '5点表示' },
  { value: '5d',    label: '5点表示（小数）' },
]

// rgba等の色文字列を color input 用 hex に変換（簡易版）
function colorToHex(color) {
  if (!color || color.startsWith('#')) return color || '#ffffff'
  // rgba(r,g,b,a) → #rrggbb
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (m) {
    return '#' + [m[1], m[2], m[3]].map(v => parseInt(v).toString(16).padStart(2, '0')).join('')
  }
  return '#ffffff'
}
</script>

<style scoped>
.settings-panel {
  background: #f4f6f8;
  border-radius: 12px;
  padding: 20px 24px;
  min-width: 320px;
  font-size: 13px;
  color: #333;
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
}
.setting-row.align-start {
  align-items: flex-start;
}

.setting-label {
  width: 80px;
  flex-shrink: 0;
  font-weight: 600;
  color: #444;
}

.setting-control {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.setting-sub-label {
  color: #666;
  margin-right: 4px;
}

.divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 4px 0;
}

/* ラジオ・チェックボックス */
.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.radio-label input,
.checkbox-label input {
  accent-color: #3b82f6;
}

/* 軸数 */
.axis-count-group {
  gap: 12px;
}

/* レイアウト */
.layout-group {
  gap: 14px;
}

/* カラーピッカー */
.color-group {
  gap: 14px;
}
.color-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #555;
}
.color-label input[type="color"] {
  width: 28px;
  height: 22px;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 1px;
  cursor: pointer;
  background: none;
}

/* フォントボタン */
.font-group {
  gap: 6px;
  align-items: center;
}
.font-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: background 0.15s;
}
.font-btn:hover {
  background: #e8edf2;
}
.font-btn.active {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #1d4ed8;
}
.font-btn--color {
  color: #e74c3c;
  font-weight: bold;
}

/* スコア */
.score-group {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.score-radio-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.score-label-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.score-label-input {
  padding: 3px 8px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 13px;
  width: 120px;
}
.score-label-input:focus {
  outline: none;
  border-color: #3b82f6;
}
</style>
