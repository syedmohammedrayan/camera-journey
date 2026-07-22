import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(1000),
  website: z.string().optional(), // honeypot
});

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json(
            { ok: false, message: "Invalid JSON body." },
            { status: 400 },
          );
        }

        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { ok: false, message: "Please check the form and try again." },
            { status: 400 },
          );
        }

        // Silent honeypot — pretend success against bots.
        if (parsed.data.website && parsed.data.website.length > 0) {
          return Response.json({ ok: true, message: "Message received. Thank you." });
        }

        // No mailer configured — persist to server logs so submissions are
        // discoverable during development. Wire an email provider or Cloud
        // insert here when the user asks for delivery.
        console.log("[contact]", {
          name: parsed.data.name,
          email: parsed.data.email,
          length: parsed.data.message.length,
          at: new Date().toISOString(),
        });

        return Response.json({
          ok: true,
          message: "Message received. I'll reply within two working days.",
        });
      },
    },
  },
});
