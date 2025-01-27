"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestId = exports.setRequestId = void 0;
let requestId = null;
const setRequestId = (id) => {
    requestId = id;
};
exports.setRequestId = setRequestId;
const getRequestId = () => {
    return requestId || "-";
};
exports.getRequestId = getRequestId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdElkTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9yZXF1ZXN0SWRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQUksU0FBUyxHQUFrQixJQUFJLENBQUM7QUFFN0IsTUFBTSxZQUFZLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRTtJQUN6QyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUZXLFFBQUEsWUFBWSxnQkFFdkI7QUFFSyxNQUFNLFlBQVksR0FBRyxHQUFHLEVBQUU7SUFDL0IsT0FBTyxTQUFTLElBQUksR0FBRyxDQUFDO0FBQzFCLENBQUMsQ0FBQztBQUZXLFFBQUEsWUFBWSxnQkFFdkIifQ==