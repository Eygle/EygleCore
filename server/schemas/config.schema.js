"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var DB_1 = require("../modules/DB");
exports.configSchema = DB_1.default.createSchema({
    name: { type: String, required: true, unique: true },
    data: mongoose.Schema.Types.Mixed
}, false);
//# sourceMappingURL=config.schema.js.map