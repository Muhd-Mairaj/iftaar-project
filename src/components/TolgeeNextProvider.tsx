'use client';

import { TolgeeProvider, Tolgee, FormatSimple, DevTools } from '@tolgee/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useMemo } from 'react';

type Props = {
  children: ReactNode;
  locale: string;
};

export const TolgeeNextProvider = ({ children, locale }: Props) => {
  const router = useRouter();

  const tolgee = useMemo(() => {
    return Tolgee()
      .use(FormatSimple())
      .use(DevTools())
      .init({
        language: locale,
        staticData: {
          en: () => import('../../messages/en.json'),
          ar: () => import('../../messages/ar.json'),
        },
      });
  }, [locale]);

  return (
    <TolgeeProvider
      tolgee={tolgee}
      fallback="Loading..."
    >
      {children}
    </TolgeeProvider>
  );
};
