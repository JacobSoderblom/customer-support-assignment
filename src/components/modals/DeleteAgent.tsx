import { type FC, useState } from "react";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "../Button";
import { Dialog } from "@headlessui/react";
import { Card } from "../Card";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export const DeleteAgentModal: FC<{ id: string }> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const utils = api.useContext();
  const { push } = useRouter();

  const deleteAgent = api.agents.delete.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onError: () => {
      setError(true);
      setLoading(false);
    },
    onSuccess: async () => {
      await utils.agents.list.invalidate();
      setLoading(false);
      setIsOpen(false);
      void push("/portal/agents");
    },
  });

  return (
    <>
      <Button onClick={() => setIsOpen(true)} intent="secondary">
        Delete
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white" as={Card}>
            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
              Delete Agent
            </Dialog.Title>
            <Dialog.Description className="mt-4 md:mt-8">
              Are you sure you want to delete this agent?
            </Dialog.Description>

            {!!error ? (
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
                      We could not delete this agent, please try again!
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex justify-between gap-4 md:mt-8">
              <Button
                type="button"
                intent="secondary"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={() => deleteAgent.mutate(id)}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
