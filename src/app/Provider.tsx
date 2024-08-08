"use client";

import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

type Props = {
  children?: React.ReactNode;
};

export const Provider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <Suspense fallback={null}>{children}</Suspense>
    </SessionProvider>
  );
};
