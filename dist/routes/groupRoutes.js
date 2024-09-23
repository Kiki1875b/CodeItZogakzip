"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
const getGroups_1 = require("../controllers/getGroups");
const router = express_1.default.Router();
router.post('/groups', async (req, res) => {
    try {
        const newGroup = await (0, groupController_1.createGroup)(req.body);
        res.status(201).json(newGroup);
    }
    catch (error) {
        res.status(400).json({ message: 'Error Creating Group' });
    }
});
router.get('/groups', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const sortBy = req.query.sortBy || 'latest';
        const keyword = req.query.keyword || '';
        const isPublic = true;
        const groups = await (0, getGroups_1.getGroups)({ page, pageSize, sortBy, keyword, isPublic });
        res.status(200).json(groups);
    }
    catch (error) {
        res.status(400).json({ message: 'Error Fetching Groups', error });
    }
});
exports.default = router;
