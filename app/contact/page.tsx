"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 2L58 18V50L30 66L2 50V18Z' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M30 68L58 84V104' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M2 84L30 68' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3C/svg%3E")`;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontFamily: "var(--font-opensans)",
  fontSize: "14px",
  color: "#111",
  backgroundColor: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function set(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Dark hero */}
      <section style={{
        backgroundColor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
        minHeight: "260px",
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: HEX_PATTERN,
          backgroundSize: "60px 104px",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse 50% 80% at 15% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "1200px", margin: "0 auto",
          padding: "60px 24px 120px",
          width: "100%",
        }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "11px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.25em",
            color: "#c9a84c", marginBottom: "12px",
          }}>
            Tu smo za vas
          </p>
          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 900,
            letterSpacing: "0.04em",
            color: "#c9a84c",
            margin: 0,
          }}>
            Stopite v stik z nami.
          </h1>
        </div>
        {/* Diagonal cut to white */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
          backgroundColor: "#ffffff",
          clipPath: "polygon(0 100%, 100% 0%, 100% 100%)",
        }} />
      </section>

      {/* White content section */}
      <section style={{ backgroundColor: "#fff", color: "#111", padding: "64px 0 80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }}>

            {/* Left: form */}
            <div>
              <h2 style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "22px", fontWeight: 800,
                color: "#111", marginBottom: "28px",
              }}>
                Pošljite nam sporočilo
              </h2>

              {status === "success" ? (
                <div style={{
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  padding: "24px",
                  fontFamily: "var(--font-opensans)",
                  fontSize: "15px",
                  color: "#166534",
                }}>
                  Sporočilo poslano! Odgovorili vam bomo v 24 urah.
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Field label="Ime">
                      <input required type="text" placeholder="Vaše ime" value={form.name} onChange={set("name")} style={inputStyle} />
                    </Field>
                    <Field label="E-pošta">
                      <input required type="email" placeholder="vas@email.com" value={form.email} onChange={set("email")} style={inputStyle} />
                    </Field>
                  </div>
                  <Field label="Zadeva">
                    <input required type="text" placeholder="O čem gre?" value={form.subject} onChange={set("subject")} style={inputStyle} />
                  </Field>
                  <Field label="Sporočilo">
                    <textarea
                      required
                      rows={6}
                      placeholder="Kako vam lahko pomagamo?"
                      value={form.message}
                      onChange={set("message")}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </Field>

                  {status === "error" && (
                    <p style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "#dc2626", margin: 0 }}>
                      Prišlo je do napake. Prosimo, poskusite znova ali nam pišite neposredno na e-pošto.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    style={{
                      alignSelf: "flex-start",
                      padding: "14px 36px",
                      backgroundColor: "#c9a84c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "2px",
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 700,
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      cursor: status === "loading" ? "not-allowed" : "pointer",
                      opacity: status === "loading" ? 0.7 : 1,
                      transition: "opacity 0.2s, background 0.2s",
                    }}
                  >
                    {status === "loading" ? "Pošiljanje…" : "Pošlji"}
                  </button>
                </form>
              )}
            </div>

            {/* Right: gold info panel */}
            <div style={{
              backgroundColor: "#c9a84c",
              borderRadius: "6px",
              padding: "36px 28px",
              color: "#fff",
            }}>
              <h3 style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "18px", fontWeight: 800,
                color: "#fff",
                marginBottom: "24px",
                lineHeight: 1.3,
              }}>
                Zadovoljstvo strank je naša prioriteta!
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <Mail size={18} style={{ flexShrink: 0, color: "#fff", opacity: 0.85 }} />
                <a href="mailto:info@slopeps.com" style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700, fontSize: "14px",
                  color: "#fff", textDecoration: "none",
                }}>
                  info@slopeps.com
                </a>
              </div>

              <p style={{
                fontFamily: "var(--font-opensans)",
                fontSize: "14px", lineHeight: 1.7,
                color: "rgba(255,255,255,0.85)",
                margin: 0,
              }}>
                Imate vprašanja? Običajno odgovorimo v 24 urah.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{
        fontFamily: "var(--font-montserrat)",
        fontWeight: 700, fontSize: "11px",
        textTransform: "uppercase", letterSpacing: "0.1em",
        color: "#333",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}
