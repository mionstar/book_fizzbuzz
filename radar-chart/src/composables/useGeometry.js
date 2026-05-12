import { computed } from 'vue'

/**
 * n角形レーダーチャートの座標計算
 * @param {Ref<number>} axisCount - 軸数 (3〜12)
 * @param {Ref<number>} cx - 中心X
 * @param {Ref<number>} cy - 中心Y
 * @param {Ref<number>} radius - 外周半径
 */
export function useGeometry(axisCount, cx, cy, radius) {
  // i番目の軸の角度（ラジアン）。真上を0として時計回り
  function axisAngle(i, n) {
    return (2 * Math.PI * i) / n - Math.PI / 2
  }

  // 比率(0〜1)と軸インデックスから座標を返す
  function pointAt(i, n, ratio, r, centerX, centerY) {
    const angle = axisAngle(i, n)
    return {
      x: centerX + r * ratio * Math.cos(angle),
      y: centerY + r * ratio * Math.sin(angle),
    }
  }

  // グリッド用ポリゴン点列（ratio段分）
  function gridPoints(ratio, n, r, centerX, centerY) {
    return Array.from({ length: n }, (_, i) =>
      pointAt(i, n, ratio, r, centerX, centerY)
    )
  }

  // points配列を SVG polygon の points 文字列に変換
  function toSVGPoints(points) {
    return points.map(p => `${p.x},${p.y}`).join(' ')
  }

  // 軸ラベルの配置座標（外周より少し外側）
  function labelPosition(i, n, r, centerX, centerY, offset = 24) {
    const angle = axisAngle(i, n)
    return {
      x: centerX + (r + offset) * Math.cos(angle),
      y: centerY + (r + offset) * Math.sin(angle),
    }
  }

  // ラベルのテキストアンカー（左右位置に応じて切り替え）
  function labelAnchor(i, n) {
    const angle = axisAngle(i, n)
    const cos = Math.cos(angle)
    if (cos > 0.1) return 'start'
    if (cos < -0.1) return 'end'
    return 'middle'
  }

  // データ値(0〜max)をポリゴン点列に変換
  function dataPoints(values, n, max, r, centerX, centerY) {
    return Array.from({ length: n }, (_, i) => {
      const ratio = (values[i] ?? 0) / max
      return pointAt(i, n, Math.min(ratio, 1), r, centerX, centerY)
    })
  }

  // computedでまとめて返す
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  const gridPolygons = computed(() =>
    gridLevels.map(ratio =>
      toSVGPoints(gridPoints(ratio, axisCount.value, radius.value, cx.value, cy.value))
    )
  )

  const axisLines = computed(() =>
    Array.from({ length: axisCount.value }, (_, i) => {
      const tip = pointAt(i, axisCount.value, 1, radius.value, cx.value, cy.value)
      return { x1: cx.value, y1: cy.value, x2: tip.x, y2: tip.y }
    })
  )

  const labelPositions = computed(() =>
    Array.from({ length: axisCount.value }, (_, i) => ({
      ...labelPosition(i, axisCount.value, radius.value, cx.value, cy.value),
      anchor: labelAnchor(i, axisCount.value),
    }))
  )

  function calcDataPoints(values, max) {
    return toSVGPoints(
      dataPoints(values, axisCount.value, max, radius.value, cx.value, cy.value)
    )
  }

  return { gridPolygons, axisLines, labelPositions, calcDataPoints }
}
