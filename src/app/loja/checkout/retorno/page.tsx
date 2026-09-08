import { CheckoutRetorno } from "@/components/store/CheckoutRetorno";

interface RetornoPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function RetornoPage({ searchParams }: RetornoPageProps) {
  const { status } = await searchParams;
  return <CheckoutRetorno status={status ?? "pending"} />;
}
