// app/qa/page.jsx
import { permanentRedirect } from "next/navigation";

export default function QaRootPage() {
  permanentRedirect("/qa/design_process");
}
