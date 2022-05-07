import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface ResponseUser {
  user: User | undefined;
  isLoading: boolean;
}

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

export default function useUser(priv:boolean = true) : ResponseUser {
  const {data, error} = useSWR<ProfileResponse>("/users/me");
  const router = useRouter();
  
  useEffect(() => {
    if(priv && data && !data.ok) {
      router.replace("/enter");
    }
  }, [priv, data, router]);

  return {
    user: data?.profile,
    isLoading: !data && !error
  };

}