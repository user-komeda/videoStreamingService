import { Link } from 'react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { SignInForm } from '~/feature/auth/components/SignInForm'

export const SignInCard = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          サインイン
        </CardTitle>
        <CardDescription className="text-center">
          アカウントにログインしてください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          アカウントをお持ちでないですか？{' '}
          <Link to="/signup" className="text-primary hover:underline">
            サインアップ
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
