import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";

type Status = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = "Please share your name.";
  else if (name.length > 100) errors.name = "Keep it under 100 characters.";
  if (!email.trim()) errors.email = "An email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "That email looks off.";
  if (!message.trim()) errors.message = "A short note, please.";
  else if (message.length > 1000) errors.message = "Please keep it under 1000 characters.";
  return errors;
}

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const website = String(data.get("website") ?? ""); // honeypot

    const fieldErrors = validate(name, email, message);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("submitting");
    setServerMessage("");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (!res.ok || !body.ok) {
        setStatus("error");
        setServerMessage(body.message ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setServerMessage(body.message ?? "Message received. Thank you.");
      form.reset();
    } catch {
      setStatus("error");
      setServerMessage("Network error. Please try again.");
    }
  }

  return (
    <section
      id="contact"
      className="relative border-t border-hairline px-6 py-32 lg:px-10 lg:py-40"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal className="mono-label mb-6 flex items-center gap-3">
            <span className="font-mono text-foreground/40">10</span>
            <span className="h-px w-8 bg-amber" />
            Correspondence
          </Reveal>
          <Reveal
            as="h2"
            delay={0.1}
            className="font-display text-5xl font-medium leading-[1.02] tracking-[-0.03em] text-foreground md:text-6xl"
          >
            <span id="contact-heading">
              A note, if you'd <span className="italic text-amber">like.</span>
            </span>
          </Reveal>
          <Reveal delay={0.25} className="mt-8 max-w-md text-base leading-relaxed text-foreground/60">
            Commissions, collaborations, or a kind word — the darkroom door is
            open. Replies typically arrive within two working days.
          </Reveal>
          <Reveal delay={0.35} className="mt-10 space-y-3 border-t border-hairline pt-6 font-mono text-[11px] text-foreground/50">
            <div className="flex items-center gap-3">
              <span className="mono-label text-foreground/40">Studio</span>
              <span>hello@aperture-journal.co</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="mono-label text-foreground/40">Hours</span>
              <span>Mon – Fri · 09:00–18:00 GMT</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-sm border border-hairline bg-titanium/40 p-8 backdrop-blur-sm lg:p-10"
          >
            {/* Honeypot */}
            <div className="hidden" aria-hidden>
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field
                id="contact-name"
                name="name"
                label="Name"
                autoComplete="name"
                error={errors.name}
                required
              />
              <Field
                id="contact-email"
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                error={errors.email}
                required
              />
            </div>
            <div className="mt-6">
              <label
                htmlFor="contact-message"
                className="mono-label mb-2 block text-foreground/50"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                maxLength={1000}
                required
                aria-invalid={errors.message ? "true" : undefined}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                className="w-full resize-none rounded-sm border border-hairline bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                placeholder="Tell me about the project…"
              />
              {errors.message && (
                <p id="contact-message-error" className="mt-2 font-mono text-[11px] text-copper">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="group inline-flex items-center gap-3 rounded-full border border-amber bg-amber px-7 py-3 text-sm font-medium text-background transition-all hover:bg-transparent hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Send message"}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
              <div
                role="status"
                aria-live="polite"
                className={`font-mono text-[11px] ${
                  status === "success"
                    ? "text-amber"
                    : status === "error"
                      ? "text-copper"
                      : "text-foreground/40"
                }`}
              >
                {serverMessage}
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}

function Field({ id, name, label, type = "text", autoComplete, required, error }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mono-label mb-2 block text-foreground/50">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        maxLength={type === "email" ? 255 : 100}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-sm border border-hairline bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 font-mono text-[11px] text-copper">
          {error}
        </p>
      )}
    </div>
  );
}
