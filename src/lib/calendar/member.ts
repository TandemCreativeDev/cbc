import { getPayload } from "payload";
import config from "../../payload.config";

/** Whether the request carries a signed-in band member's session. */
export async function isMember(headers: Headers): Promise<boolean> {
  if (!headers.get("cookie")?.includes("payload-token")) return false;
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  return Boolean(user);
}
