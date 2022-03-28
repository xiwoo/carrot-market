
import { useForm } from "react-hook-form";

export default function Forms() {
  const {register, watch} = useForm();
  console.log(watch());
  return (
    <form >
      <input 
        {...register("username")}
        placeholder="username" 
        type="text"
      />
      <input  
        {...register("email")}
        placeholder="email" 
        type="email" 
      />
      <input  
        {...register("password")}
        placeholder="password" 
        type="password" 
      />
      <input 
        type="submit" 
        value="Create Account" 
      />
    </form>
  )
}