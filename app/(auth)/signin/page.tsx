import AuthForm from '@/components/AuthForm/AuthForm'
import "@/styles/global.css"

const SigninPage = () => {
  return (
    <div className='pure-center' style={{height:"100%"}}>
      <AuthForm mode='signin' />
    </div>
  )
}

export default SigninPage