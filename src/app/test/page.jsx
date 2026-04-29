// /app/contact/page.jsx 或 /pages/contact.jsx
import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

export default function ContactPage() {
  const humanAddr =
    "No. 273, Wuquan 3rd Street, West District, Taichung City 403, Taiwan";
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">聯絡我們</h1>
      <p className="mb-6">403 台中市西區五權三街 273 號（{humanAddr}）</p>
      <LeafletMap address={humanAddr} />
    </main>
  );
}
