"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = __importStar(require("winston"));
exports.logger = logger;
const requestIdManager_1 = require("./utils/requestIdManager");
const format = logger.format.combine(logger.format.colorize({ all: false }), logger.format.printf((info) => {
    const requestId = (0, requestIdManager_1.getRequestId)();
    return `[${requestId}] ${info.level}: ${info.message}`;
}));
logger.remove(logger.transports.Console);
logger.addColors({
    debug: "green",
    info: "cyan",
    silly: "magenta",
    warn: "yellow",
    error: "red",
});
logger.configure({
    level: "info",
    format,
    transports: [new logger.transports.Console()],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUFrQztBQTJCekIsd0JBQU07QUExQmYsK0RBQXdEO0FBRXhELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO0lBQzVCLE1BQU0sU0FBUyxHQUFHLElBQUEsK0JBQVksR0FBRSxDQUFBO0lBQ2hDLE9BQU8sSUFBSSxTQUFTLEtBQUssSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDekQsQ0FBQyxDQUFDLENBQ0gsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUV6QyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ2YsS0FBSyxFQUFFLE9BQU87SUFDZCxJQUFJLEVBQUUsTUFBTTtJQUNaLEtBQUssRUFBRSxTQUFTO0lBQ2hCLElBQUksRUFBRSxRQUFRO0lBQ2QsS0FBSyxFQUFFLEtBQUs7Q0FDYixDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ2YsS0FBSyxFQUFFLE1BQU07SUFDYixNQUFNO0lBQ04sVUFBVSxFQUFFLENBQUMsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQzlDLENBQUMsQ0FBQyJ9