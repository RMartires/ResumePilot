const ACCEPT_PHRASES = [
  "yes",
  "yep",
  "yeah",
  "yup",
  "apply",
  "confirm",
  "ok",
  "okay",
  "sure",
  "do it",
  "go ahead",
  "please apply",
  "sounds good",
  "looks good",
  "that works",
];

const DECLINE_PHRASES = [
  "no",
  "nope",
  "decline",
  "cancel",
  "skip",
  "don't",
  "do not",
  "never mind",
  "nevermind",
];

function matchesIntent(text: string, phrases: string[]): boolean {
  const normalized = text.trim().toLowerCase();
  return phrases.some(
    (phrase) =>
      normalized === phrase ||
      normalized.startsWith(`${phrase} `) ||
      normalized.startsWith(`${phrase}.`) ||
      normalized.startsWith(`${phrase}!`),
  );
}

export function isAcceptIntent(text: string): boolean {
  return matchesIntent(text, ACCEPT_PHRASES);
}

export function isDeclineIntent(text: string): boolean {
  return matchesIntent(text, DECLINE_PHRASES);
}

export function assistantOfferedToApply(text: string): boolean {
  return /\b(would you like|shall i|should i|want me to apply|like me to apply|apply this)\b/i.test(
    text,
  );
}
