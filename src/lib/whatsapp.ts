import { WHATSAPP_NUMBER } from '@/lib/supabase';
import type { CartItem } from '@/context/CartContext';

export type OrderDetails = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions: string;
  deliveryFee: number;
  total: number;
};

export function formatWhatsAppOrder(items: CartItem[], details: OrderDetails): string {
  const lines: string[] = [];

  lines.push('*🍪 Design Arena Cookies — New Order*');
  lines.push('');
  lines.push('*👤 Customer Details*');
  lines.push(`Name: ${details.customerName}`);
  lines.push(`Phone: ${details.phone}`);
  if (details.email) lines.push(`Email: ${details.email}`);
  lines.push(`Address: ${details.address}`);
  lines.push(`Delivery Date: ${details.deliveryDate}`);
  lines.push(`Delivery Time: ${details.deliveryTime}`);
  lines.push('');

  lines.push('*🛍 Order Items*');
  items.forEach((item, idx) => {
    lines.push(
      `${idx + 1}. ${item.product.name} x${item.quantity} — ₹${(
        item.product.price * item.quantity
      ).toFixed(2)}`
    );
  });

  lines.push('');
  lines.push(`Subtotal: ₹${(details.total - details.deliveryFee).toFixed(2)}`);
  lines.push(`Delivery Fee: ₹${details.deliveryFee.toFixed(2)}`);
  lines.push(`*✅ Total: ₹${details.total.toFixed(2)}*`);

  if (details.specialInstructions) {
    lines.push('');
    lines.push(`Special Instructions: ${details.specialInstructions}`);
  }

  lines.push('');
  lines.push('📩 Sent via designarenacookies.com');

  return lines.join('\n');
}

export function openWhatsApp(message: string) {
  const url = `https://wa.me/919347244479?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function sanitizeText(value: string): string {
  return value.replace(/[<>]/g, (ch) => (ch === '<' ? '&lt;' : '&gt;')).trim();
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^[+]?[\d\s()-]{7,}$/.test(phone);
}