// @ts-check
import { log } from "@dwtechs/winstan";

import entity from "../entities/consumer.js";
import csmerSvc from "../services/consumer.js";

// function validate(req, res, next) {
//   req.body = entity.normalize(req.body);
//   req.ignoreExpiration = true;
//   next(entity.validate(req.body, req.method));
// }


function getOne(req, res, next) {
  if (!req.isProtected) return next(); // if no jwt required for this route

  const consumerId = +req.decodedAccessToken.iss;
  log.debug(`consumer - getOne(id=${consumerId})`);

  const match = csmerSvc.getOne(consumerId);
  if (!match) {
    log.debug("Consumer not found in cache");
    req.table = entity.getTable();
    req.cols = entity.getCols("GET");
    req.filters = {
      id: { value: consumerId },
      accessToken: { value: req.accessToken },
    };
    return next();
  }
  log.debug(`Found consumer in cache : ${JSON.stringify(match)}`);
  res.rows = [match];
  next();
}

// function addOne(req, res, next) {
//   const { id, nickname, maxLevel, rolesArrayAgg } = req.user;
//   const { accessToken, refreshToken } = res.rows[0];
//   log.debug(
//     `addOne(consumerId=${id},
//      nickname=${nickname},
//      refreshToken='${refreshToken}',
//      accessToken='${accessToken}', 
//      maxLevel=${maxLevel},
//      roles=[${rolesArrayAgg.toString()}])`,
//   );

//   csmerSvc
//     .addOne(id,
//             nickname,
//             accessToken,
//             refreshToken,
//             rolesArrayAgg
//           )
//     .then(() => {
//       log.debug("Consumer added");  
//       next();
//     })
//     .catch((err) => next(err));
// }

/**
 * Updates a consumer with new access token and refresh token.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {void}
 */
// function updateOne(req, res, next) {
//   const { refreshToken, accessToken } = res.rows[0];
//   const id = req.decodedAccessToken.iss;
//   log.debug(
//     `Update consumer: id='${id}', accessToken='${accessToken}',refreshToken='${refreshToken}'`,
//   );

//   if (!isValidNumber(+id, 1, 999999999, true))
//     return next({ status: 400, msg: "Missing id" });

//   csmerSvc
//     .updateOne(id, accessToken, refreshToken)
//     .then(() => next())
//     .catch((err) => next(err));
// }

// function deleteOne(req, res, next) {
//   const id = req.decodedAccessToken.iss;
//   if (!isValidNumber(+id, 1, 999999999, true))
//     return next({ status: 400, msg: "Missing iss" });

//   csmerSvc
//     .deleteOne(id)
//     .then(() => next())
//     .catch((err) => next(err));
// }

export default {
  // validate,
  getOne,
  // addOne,
  // updateOne,
  // deleteOne,
};
