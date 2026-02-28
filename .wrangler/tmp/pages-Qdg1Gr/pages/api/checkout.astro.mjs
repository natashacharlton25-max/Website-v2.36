globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOrGetUser, a as canUserDownload, b as createDownloadToken, d as addPendingDownloads, e as createVerificationToken } from '../../chunks/db_nxfieeIM.mjs';
import { s as sendLimitReachedEmail, a as sendExistingUserDownloadEmail, b as sendVerificationEmail } from '../../chunks/emailit_DbBqjRmG.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request, url, locals }) => {
  try {
    const runtime = locals.runtime;
    const db = runtime?.env?.DB;
    if (!db) {
      console.error("D1 database not available");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database not configured"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const data = await request.json();
    const { firstName, lastName, email, newsletter, downloads } = data;
    if (!firstName || !email || !downloads?.length) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid email address"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { user } = await createOrGetUser(db, email, firstName, lastName, newsletter);
    const siteUrl = url.origin;
    const { allowed, remaining, limit } = await canUserDownload(db, user);
    if (!allowed) {
      const resetDate = /* @__PURE__ */ new Date();
      resetDate.setMonth(resetDate.getMonth() + 1);
      resetDate.setDate(1);
      await sendLimitReachedEmail(email, firstName, user.tier, limit, resetDate);
      return new Response(
        JSON.stringify({
          success: false,
          error: "download_limit_reached",
          message: `You've reached your monthly limit of ${limit} downloads. Your limit resets on ${resetDate.toLocaleDateString()}.`,
          limit,
          tier: user.tier
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    if (downloads.length > remaining && remaining !== Infinity) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "too_many_downloads",
          message: `You can only download ${remaining} more item${remaining !== 1 ? "s" : ""} this month. Please reduce your selection.`,
          remaining,
          limit,
          tier: user.tier
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (user.email_verified === 1) {
      const downloadLinks = await Promise.all(
        downloads.map(async (d) => {
          const token = await createDownloadToken(db, user.id, d.id);
          return {
            name: d.name,
            url: `${siteUrl}/api/download?token=${token}`
          };
        })
      );
      await sendExistingUserDownloadEmail(
        email,
        firstName,
        downloadLinks,
        user.tier,
        remaining - downloads.length
      );
      return new Response(
        JSON.stringify({
          success: true,
          verified: true,
          message: "Download links have been sent to your email!"
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    await addPendingDownloads(db, user.id, downloads);
    const verificationToken = await createVerificationToken(db, user.id);
    const emailResult = await sendVerificationEmail(email, firstName, verificationToken, siteUrl);
    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send verification email. Please try again."
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        verified: false,
        message: "Please check your email to verify and receive your downloads!"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred. Please try again."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
