import { useState, useEffect, useRef } from 'react';
import { translateText } from '../utils/localizationUtils';

/**
 * Хук для управления переводами текста
 * @param {string} text - Текст для перевода
 * @param {string} from - Исходный язык
 * @param {string} to - Язык перевода
 * @returns {Object} Объект с состоянием перевода
 */
export const useTranslation = (text, from = 'en', to = 'ru') => {
  const [translatedText, setTranslatedText] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let ignore = false;
    
    if (!text) {
      setTranslatedText(null);
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    translateText(text, to, from)
      .then(translated => {
        if (!ignore) {
          setTranslatedText(translated);
          setIsTranslating(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setIsTranslating(false);
        }
      });

    return () => { ignore = true; };
  }, [text, from, to]);

  return { translatedText, isTranslating };
};

function arraysEqual(a, b) {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Хук для перевода массива текстов
 * @param {Array} texts - Массив текстов для перевода
 * @param {string} from - Исходный язык
 * @param {string} to - Язык перевода
 * @returns {Object} Объект с состоянием перевода
 */
export const useBatchTranslation = (texts, from = 'en', to = 'ru') => {
  const [translatedTexts, setTranslatedTexts] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const prevTexts = useRef([]);

  useEffect(() => {
    if (arraysEqual(prevTexts.current, texts)) return;
    prevTexts.current = texts;

    if (!texts || texts.length === 0) {
      setTranslatedTexts([]);
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    Promise.all(
      texts.map(text => translateText(text, to, from))
    )
      .then(translatedArr => {
        setTranslatedTexts(translatedArr);
        setIsTranslating(false);
      })
      .catch(e => {
        console.error('Ошибка при переводе текстов:', e);
        setIsTranslating(false);
      });
  }, [texts, from, to]);

  return { translatedTexts, isTranslating };
}; 