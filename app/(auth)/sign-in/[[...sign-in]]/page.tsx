
import SignIn1 from '@/components/auth/sign-in-1'


const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn1 enabledOAuthStrategies={["oauth_google", "oauth_github"]} />
    </div>
  )
}

export default page