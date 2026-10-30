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

    await emailInput.pressSequentially(email)
    await emailInput.blur()
    await passwordInput.pressSequentially(password)
    await passwordInput.blur()
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    // 認証成功後にトップページ (/) へリダイレクトされることを確認
    await page.waitForURL('**/')
    expect(page.url()).toMatch(/\/$/)

    // セッションCookieが設定されていることを確認
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find((c) => c.name === 'sessionId')
    expect(sessionCookie).toBeDefined()
  })

  test('should show validation error on signup with short password', async ({
    page,
  }) => {
    await page.goto('/signup')
    await expect(
      page.getByRole('heading', { name: 'アカウント作成' }),
    ).toBeVisible()

    const emailInput = page.getByLabel('メールアドレス')
    const passwordInput = page.getByLabel('パスワード')
    const submitButton = page.getByRole('button', { name: 'アカウント作成' })

    await emailInput.pressSequentially('user@example.com')
    await passwordInput.pressSequentially('123')

    await expect(submitButton).toBeDisabled()
    expect(page.url()).toContain('/signup')
  })

  test('should navigate to signin, login successfully, and redirect to top page', async ({
    page,
  }) => {
    const email = generateUniqueEmail()

    await page.goto('/signup')
    await expect(
      page.getByRole('heading', { name: 'アカウント作成' }),
    ).toBeVisible()

    const signupEmailInput = page.getByLabel('メールアドレス')
    const signupPasswordInput = page.getByLabel('パスワード')
    const signupSubmitButton = page.getByRole('button', {
      name: 'アカウント作成',
    })

    await signupEmailInput.pressSequentially(email)
    await signupEmailInput.blur()
    await signupPasswordInput.pressSequentially(password)
    await signupPasswordInput.blur()
    await expect(signupSubmitButton).toBeEnabled()
    await signupSubmitButton.click()
    await page.waitForURL('**/')

    // 一旦 Cookie をクリアしてサインイン画面へ遷移
    await page.context().clearCookies()
    await page.goto('/signin')

    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

    const signinEmailInput = page.getByLabel('メールアドレス')
    const signinPasswordInput = page.getByLabel('パスワード')
    const signinSubmitButton = page.getByRole('button', { name: 'ログイン' })

    await signinEmailInput.pressSequentially(email)
    await signinEmailInput.blur()
    await signinPasswordInput.pressSequentially(password)
    await signinPasswordInput.blur()
    await expect(signinSubmitButton).toBeEnabled({ timeout: 50000 })
    await signinSubmitButton.click()

    // サインイン成功後にトップページ (/) へリダイレクトされることを確認
    await page.waitForURL('**/')
    expect(page.url()).toMatch(/\/$/)

    // セッションCookieが再設定されていることを確認
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find((c) => c.name === 'sessionId')
    expect(sessionCookie).toBeDefined()
  })

  test('should show error on signin with unregistered credentials', async ({
    page,
  }) => {
    await page.goto('/signin')
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()

    const emailInput = page.getByLabel('メールアドレス')
    const passwordInput = page.getByLabel('パスワード')
    const submitButton = page.getByRole('button', { name: 'ログイン' })

    await emailInput.pressSequentially('unregistered@example.com')
    await emailInput.blur()
    await passwordInput.pressSequentially('wrongpassword')
    await passwordInput.blur()

    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    await expect(page.getByRole('alert')).toBeVisible()
    expect(page.url()).toContain('/signin')
  })
})
