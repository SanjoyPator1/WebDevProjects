import AuthForm from '@/components/AuthForm/AuthForm'
import "@/styles/global.css"
const RegisterPage = () => {
  return (
    <div className='pure-center' style={{height:"100%"}}>
      <AuthForm mode='register' />
    </div>
  )
}

export default RegisterPage