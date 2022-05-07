import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";

const Create: NextPage = () => {

  const { register, handleSubmit } = useForm();
  return (
    <Layout canGoBack title="Go Live">
      <form className=" space-y-4 py-10 px-4">
        <Input 
          required 
          label="Name" 
          name="name" 
          type="text"
          register={register("name")}
        />
        <Input
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
          register={register("price")}
        />
        <TextArea 
          name="description" 
          label="Description" 
          register={register("description")}
        />
        <Button text="Go live" />
      </form>
    </Layout>
  );
};