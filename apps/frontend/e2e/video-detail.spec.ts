import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixtureVideoPath = resolve(__dirname, 'fixtures/mov_hts-samp0023.mp4')

/**
 * テスト用動画をアップロードして一覧画面まで戻るヘルパー関数
 */
async function uploadVideoFixture(
  page: Page,
  title: string,
  description: string,
): Promise<void> {
  await test.step('動画情報の入力とアップロード画面への遷移', async () => {
    await page.goto('/upload')
    await expect(
      page.getByRole('heading', { name: '動画情報の入力' }),
    ).toBeVisible()

    const nextButton = page.getByRole('button', { name: '次へ進む' })
    await expect(async () => {
      await page.getByPlaceholder('動画のタイトルを入力').fill(title)
      await page.getByPlaceholder('動画の説明を入力').fill(description)
      await expect(nextButton).toBeEnabled({ timeout: 1000 })
    }).toPass({ timeout: 10000 })

    await nextButton.click()
  })

  await test.step('動画ファイルの選択とアップロード実行', async () => {
    await expect(
      page.getByRole('heading', { name: '動画アップロード' }),
    ).toBeVisible({ timeout: 15000 })

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(fixtureVideoPath)

    const uploadStartButton = page.getByRole('button', {
      name: 'アップロード開始',
    })
    await expect(uploadStartButton).toBeEnabled()
    await uploadStartButton.click()

    await expect(
      page.getByRole('heading', { name: 'アップロード完了' }),
    ).toBeVisible({ timeout: 15000 })
  })

  await test.step('一覧画面へ戻る', async () => {
    const retryButton = page.getByRole('button', {
      name: 'もう一度アップロードする',
    })
    await expect(retryButton).toBeVisible()
    await retryButton.click()

    await expect(page.getByRole('table')).toBeVisible()
  })
}

test.describe('Video Detail Page', () => {
  // 1. 異常系テスト: 存在しない動画へのアクセス
  test('should display not found message for non-existent video', async ({
    page,
  }) => {
    await page.goto('/videos/non-existent-video-id')

    await expect(
      page.getByRole('heading', { name: '動画が見つかりませんでした' }),
    ).toBeVisible()
    await expect(
      page.getByText(
        '指定された動画は削除されたか、存在しない可能性があります。',
      ),
    ).toBeVisible()

    const backButton = page.getByRole('link', {
      name: 'アップロード一覧へ戻る',
    })
    await expect(backButton).toBeVisible()
    await backButton.click()
    await expect(page).toHaveURL(/\/upload/)
  })

  // 2. 正常系テスト: 詳細画面への遷移とメタデータ・プレイヤーの表示確認
  test('should navigate to video detail page and display video metadata', async ({
    page,
  }) => {
    const videoTitle = `E2E Metadata Test ${Date.now()}`
    const videoDescription = 'Testing video detail metadata display'

    await uploadVideoFixture(page, videoTitle, videoDescription)

    // 一覧から詳細リンクをクリック
    const targetRow = page.getByRole('row', { name: new RegExp(videoTitle) })
    await expect(targetRow).toBeVisible()
    const detailLink = targetRow.getByRole('link', { name: '動画詳細を見る' })
    await expect(detailLink).toBeVisible()
    await detailLink.click()

    // 詳細画面のUI要素・メタデータの表示確認
    await expect(page).toHaveURL(/\/videos\/.+/)
    await expect(page.getByRole('heading', { name: videoTitle })).toBeVisible()
    await expect(page.getByText(videoDescription)).toBeVisible()

    const videoElement = page.locator('video')
    await expect(videoElement).toBeAttached()
  })

  // 3. 正常系テスト: 動画再生操作と再生進行の確認
  test('should play video and advance playback time', async ({ page }) => {
    const videoTitle = `E2E Playback Test ${Date.now()}`
    const videoDescription = 'Testing video playback progress'

    await uploadVideoFixture(page, videoTitle, videoDescription)

    // 一覧から詳細ページへ遷移
    const targetRow = page.getByRole('row', { name: new RegExp(videoTitle) })
    const detailLink = targetRow.getByRole('link', { name: '動画詳細を見る' })
    await detailLink.click()

    await expect(page).toHaveURL(/\/videos\/.+/)
    const videoElement = page.locator('video')
    await expect(videoElement).toBeAttached()

    // 再生ボタンを押下して再生状態と経過時間を検証
    const playButton = page.getByRole('button', {
      name: '動画の再生または一時停止',
    })
    await playButton.click()

    await expect(async () => {
      const isPlaying = await videoElement.evaluate(
        (video: HTMLVideoElement) => !video.paused && video.currentTime > 0,
      )
      expect(isPlaying).toBe(true)
    }).toPass({ timeout: 10000 })
  })
})
