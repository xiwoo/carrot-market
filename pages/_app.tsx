import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from "swr";
import useUser from '@libs/client/useUser';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { user } = useUser(router.pathname === '/enter');
  // console.log(user);
  // pageProps.user = user;
  return (
    <SWRConfig value={{fetcher: (url:string) => fetch(`/api${url}`).then(res => res.json())}}>
      <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} {...user}/>
      </div>
    </SWRConfig>
  )
}

export default MyApp;