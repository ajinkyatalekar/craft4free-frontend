import { Button } from "@/components/ui/button"
import { useAuth } from '@/context/AuthContext';

function Auth() {

  const {user, signUp, signIn, signOut, error} = useAuth()

  const handleRegister = async() => {
    await signUp("test@gmail.com", "password")
  }

  const handleLogin = async() => {
    await signIn("test@gmail.com", "password")
  }

  const handleLogout = async() => {
    await signOut()
  }

  const handleNavigate = async() => {
    
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-2">
      <p>User: {user?.email}</p>
      <Button onClick={()=>{handleRegister()}}>Register</Button>
      <Button onClick={()=>{handleLogin()}}>Login</Button>
      <Button onClick={()=>handleLogout()}>Logout</Button>
      <Button onClick={()=>handleNavigate()}>Go to Dashboard</Button>
      <p>Errors: {error}</p>
    </div>
  )
}

export default Auth