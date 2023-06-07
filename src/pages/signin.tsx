import { XCircleIcon } from "@heroicons/react/20/solid";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { useZodForm } from "~/hooks/useZodForm";
import { signInSchema } from "~/schemas/auth";
import { type NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";
import { Header } from "~/components/Header";
import { isAuthenticated } from "~/utils/auth";

const SignIn: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({}) => {
  const { query } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useZodForm({ schema: signInSchema });
  return (
    <>
      <Head>
        <title>Customer Support - Sign in</title>
        <meta
          name="description"
          content="Sign in to the customer support portal"
        />
      </Head>
      <main className="flex justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 py-16">
          <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Sign in
          </h1>

          <form
            className="grid w-full grid-cols-1 gap-4 bg-white px-6 py-12 shadow sm:mx-auto sm:max-w-[480px] sm:rounded-lg sm:px-12 md:gap-8"
            noValidate
            onSubmit={(e) => {
              void handleSubmit((values) =>
                signIn("credentials", {
                  username: values.email,
                  password: values.password,
                })
              )(e);
            }}
          >
            <Input
              {...register("email")}
              label="Email address"
              id="email"
              type="email"
              autoComplete="email"
              required
              error={errors.email}
            />
            <Input
              {...register("password")}
              label="Password"
              id="password"
              type="password"
              autoComplete="current-password"
              required
              error={errors.password}
            />
            <div>
              <Button type="submit" disabled={!isDirty && !isValid}>
                Sign in
              </Button>
            </div>
            {!!query.error && !isDirty ? (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Either your email or password was wrong.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </main>
    </>
  );
};

SignIn.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Header />
      {page}
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (await isAuthenticated(ctx)) {
    return {
      redirect: {
        destination: "/portal",
        permananet: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default SignIn;
