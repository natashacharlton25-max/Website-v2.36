globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DSZs3x4S.mjs';
import { a as $$BaseLayout } from '../chunks/BaseLayout_RnOOHI6G.mjs';
import { f as verifyToken, a as canUserDownload, b as createDownloadToken, g as clearPendingDownloads } from '../chunks/db_nxfieeIM.mjs';
import { c as sendDownloadEmail } from '../chunks/emailit_DbBqjRmG.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://yourdomain.com");
const $$Verify = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Verify;
  const runtime = Astro2.locals.runtime;
  const db = runtime?.env?.DB;
  const token = Astro2.url.searchParams.get("token");
  let status = "invalid";
  let message = "";
  if (!db) {
    status = "error";
    message = "Database not configured. Please try again later.";
  } else if (token) {
    try {
      const result = await verifyToken(db, token);
      if (result) {
        const { user, pendingDownloads } = result;
        const { allowed, remaining } = await canUserDownload(db, user);
        if (allowed && pendingDownloads.length > 0) {
          const siteUrl = Astro2.url.origin;
          const downloadLinks = await Promise.all(
            pendingDownloads.map(async (d) => {
              const downloadToken = await createDownloadToken(db, user.id, d.asset_id);
              return {
                name: d.asset_name,
                url: `${siteUrl}/api/download?token=${downloadToken}`
              };
            })
          );
          const emailResult = await sendDownloadEmail(
            user.email,
            user.first_name,
            downloadLinks,
            user.tier,
            remaining - pendingDownloads.length
          );
          if (emailResult.success) {
            await clearPendingDownloads(db, user.id);
            status = "success";
            message = "Your email has been verified and your download links have been sent!";
          } else {
            status = "error";
            message = "Your email was verified but we had trouble sending the download links. Please try again.";
          }
        } else if (!allowed) {
          status = "error";
          message = "Your email was verified, but you have reached your monthly download limit.";
        } else {
          status = "success";
          message = "Your email has been verified! You can now request downloads.";
        }
      } else {
        status = "expired";
        message = "This verification link has expired or has already been used.";
      }
    } catch (error) {
      console.error("Verification error:", error);
      status = "error";
      message = "An error occurred during verification. Please try again.";
    }
  } else {
    status = "invalid";
    message = "No verification token provided.";
  }
  const titles = {
    success: "Email Verified!",
    expired: "Link Expired",
    invalid: "Invalid Link",
    error: "Something Went Wrong"
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Email Verification | Walking with a Smile", "description": "Verify your email to receive your downloads" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="section" style="text-align: center; padding-top: var(--space-3xl);"> <h1>${titles[status]}</h1> <p>${message}</p> </div> ` })}`;
}, "C:/Users/Business/Website v2.36/src/pages/verify.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/verify.astro";
const $$url = "/verify";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Verify,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
