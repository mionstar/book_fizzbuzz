import { reactive, computed } from 'vue'

const AXIS_COLORS = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
  '#1abc9c', '#3498db', '#9b59b6', '#e91e63',
  '#00bcd4', '#8bc34a', '#ff5722', '#607d8b',
]

export function useChartConfig() {
  const config = reactive({
    axes: 6,
    axisLabels: Array.from({ length: 12 }, (_, i) => `軸${i + 1}`),
    axisColors: [...AXIS_COLORS],

    layout: 'wide',
    rounded: false,
    fullBackground: false,

    chartBgColor: '#5bc8e0',
    chartColor: 'rgba(255,255,255,0.45)',
    borderColor: '#aaaaaa',
    gridColor: 'rgba(255,255,255,0.6)',

    useBaseChart: false,

    fontFamily: 'sans-serif',
    fontBold: false,
    fontItalic: false,

    // 'total' | '100' | '10' | '10d' | '5' | '5d'
    scoreMode: '100',
    scoreLabel: '',
  })

  // 現在有効な軸数分のラベル・色だけ返す
  const activeLabels = computed(() => config.axisLabels.slice(0, config.axes))
  const activeColors = computed(() => config.axisColors.slice(0, config.axes))

  // スコア表示の最大値
  const scoreMax = computed(() => {
    switch (config.scoreMode) {
      case 'total': return null
      case '100': return 100
      case '10':
      case '10d': return 10
      case '5':
      case '5d': return 5
      default: return 100
    }
  })

  // スコアを表示文字列に変換
  function formatScore(value, max) {
    if (config.scoreMode === 'total') return String(value)
    const ratio = value / max
    switch (config.scoreMode) {
      case '100': return String(Math.round(ratio * 100))
      case '10':  return String(Math.round(ratio * 10))
      case '10d': return (ratio * 10).toFixed(1)
      case '5':   return String(Math.round(ratio * 5))
      case '5d':  return (ratio * 5).toFixed(1)
      default:    return String(value)
    }
  }

  return { config, activeLabels, activeColors, scoreMax, formatScore }
}
