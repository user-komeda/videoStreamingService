import { Link } from 'react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { SignUpForm } from '~/feature/auth/components/SignUpForm'

export const SignUpCard = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          アカウント作成
        </CardTitle>
        <CardDescription className="text-center">
          新規アカウントを作成してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          すでにアカウントをお持ちですか？{' '}
          <Link to="/signin" className="text-primary hover:underline">
            サインイン
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
