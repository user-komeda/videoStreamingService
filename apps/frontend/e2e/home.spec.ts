import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test('should display header, sidebar, and main sections', async ({
    page,
  }) => {
    await page.goto('/')

    // Header checks
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByPlaceholder('検索')).toBeVisible()

    // Sidebar navigation checks
    await expect(page.getByRole('button', { name: 'ホーム' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Shorts' })).toBeVisible()

    // Title check
    await expect(page).toHaveTitle(/Video Streaming Service/)
  })

  test('should toggle login status from header', async ({ page }) => {
    await page.goto('/')

    const loginButton = page.getByRole('button', { name: 'ログイン (切替)' })
    await expect(loginButton).toBeVisible()

    const userMenuButton = page.getByRole('button', {
      name: 'ユーザーメニュー',
    })

    await expect(async () => {
      await loginButton.click()
      await expect(userMenuButton).toBeVisible({ timeout: 1000 })
    }).toPass({ timeout: 10000 })

    // Toggle logout
    await userMenuButton.click()
    const logoutItem = page.getByRole('button', { name: 'ログアウト' })
    await expect(logoutItem).toBeVisible()
    await logoutItem.click()

    await expect(
      page.getByRole('button', { name: 'ログイン (切替)' }),
    ).toBeVisible()
  })
})
