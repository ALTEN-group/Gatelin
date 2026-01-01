// @ts-check
import { log } from "@dwtechs/winstan";

export default function checkRefreshToken(req, _res, next) {
  
  const brt = req.body.refreshToken;
  const crt = req.body.rows[0].refreshToken;
  log.debug(`Check refresh token: ${brt}`);
  
  if (brt!== crt)
    return next({statusCode: 404, message: "Refresh token not found"});

  next();

}
