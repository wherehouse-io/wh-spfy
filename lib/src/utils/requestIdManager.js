"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestId = exports.setRequestId = void 0;
const logger_1 = require("../logger");
let requestId = null;
const setRequestId = (id) => {
    logger_1.logger.info(`--set-request-id-----${JSON.stringify(id)}`);
    requestId = id;
};
exports.setRequestId = setRequestId;
const getRequestId = () => {
    logger_1.logger.info(`--get-request-id-----${JSON.stringify(requestId)}`);
    return requestId || "-";
};
exports.getRequestId = getRequestId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdElkTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9yZXF1ZXN0SWRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUFtQztBQUVuQyxJQUFJLFNBQVMsR0FBa0IsSUFBSSxDQUFDO0FBRTdCLE1BQU0sWUFBWSxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUU7SUFDekMsZUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUQsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNqQixDQUFDLENBQUM7QUFIVyxRQUFBLFlBQVksZ0JBR3ZCO0FBRUssTUFBTSxZQUFZLEdBQUcsR0FBRyxFQUFFO0lBQy9CLGVBQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pFLE9BQU8sU0FBUyxJQUFJLEdBQUcsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFIVyxRQUFBLFlBQVksZ0JBR3ZCIn0=