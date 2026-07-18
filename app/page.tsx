export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        backgroundColor: "#f8fafc",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Yu Gothic', sans-serif",
      }}
    >
      <div style={{ maxWidth: 640, width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0f2942", marginBottom: 12 }}>
          美容室向け LINE Bot
        </h1>
        <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, marginBottom: 32 }}>
          お客様からのLINEメッセージにAIが自動で回答するシステムです。
          <br />
          回答に自信がない場合はオーナーへ通知し、管理画面からFAQ・メニュー・
          お知らせを管理できます。
    le={{ display: "inline-block", padding: "12px 28px", backgroundColor: "#1d4ed8", color: "#fff", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 15 }}>
            管理画面を見る
          </a>
          <a href="https://github.com/nobunori47/line-bot-mvp" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "12px 28px", backgroundColor: "#fff", color: "#1d4ed8", border: "1px solid #1d4ed8", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 15 }}>
            GitHubで見る
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, textAlign: "left" }}>
          {[
            ["主な機能", "FAQ自動応答 / エスカレーション通知 / 会話ログ"],
            ["AI", "Claude API"],
            ["技術スタック", "Next.js / TypeScript / Supabase"],
          ].map(([label, value]) => (
            <div key={label} style={{ backgroundColox" }}>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 14, color: "#0f2942", fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
