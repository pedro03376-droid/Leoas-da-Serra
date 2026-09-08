import { CheckoutForm } from "@/components/store/CheckoutForm";

export const metadata = { title: "Finalizar compra · Loja Leoas da Serra" };

export default function CheckoutPage() {
  return (
    <section className="px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono-label text-xs text-red">Checkout</p>
        <h1 className="font-display mt-3 text-3xl text-white sm:text-4xl">Finalizar compra</h1>
        <div className="mt-10">
          <CheckoutForm />
        </div>
      </div>
    </section>
  );
}
