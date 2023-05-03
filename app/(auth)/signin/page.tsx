import AuthForm from '@/components/AuthForm/AuthForm'
import "@/styles/global.css"

const SigninPage = () => {
  return (
    <div className='pure-center' style={{height:"100%"}}>
      db ENV : {JSON.stringify(process.env.DATABASE_URL)}
      <AuthForm mode='signin' />
    </div>
  )
}

export default SigninPage