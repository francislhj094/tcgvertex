import { useCountry } from '../context/CountryContext';
import { en } from './en';
import { de } from './de';

const translations = {
  en,
  de
};

export const useTranslation = () => {
  const { country } = useCountry();

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[country.language];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${country.language}`);
        return key;
      }
    }

    return value;
  };

  return { t };
};
