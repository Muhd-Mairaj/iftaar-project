import { DevTools, FormatSimple, Tolgee } from '@tolgee/react';

export const ALL_LOCALES = ['en', 'ar'];
export const DEFAULT_LOCALE = 'en';

export async function getTolgee(locale: string) {
  const tolgee = Tolgee()
    .use(FormatSimple())
    .use(DevTools())
    .init({
      language: locale,
      staticData: {
        en: () => import('../messages/en.json'),
        ar: () => import('../messages/ar.json'),
      },
    });

  await tolgee.run();

  return tolgee;
}
