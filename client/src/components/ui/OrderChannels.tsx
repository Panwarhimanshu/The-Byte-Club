import { useState } from 'react';
import { MessageCircle, Instagram } from 'lucide-react';
import { track } from '@/lib/analytics';

/** Where customers place orders. Keep in sync with the phone number on the Contact page. */
export const WHATSAPP_URL = 'https://wa.me/917016459825?text=Hi%20Byte%20Club%2C%20I%27d%20like%20to%20order';
export const INSTAGRAM_DM_URL = 'https://ig.me/m/the_byte.club';

/** Order buttons for WhatsApp and Instagram DM — shown wherever a visitor might want to order. */
export function OrderChannels({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'space-y-3' : 'card-byte space-y-4 p-6 text-center sm:p-8'}>
      {!compact && (
        <>
          <p className="font-display text-lg font-bold uppercase sm:text-xl">Order now</p>
          <p className="text-sm text-muted">
            We take orders on WhatsApp and Instagram DM. Message us with what you want. Pickup, or free delivery on
            orders above ₹1,500.
          </p>
        </>
      )}
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('order_whatsapp_click')}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-[#25d366] px-6 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90 btn-focus"
        >
          <MessageCircle size={18} /> Order on WhatsApp
        </a>
        <a
          href={INSTAGRAM_DM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('order_instagram_click')}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-pill border border-border px-6 font-display text-sm font-bold uppercase tracking-wide transition hover:border-primary hover:text-primary btn-focus"
        >
          <Instagram size={18} /> Order on Instagram DM
        </a>
      </div>
    </div>
  );
}

/**
 * Per-product order buttons. WhatsApp opens with the product already in the message.
 * Instagram DMs can't be pre-filled from a link, so that button copies the message
 * to the clipboard and opens the DM — the customer pastes it and sends.
 */
export function ProductOrderButtons({ name, price }: { name: string; price: string }) {
  const [copied, setCopied] = useState(false);
  const message = `Hi Byte Club! I'd like to order: ${name} (${price}). Pickup or delivery?`;
  const waUrl = `https://wa.me/917016459825?text=${encodeURIComponent(message)}`;

  const onInstagram = async () => {
    track('order_instagram_click', { product: name });
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      /* clipboard blocked — the DM still opens */
    }
    window.open(INSTAGRAM_DM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('order_whatsapp_click', { product: name })}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-[#25d366] px-5 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90 btn-focus"
        >
          <MessageCircle size={16} /> Order on WhatsApp
        </a>
        <button
          type="button"
          onClick={onInstagram}
          className="inline-flex h-11 items-center gap-2 rounded-pill border border-border px-5 font-display text-sm font-bold uppercase tracking-wide transition hover:border-primary hover:text-primary btn-focus"
        >
          <Instagram size={16} /> Order on Instagram
        </button>
      </div>
      {copied && (
        <p className="text-xs text-muted">Order message copied — paste it in the Instagram chat and send.</p>
      )}
    </div>
  );
}
