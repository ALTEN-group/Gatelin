// @ts-check
import { timingSafeEqual } from "node:crypto";
import { log } from "@dwtechs/winstan";

const cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";

export function checkRefreshToken(req, res, next) {
	const brt = req.body?.refreshToken ?? req.cookies?.[cookieName];
	const crt = res.locals.consumer.refreshToken;
	const tokensMatch =
		typeof brt === "string" &&
		typeof crt === "string" &&
		brt.length === crt.length &&
		timingSafeEqual(Buffer.from(brt), Buffer.from(crt));
	log.debug(() => `checkRefreshToken(match=${tokensMatch})`);

	if (!tokensMatch) return next({ statusCode: 401, message: "Unauthorized" });

	next();
}
