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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = __importStar(require("winston"));
exports.logger = logger;
const namespace_1 = __importDefault(require("./utils/namespace"));
const format = logger.format.combine(logger.format.colorize({ all: false }), logger.format.printf((info) => {
    const requestId = namespace_1.default.get('requestId') || "-";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUFrQztBQTJCekIsd0JBQU07QUExQmYsa0VBQW1EO0FBRW5ELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO0lBQzVCLE1BQU0sU0FBUyxHQUFHLG1CQUFrQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUM7SUFDN0QsT0FBTyxJQUFJLFNBQVMsS0FBSyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN6RCxDQUFDLENBQUMsQ0FDSCxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXpDLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDZixLQUFLLEVBQUUsT0FBTztJQUNkLElBQUksRUFBRSxNQUFNO0lBQ1osS0FBSyxFQUFFLFNBQVM7SUFDaEIsSUFBSSxFQUFFLFFBQVE7SUFDZCxLQUFLLEVBQUUsS0FBSztDQUNiLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDZixLQUFLLEVBQUUsTUFBTTtJQUNiLE1BQU07SUFDTixVQUFVLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7Q0FDOUMsQ0FBQyxDQUFDIn0=