// app/news/[slug]/CustomNews.tsx
/* Server Component：完全照後台 HTML 呈現；不套 Tailwind、不改段落距離 */
export default function CustomNews({ html = "" }: { html?: string }) {
  return (
    <section style={{ background: "transparent", paddingTop: 140 }}>
      <div
        id="cms-html"
        className="rich-content"
        // 不使用任何 className，避免 tailwind/prose 影響
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style>
        {`
         table{
          margin-top:30px;
        }
          /* 關鍵：把這個區塊與其子元素的樣式還原成瀏覽器預設，避免被全站 reset 影響 */
          #cms-html, #cms-html *:not(svg) {
            all: revert;
          }
          /* 只做一件事：圖片自適應，避免超出畫面 */
          #cms-html img {
            max-width: 100%;
            height: auto;
          }
            
        `}
      </style>
    </section>
  );
}
