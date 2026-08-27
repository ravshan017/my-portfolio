"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { SectionHeading } from "@/components/section-heading";
import { socialIcons } from "@/components/icons";
import { site } from "@/data/site.config";
import { useI18n } from "@/lib/i18n";
import { useSound } from "@/components/sound-provider";

interface FormValues {
  name: string;
  email: string;
  message: string;
  /** honeypot против ботов — люди его не видят */
  company?: string;
}

export function Contact() {
  const { t } = useI18n();
  const { play } = useSound();
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  const onSubmit = async (values: FormValues) => {
    if (values.company) {
       setStatus("ok");
       play("success");
       return;
     }
     try {
       const res = await fetch("/api/contact", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           name: values.name,
           email: values.email,
           message: values.message,
         }),
       });
       if (!res.ok) throw new Error(String(res.status));
       setStatus("ok");
       play("success");
       reset({ name: "", email: "", message: "", company: "" });
     } catch {
       setStatus("error");
       play("error");
     }
  };

  const inputCls =
    "w-full border border-line bg-panel-2 px-4 py-3 text-sm text-mist placeholder:text-muted/60 transition-colors focus:border-sora focus:outline-none";

  return (
    <section id="contact" className="relative scroll-mt-20 py-28 md:py-36">
      <div
        aria-hidden="true"
        className="bg-sora-grid-fine pointer-events-none absolute inset-x-0 top-0 h-full opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <SectionHeading
            fig={t("contact.fig")}
            tag={t("contact.tag")}
            title={t("contact.title")}
            subtitle={t("contact.subtitle")}
            kana={t("contact.kana")}
          />

          <form
            data-reveal
            data-reveal-delay="0.05"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-10 flex flex-col gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                  {t("contact.form.name")} *
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder={t("contact.form.namePlaceholder")}
                  aria-invalid={Boolean(errors.name)}
                  className={inputCls}
                  {...register("name", {
                    required: t("contact.errors.required"),
                    minLength: { value: 2, message: t("contact.errors.nameMin") },
                  })}
                />
                {errors.name && (
                  <span role="alert" className="mt-1 block font-mono text-xs text-sakura-bright">
                    {errors.name.message}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                  {t("contact.form.email")} *
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder={t("contact.form.emailPlaceholder")}
                  aria-invalid={Boolean(errors.email)}
                  className={inputCls}
                  {...register("email", {
                    required: t("contact.errors.required"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                      message: t("contact.errors.email"),
                    },
                  })}
                />
                {errors.email && (
                  <span role="alert" className="mt-1 block font-mono text-xs text-sakura-bright">
                    {errors.email.message}
                  </span>
                )}
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                {t("contact.form.message")} *
              </span>
              <textarea
                rows={5}
                placeholder={t("contact.form.messagePlaceholder")}
                aria-invalid={Boolean(errors.message)}
                className={`${inputCls} resize-y`}
                {...register("message", {
                  required: t("contact.errors.required"),
                  minLength: { value: 10, message: t("contact.errors.messageMin") },
                })}
              />
              {errors.message && (
                <span role="alert" className="mt-1 block font-mono text-xs text-sakura-bright">
                  {errors.message.message}
                </span>
              )}
            </label>

            {/* Honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              {...register("company")}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="corner-ticks w-fit bg-sora px-8 py-3.5 font-mono text-xs tracking-[0.2em] text-white uppercase transition-all hover:bg-sora-bright hover:shadow-[0_10px_30px_rgba(61,99,221,0.35)] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? t("contact.form.sending") : t("contact.form.submit")}
            </button>

            {status === "ok" && (
              <p role="status" className="font-mono text-sm text-sora-bright">
                вњ“ {t("contact.form.success")}
              </p>
            )}
            {status === "error" && (
              <p role="alert" className="text-sm text-sakura-bright">
                {t("contact.form.error")}{" "}
                <a href={`mailto:${site.email}`} className="underline underline-offset-4">
                  {site.email}
                </a>
              </p>
            )}
          </form>
        </div>

        {/* Прямые каналы */}
        <aside
          data-reveal
          data-reveal-delay="0.1"
          className="corner-ticks relative h-fit border border-line bg-panel p-6 lg:mt-auto"
        >
          <p className="flex items-center gap-3 text-sm text-mist">
            <span className="size-2 rounded-full bg-sora animate-pulse-dot" aria-hidden="true" />
            {t("contact.availability")}
          </p>

          <h3 className="mt-8 font-mono text-xs tracking-[0.3em] text-muted uppercase">
            {t("contact.directTitle")}
          </h3>

          <a
            href={`mailto:${site.email}`}
            className="mt-3 block font-mono text-sm break-all text-sora-bright underline-offset-4 hover:underline"
          >
            {site.email}
          </a>

          <ul className="mt-6 flex flex-col gap-3">
            {site.socials.map((social) => {
              const Icon = socialIcons[social.id];
              return (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-mist"
                  >
                    <span className="grid size-9 place-items-center border border-line bg-panel-2">
                      <Icon className="size-4 text-sora-bright transition-colors group-hover:text-sakura-bright" />
                    </span>
                    {social.label}
                    <span className="ml-auto font-mono text-xs">{social.handle}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="/cv.pdf"
            download
            className="corner-ticks mt-6 flex items-center justify-center gap-2 border border-sora/50 bg-sora/10 px-4 py-3 font-mono text-xs tracking-[0.15em] uppercase text-sora-bright transition-colors hover:border-sakura hover:text-sakura-bright"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
            </svg>
            {t("contact.cv")}
          </a>
        </aside>
      </div>
    </section>
  );
}
