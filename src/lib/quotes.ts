export const happyQuotes = [
  "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
  "The purpose of our lives is to be happy. - Dalai Lama",
  "Happiness is when what you think, what you say, and what you do are in harmony. - Mahatma Gandhi",
  "For every minute you are angry you lose sixty seconds of happiness. - Ralph Waldo Emerson",
  "Happiness is not a goal; it is a by-product. - Eleanor Roosevelt",
  "The most important thing is to enjoy your life—to be happy—it's all that matters. - Audrey Hepburn",
  "Happiness depends upon ourselves. - Aristotle",
  "Count your age by friends, not years. Count your life by smiles, not tears. - John Lennon",
  "The happiness of your life depends upon the quality of your thoughts. - Marcus Aurelius",
  "Be happy for this moment. This moment is your life. - Omar Khayyam"
];

export const sadQuotes = [
  "Tears are words that need to be written. - Paulo Coelho",
  "The word 'happy' would lose its meaning if it were not balanced by sadness. - Carl Jung",
  "Heavy hearts, like heavy clouds in the sky, are best relieved by the letting of a little water. - Christopher Morley",
  "Sadness flies away on the wings of time. - Jean de La Fontaine",
  "Every human walks around with a certain kind of sadness. - Haruki Murakami",
  "The walls we build around us to keep sadness out also keeps out the joy. - Jim Rohn",
  "Experiencing sadness and anger can make you feel more creative. - Moderat",
  "We must understand that sadness is an ocean, and sometimes we drown, while other days we are forced to swim. - R.M. Drake",
  "Sadness is but a wall between two gardens. - Khalil Gibran",
  "Even a happy life cannot be without a measure of darkness. - Carl Jung"
];

export const getRandomQuote = (type: 'happy' | 'sad'): string => {
  const quotes = type === 'happy' ? happyQuotes : sadQuotes;
  return quotes[Math.floor(Math.random() * quotes.length)];
};