import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import path from 'path'

const SCREENSHOTS_DIR = './screenshots'
await mkdir(SCREENSHOTS_DIR, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const page = await browser.newPage()
await page.setViewportSize({ width: 1200, height: 900 })

await page.goto('http://localhost:5173')
await page.waitForLoadState('networkidle')

// 軸数ラジオボタンのセレクター
const axisOptions = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

for (const n of axisOptions) {
  // ラジオボタンをクリックして軸数を変更
  await page.locator(`.axis-count-group label`).filter({ hasText: `${n}軸` }).click()
  await page.waitForTimeout(300)

  // プレビューエリアのスクリーンショット
  const previewEl = page.locator('.preview-area').first()
  await previewEl.screenshot({
    path: path.join(SCREENSHOTS_DIR, `axis-${n}.png`),
  })

  console.log(`✓ ${n}軸 → screenshots/axis-${n}.png`)
}

await browser.close()
console.log('\nAll screenshots saved.')
