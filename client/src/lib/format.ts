import { storeSettings } from '@/data/brand';

export function formatMoney(value: number, currency = storeSettings.currency) {
  const rounded = Math.round(value);
  return `${currency}${rounded.toLocaleString('en-IN')}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function pluralize(n: number, one: string, many = `${one}s`) {
  return n === 1 ? one : many;
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
