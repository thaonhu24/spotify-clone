import { GetServerSideProps } from "next";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";

interface Props {
  providers: Awaited<ReturnType<typeof getProviders>>; // result of await getProviders
}

const Login = ({ providers }: Props) => {
  const { name: providerName, id: providerId } =
    providers?.spotify as ClientSafeProvider;

  console.log({ providerId });
  return (
    <div className=" justify-center flex mt-7">
      <button
        className="border-1 text-white bg-[#1ed760] text-3xl px-2 py-1 rounded-md"
        onClick={() => signIn(providerId, { callbackUrl: "/" })}
      >
        Sign in
      </button>
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};
