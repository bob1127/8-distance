// app/qa/page.jsx
import { redirect } from "next/navigation";

export default function QaRootPage() {
  // 將 /qa 直接轉址到預設的第一個分類
  redirect("/qa/design_process");
}
