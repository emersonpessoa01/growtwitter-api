"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataValidation = dataValidation;
const utils_1 = require("../utils");
function dataValidation(validations) {
    return async (req, res, next) => {
        try {
            let errors = [];
            for (const validation of validations) {
                const result = await validation.run(req);
                if (!result.isEmpty()) {
                    errors = [...errors, ...result.array()];
                }
            }
            if (errors.length) {
                throw new utils_1.HTTPError(400, "Requisição inválida", errors.map((e) => ({
                    type: e.type,
                    field: e.path,
                    location: e.location,
                    description: e.msg,
                })));
            }
            next();
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    };
}
