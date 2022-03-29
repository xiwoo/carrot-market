
import { FieldErrors, useForm } from "react-hook-form";

interface LoginForm {
  username: string;
  password: string;
  email: string;
}


export default function Forms() {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  // console.log(watch());
  const onValid = (data: LoginForm) => {
    console.log("im valid bby", data);
  };
  const onInvalid = (errors: FieldErrors) => {
    console.log("im invalid bby", errors);
  };


  return (
    <form 
      onSubmit={handleSubmit(onValid, onInvalid)}
    >
      <input 
        {...register(
          "username", { required: "히히히히" }
        )}
        placeholder="username" 
        type="text"
      />
      <input  
        {...register("email", { required: "email required", validate: { notGamil: (value) => !value.includes("gmail.com") || "Gamil not allowed" }})}
        placeholder="email" 
        type="email" 
      />
      {errors.email?.message}
      <input  
        {...register("password", { required: true })}
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