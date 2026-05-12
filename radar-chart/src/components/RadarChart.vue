<template>
  <div class="radar-wrapper" :class="[`layout-${config.layout}`, { rounded: config.rounded, 'full-bg': config.fullBackground }]"
       :style="fullBgStyle">
    <svg :width="svgSize" :height="svgSize" :viewBox="`0 0 ${svgSize} ${svgSize}`" class="radar-svg">
      <!-- グラフ背景円/多角形 -->
      <polygon
        :points="gridPolygons[gridPolygons.length - 1]"
        :fill="config.chartBgColor"
        stroke="none"
      />

      <!-- グリッド線（目盛りポリゴン） -->
      <polygon
        v-for="(pts, i) in gridPolygons"
        :key="`grid-${i}`"
        :points="pts"
        fill="none"
        :stroke="config.gridColor"
        stroke-width="1"
      />

      <!-- 軸線 -->
      <line
        v-for="(line, i) in axisLines"
        :key="`axis-${i}`"
        :x1="line.x1" :y1="line.y1"
        :x2="line.x2" :y2="line.y2"
        :stroke="config.gridColor"
        stroke-width="1"
      />

      <!-- 基準グラフ -->
      <polygon
        v-if="config.useBaseChart && baseDataPoints"
        :points="baseDataPoints"
        fill="rgba(255,255,255,0.25)"
        :stroke="config.borderColor"
        stroke-width="1.5"
        stroke-dasharray="4 3"
      />

      <!-- データポリゴン -->
      <polygon
        v-if="dataPointsStr"
        :points="dataPointsStr"
        :fill="config.chartColor"
        :stroke="config.borderColor"
        stroke-width="1.5"
      />

      <!-- 枠線（最外周） -->
      <polygon
        :points="gridPolygons[gridPolygons.length - 1]"
        fill="none"
        :stroke="config.borderColor"
        stroke-width="1.5"
      />

      <!-- 軸ラベル（複数行対応） -->
      <text
        v-for="(pos, i) in labelPositions"
        :key="`label-${i}`"
        :x="pos.x"
        :y="pos.y - (wrapLabel(activeLabels[i]).length - 1) * LINE_HEIGHT / 2"
        :text-anchor="pos.anchor"
        dominant-baseline="middle"
        :font-family="config.fontFamily"
        :font-weight="config.fontBold ? 'bold' : 'normal'"
        :font-style="config.fontItalic ? 'italic' : 'normal'"
        font-size="12"
        fill="#333"
        class="axis-label"
      >
        <tspan
          v-for="(line, li) in wrapLabel(activeLabels[i])"
          :key="li"
          :x="pos.x"
          :dy="li === 0 ? 0 : LINE_HEIGHT"
        >{{ line }}</tspan>
      </text>

      <!-- スコアラベル -->
      <text
        v-for="(pos, i) in labelPositions"
        :key="`score-${i}`"
        :x="pos.x"
        :y="pos.y + (wrapLabel(activeLabels[i]).length - 1) * LINE_HEIGHT / 2 + 16"
        :text-anchor="pos.anchor"
        dominant-baseline="middle"
        :font-family="config.fontFamily"
        :font-weight="config.fontBold ? 'bold' : 'normal'"
        font-size="13"
        fill="#222"
        class="score-label"
      >
        <tspan v-if="config.scoreMode !== 'total' && scoreMax">
          {{ formatScore(data[i] ?? 0, scoreMax) }}
        </tspan>
        <tspan v-else>{{ data[i] ?? 0 }}</tspan>
        <tspan v-if="config.scoreLabel" font-size="10"> {{ config.scoreLabel }}</tspan>
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { useGeometry } from '../composables/useGeometry.js'

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Array, default: () => [] },
  baseData: { type: Array, default: () => [] },
  activeLabels: { type: Array, default: () => [] },
  scoreMax: { type: Number, default: 100 },
  formatScore: { type: Function, default: (v) => String(v) },
})

const svgSize = computed(() => props.config.layout === 'wide' ? 400 : 280)
const radius = computed(() => svgSize.value * 0.35)
const cx = computed(() => svgSize.value / 2)
const cy = computed(() => svgSize.value / 2)
const axisCount = toRef(() => props.config.axes)

const { gridPolygons, axisLines, labelPositions, calcDataPoints } = useGeometry(axisCount, cx, cy, radius)

const dataMax = 100
const LINE_HEIGHT = 15
const MAX_CHARS = 9

function wrapLabel(text) {
  if (!text) return ['']
  const lines = []
  for (let i = 0; i < text.length; i += MAX_CHARS) {
    lines.push(text.slice(i, i + MAX_CHARS))
  }
  return lines
}

const dataPointsStr = computed(() => {
  if (!props.data.length) return null
  return calcDataPoints(props.data, dataMax)
})

const baseDataPoints = computed(() => {
  if (!props.baseData.length) return null
  return calcDataPoints(props.baseData, dataMax)
})

const fullBgStyle = computed(() => {
  if (!props.config.fullBackground) return {}
  return { backgroundColor: props.config.chartBgColor }
})
</script>

<style scoped>
.radar-wrapper {
  display: inline-block;
  padding: 16px;
  background: transparent;
}
.radar-wrapper.full-bg {
  border-radius: 0;
}
.radar-wrapper.rounded {
  border-radius: 16px;
}
.radar-wrapper.layout-narrow {
  padding: 8px;
}
.radar-svg {
  overflow: visible;
  display: block;
}
.axis-label {
  pointer-events: none;
  user-select: none;
}
.score-label {
  pointer-events: none;
  user-select: none;
}
</style>
