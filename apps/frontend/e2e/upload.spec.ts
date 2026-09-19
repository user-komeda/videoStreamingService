import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixtureVideoPath = resolve(__dirname, 'fixtures/test-video.mp4')

test.describe('Video Upload Flow', () => {
  test('should complete the 3-step upload flow and reflect in the list', async ({
    page,
  }) => {
    const videoTitle = `E2E Test Video ${Date.now()}`
    const videoDescription = 'This is an automated test video description.'

    await page.goto('/upload')

    // Step 1: Video Information Input
    await expect(
      page.getByRole('heading', { name: '動画情報の入力' }),
    ).toBeVisible()

    const nextButton = page.getByRole('button', { name: '次へ進む' })

    await expect(async () => {
      await page.getByPlaceholder('動画のタイトルを入力').fill(videoTitle)
      await page.getByPlaceholder('動画の説明を入力').fill(videoDescription)
      await expect(nextButton).toBeEnabled({ timeout: 1000 })
    }).toPass({ timeout: 10000 })

    await nextButton.click()

    // Step 2: Upload Area
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

    // Step 3: Upload Completed
    await expect(
      page.getByRole('heading', { name: 'アップロード完了' }),
    ).toBeVisible({ timeout: 15000 })
    await expect(
      page.getByText('1 件の動画をアップロードしました'),
    ).toBeVisible()

    // Reset flow
    const retryButton = page.getByRole('button', {
      name: 'もう一度アップロードする',
    })
    await expect(retryButton).toBeVisible()
    await retryButton.click()

    // Back to Step 1
    await expect(
      page.getByRole('heading', { name: '動画情報の入力' }),
    ).toBeVisible()

    // Check table displays the uploaded video
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByText(videoTitle)).toBeVisible()
  })
})
