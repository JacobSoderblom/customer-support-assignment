import Head from "next/head";
import { type ReactElement, useState } from "react";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import { useZodForm } from "~/hooks/useZodForm";
import { createTicketSchema } from "~/schemas/ticket";
import { api } from "~/utils/api";
import { Header } from "~/components/Header";
import { type NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const [loading, toggleLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useZodForm({ schema: createTicketSchema });

  const createTicket = api.ticket.create.useMutation({
    onMutate: () => {
      toggleLoading(true);
      setError(false);
      setSuccess(false);
    },
    onError: () => {
      setError(true);
    },
    onSuccess: () => {
      reset();
      setSuccess(true);
    },
    onSettled: () => {
      toggleLoading(false);
    },
  });

  return (
    <>
      <Head>
        <title>Customer Support</title>
        <meta
          name="description"
          content="Create your customer support ticket."
        />
      </Head>
      <main className="flex justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create a ticket
          </h1>
          <form
            className="grid w-full grid-cols-1 gap-4 bg-white px-6 py-12 shadow sm:mx-auto sm:max-w-[480px] sm:rounded-lg sm:px-12 md:gap-8"
            onSubmit={(e) => {
              setError(false);
              setSuccess(false);
              void handleSubmit((values) => createTicket.mutate(values))(e);
            }}
            noValidate
          >
            <Input
              {...register("name")}
              label="Full name*"
              id="name"
              type="text"
              autoComplete="name"
              required
              error={errors.name}
            />
            <Input
              {...register("email")}
              id="email"
              label="Email address*"
              type="email"
              autoComplete="email"
              required
              error={errors.email}
            />
            <Input
              {...register("productNo")}
              label="Product number*"
              id="productNo"
              type="text"
              autoComplete="productNo"
              description="You can find the product number on your receipt, it should be atleast 12 characters long"
              required
              error={errors.productNo}
            />
            <Text
              {...register("description")}
              id="description"
              label="Description*"
              rows={3}
              error={errors.description}
            />
            <div>
              <Button type="submit" disabled={!isDirty && !isValid}>
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
            {success ? (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h2 className="text-sm font-medium text-green-800">
                      Your ticket is now created
                    </h2>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        As soon as one of our customer support agents are free
                        your ticket will be handled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {error ? (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h2 className="text-sm font-medium text-red-800">
                      There were a problem with your submission
                    </h2>
                    <p className="mt-2 text-sm text-red-700">
                      Please try again later, if there is still a problem please
                      give us a call!
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

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Header />
      {page}
    </>
  );
};

export default Home;
