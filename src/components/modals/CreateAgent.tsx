import { useState } from "react";
import { Button } from "../Button";
import { Dialog } from "@headlessui/react";
import { Card } from "../Card";
import { useZodForm } from "~/hooks/useZodForm";
import { createAgentSchema } from "~/schemas/agent";
import { Input } from "../Input";
import { api } from "~/utils/api";

export const CreateAgentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const utils = api.useContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setError,
  } = useZodForm({ schema: createAgentSchema });

  const createAgent = api.agents.create.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onError: (err) => {
      if (err.data?.code === "BAD_REQUEST") {
        setError("email", { message: err.message });
      }
      setLoading(false);
    },
    onSuccess: async () => {
      await utils.agents.list.invalidate();
      setLoading(false);
      setIsOpen(false);
    },
  });

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create new agent</Button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white" as={Card}>
            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
              Create a new Agent!
            </Dialog.Title>

            <form
              className="mt-4 grid w-full grid-cols-1 gap-4 md:mt-8 md:gap-8"
              onSubmit={(e) => {
                void handleSubmit((values) => createAgent.mutate(values))(e);
              }}
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
                {...register("password")}
                label="Password*"
                id="password"
                type="password"
                autoComplete="password"
                required
                error={errors.password}
              />
              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  intent="secondary"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={(!isDirty && !isValid) || loading}
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
