<template>
  <div class="axis-selector-grid">
    <div
      v-for="i in config.axes"
      :key="i"
      class="axis-row"
    >
      <span class="axis-badge" :style="{ backgroundColor: config.axisColors[i - 1] }">
        {{ axisName(i) }}
      </span>
      <input
        class="axis-label-input"
        type="text"
        :value="config.axisLabels[i - 1]"
        @input="e => updateLabel(i - 1, e.target.value)"
        :placeholder="`軸${i}`"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  config: { type: Object, required: true },
})

const AXIS_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

function axisName(i) {
  return AXIS_NAMES[i - 1] + '軸'
}

function updateLabel(index, value) {
  props.config.axisLabels[index] = value
}
</script>

<style scoped>
.axis-selector-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.axis-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.axis-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  flex-shrink: 0;
}
.axis-label-input {
  flex: 1;
  min-width: 0;
  padding: 4px 8px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 13px;
  background: #fff;
}
.axis-label-input:focus {
  outline: none;
  border-color: #3b82f6;
}
</style>
