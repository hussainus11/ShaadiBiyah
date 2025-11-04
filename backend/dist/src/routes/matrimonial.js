"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const matrimonialController_1 = require("../controllers/matrimonialController");
const router = express_1.default.Router();
router.get('/profiles', matrimonialController_1.MatrimonialController.getProfiles);
router.post('/profiles', matrimonialController_1.MatrimonialController.createProfile);
router.patch('/profiles/:id/interest', matrimonialController_1.MatrimonialController.toggleInterest);
router.patch('/profiles/:id/match', matrimonialController_1.MatrimonialController.setMatch);
router.patch('/profiles/:id/block', matrimonialController_1.MatrimonialController.blockProfile);
router.get('/messages/:profileId', matrimonialController_1.MatrimonialController.getMessages);
router.post('/messages', matrimonialController_1.MatrimonialController.sendMessage);
exports.default = router;
//# sourceMappingURL=matrimonial.js.map