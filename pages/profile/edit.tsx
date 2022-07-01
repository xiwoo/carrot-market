import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";

interface EditProfileForm {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {

  const router = useRouter();
  const { user } = useUser();
  const [ avatarPreview, setAvatarPreview] = useState("");
  const { register, watch, setValue, setError, formState: {errors}, handleSubmit } = useForm<EditProfileForm>();
  const [editProfile, {data, loading} ] = useMutation<EditProfileResponse>(`/api/users/me`);
  
  useEffect(
    () => {
      if(user?.name) setValue("name", user?.name)
      if(user?.email) setValue("email", user?.email)
      if(user?.phone) setValue("phone", user?.phone)
      if(user?.avatar) setAvatarPreview(`https://imagedelivery.net/2PnCEE_So2hCDSJbGMbdBw/${user.avatar}/avatarCrop`)
    }, 
    [user, setValue]
  );

  useEffect(
    () => {
      if(data && !data.ok) {
        setError("formErrors", {message: data.error});
      }
    }, 
    [data, setError],
  );

  useEffect(() => {
    if(data?.ok) {
      router.push(`/profile`);
    }

  }, [data, router]);

  const avatar = watch("avatar")
  useEffect(
    () => {
      if(avatar && avatar.length > 0)
        setAvatarPreview(URL.createObjectURL(avatar[0]));
    },
    [avatar]
  );

  const onVailed = async ({ name, email, phone, avatar }: EditProfileForm) => {
    if(loading) return;
    if(!name && !email && !phone) {
      setError(
        "formErrors", 
        {message: "Name OR Email OR Phone number are requierd. You need to choose one."}
      );
    }

    if(avatar) {
      const { uploadURL } = await( await fetch(`/api/files`)).json();

      const form = new FormData();
      form.append("file", avatar[0], user?.id+"");
      const {
        result: { id },
      } = await (await fetch(
        uploadURL,
        {
          method: "POST",
          body: form,
        }
      )).json();

      editProfile({ name, email, phone, avatarId: id, });
      return;
    }
    editProfile({ name, email, phone, });
  }

  return (
    <Layout canGoBack seoTitle="Edit Profile">
      <form onSubmit={handleSubmit(onVailed)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? 
            <img src={avatarPreview} className="w-14 h-14 rounded-full bg-slate-500" /> : 
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          }
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          required={false}
          label="Name" 
          name="name" 
          type="text"
          register={register("name")}
        />
        <Input
          required={false}
          label="Email address" 
          name="email" 
          type="email"
          register={register("email")}
        />
        <Input
          required={false}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
          register={register("phone")}
        />
        {errors.formErrors ? <span className="my-2 text-red-500 font-medium text-center block">{errors.formErrors.message}</span> : null}
        <Button text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;