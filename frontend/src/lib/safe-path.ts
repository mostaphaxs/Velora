// Where to send someone after signing in. Only same-site paths like "/checkout" are
// allowed, so a crafted link can't bounce customers to another website.
export function safeNextPath(value: unknown) {
  const path = typeof value === "string" ? value : "";
  return /^\/(?!\/)[\w\-/]*$/.test(path) ? path : "/account";
}
