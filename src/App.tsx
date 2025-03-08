import { Button } from "@/components/ui/button"
import { Input } from "./components/ui/input"

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Input className="w-44" />
      <div className="pt-10" />
      <Button className="cursor-pointer">Create Server</Button>
    </div>
  )
}

export default App
