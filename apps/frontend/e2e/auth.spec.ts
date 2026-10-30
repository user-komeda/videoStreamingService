import { expect, test } from '@playwright/test'

test.describe('Authentication Flow', () => {
  const generateUniqueEmail = () =>
    `test-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`
  const password = 'Password123!'

  test('should navigate to signup, register new user, and redirect to top page', async ({
    page,
  }) => {
    const email = generateUniqueEmail()

    await page.goto('/signup')

    await expect(
      page.getByRole('heading', { name: 'アカウント作成' }),
    ).toBeVisible()

    const emailInput = page.getByLabel('メールアドレス')
    const passwordInput = page.getByLabel('パスワード')
    const submitButton = page.getByRole('button', { name: 'アカウント作成' })

    await emailInput.fill(email)
    await passwordInput.fill(password)
    await submitButton.click()

    // 認証成功後にトップページ (/) へリダイレクトされることを確認
    await page.waitForURL('**/')
    expect(page.url()).toMatch(/\/$/)

    // セッションCookieが設定されていることを確認
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find((c) => c.name === 'sessionId')
    expect(sessionCookie).toBeDefined()
  })

  test('should show validation error on signup with invalid email', async ({
    page,
  }) => {
    await page.goto('/signup')

    const emailInput = page.getByLabel('メールアドレス')
    const passwordInput = page.getByLabel('パスワード')
    const submitButton = page.getByRole('button', { name: 'アカウント作成' })

    await emailInput.fill('invalid-email')
    await passwordInput.fill(password)
    await submitButton.click()

    await expect(page.getByText('無効なメールアドレスです')).toBeVisible()
    expect(page.url()).toContain('/signup')
  })

  test('should navigate to signin, login successfully, and redirect to top page', async ({
    page,
  }) => {
    const email = generateUniqueEmail()

    // まず新規登録を行う
    await page.goto('/signup')
    await page.getByLabel('メールアドレス').fill(email)
    await page.getByLabel('パスワード').fill(password)
    await page.getByRole('button', { name: 'アカウント作成' }).click()
    await page.waitForURL('**/')

    // 一旦 Cookie をクリアしてサインイン画面へ遷移
    await page.context().clearCookies()
    await page.goto('/signin')

    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

    await page.getByLabel('メールアドレス').fill(email)
    await page.getByLabel('パスワード').fill(password)
    await page.getByRole('button', { name: 'ログイン' }).click()

    // サインイン成功後にトップページ (/) へリダイレクトされることを確認
    await page.waitForURL('**/')
    expect(page.url()).toMatch(/\/$/)

    // セッションCookieが再設定されていることを確認
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find((c) => c.name === 'sessionId')
    expect(sessionCookie).toBeDefined()
  })

  test('should show validation error on signin with invalid credentials format', async ({
    page,
  }) => {
    await page.goto('/signin')

    await page.getByLabel('メールアドレス').fill('invalid-email')
    await page.getByLabel('パスワード').fill('123')
    await page.getByRole('button', { name: 'ログイン' }).click()

    await expect(page.getByText('無効なメールアドレスです')).toBeVisible()
    expect(page.url()).toContain('/signin')
  })
})
