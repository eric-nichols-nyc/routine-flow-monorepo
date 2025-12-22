import {
  SignInWithEmail,
  SignOut,
  SignUpWithEmail,
} from "@/components/auth-components";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Separator } from "@repo/design-system/components/ui/separator";
import { headers } from "next/headers";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-neutral-800 rounded-lg p-6 max-w-xl w-full">
        <h1 className="text-white text-xl mb-4 text-center">
          Auth.js + Prisma
        </h1>

        {!session ? (
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <p>Sign Up</p>
              <SignUpWithEmail />
            </div>
            <Separator />
            <div className="text-center">
              <p>Sign In</p>
              <SignInWithEmail />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-300">Signed in as:</p>
              <p className="text-white">{session.user?.email}</p>
            </div>

            <div className="text-center">
              <p className="text-gray-300">Data fetched from DB with Prisma:</p>
            </div>

            <div className="bg-neutral-900 rounded p-3">
              <pre className="text-xs text-gray-300">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div className="text-center">
              <SignOut />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
