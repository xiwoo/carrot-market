import type { NextPage } from "next";
import { FieldErrors, useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";

interface CreateForm {
  name: string;
  price: number;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }} = useForm<CreateForm>({mode: "onSubmit"});
  const [ createStream, {loading, data}] = useMutation<CreateResponse>(`/api/streams`);
  
  const onValied = (form:CreateForm) => {
    if(loading) return;
    createStream(form);
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log("im invalid bby", errors);
  };

  useEffect(
    () => {
      if(data && data.ok) {
        router.push(`/streams/${data.stream.id}`);
      }

    }, 
    [data, router]
  );

  return (
    <Layout canGoBack seoTitle="Go Live">
      <form onSubmit={handleSubmit(onValied, onInvalid)} className=" space-y-4 py-10 px-4">
        <Input 
          required 
          label="Name" 
          name="name" 
          type="text"
          register={register("name", {required: true})}
        />
        <Input
          required={false}
          label="Price"
          name="price"
          type="text"
          kind="price"
          register={
            register(
              "price", 
              {
                required: "가격은 필수 입니다.", valueAsNumber: true,
                // pattern: /^[0-9]+$/,
                validate: {valueNumber: value => !isNaN(value) || "price is number"}
              }
            )
          }
        />
        <TextArea 
          name="description" 
          label="Description" 
          register={register("description", {minLength: {value: 10, message: "minLength is 10"}})}
        />
        {errors.price?.message}
        {errors.description?.message}
        <Button text={loading ? "Loading..." : "Go live"} />
      </form>
    </Layout>
  );
};

export default Create;