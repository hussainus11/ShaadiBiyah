"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrimonialController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.MatrimonialController = {
    async getProfiles(req, res) {
        try {
            const { email } = req.query;
            const where = email ? { email: String(email) } : {};
            const profiles = await prisma.matrimonialProfile.findMany({ where, orderBy: { createdAt: 'desc' } });
            return res.json(profiles);
        }
        catch (err) {
            console.error('getProfiles error', err);
            return res.status(500).json({ message: 'Failed to fetch profiles' });
        }
    },
    async createProfile(req, res) {
        try {
            const data = req.body;
            const age = data.dateOfBirth ? (new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear()) : data.age ?? null;
            const profile = await prisma.matrimonialProfile.create({
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    gender: data.gender?.toUpperCase(),
                    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                    age: age,
                    city: data.city,
                    profession: data.profession,
                    education: data.education,
                    religion: data.religion,
                    height: data.height ?? null,
                    bio: data.bio ?? null,
                    interests: Array.isArray(data.interests) ? data.interests : [],
                    photos: Array.isArray(data.photos) ? data.photos : [],
                    familyBackground: data.familyBackground ?? null,
                    partnerPreferences: data.partnerPreferences ?? null,
                    isVerified: false,
                    isOnline: true,
                    lastSeen: new Date(),
                    compatibilityScore: data.compatibilityScore ?? 0,
                }
            });
            return res.status(201).json(profile);
        }
        catch (err) {
            console.error('createProfile error', err);
            return res.status(500).json({ message: 'Failed to create profile' });
        }
    },
    async toggleInterest(req, res) {
        try {
            const { id } = req.params;
            const existing = await prisma.matrimonialProfile.findUnique({ where: { id } });
            if (!existing)
                return res.status(404).json({ message: 'Profile not found' });
            const updated = await prisma.matrimonialProfile.update({
                where: { id },
                data: { isInterested: !existing.isInterested }
            });
            return res.json(updated);
        }
        catch (err) {
            console.error('toggleInterest error', err);
            return res.status(500).json({ message: 'Failed to update interest' });
        }
    },
    async setMatch(req, res) {
        try {
            const { id } = req.params;
            const updated = await prisma.matrimonialProfile.update({ where: { id }, data: { isMatched: true } });
            return res.json(updated);
        }
        catch (err) {
            console.error('setMatch error', err);
            return res.status(500).json({ message: 'Failed to set match' });
        }
    },
    async blockProfile(req, res) {
        try {
            const { id } = req.params;
            const updated = await prisma.matrimonialProfile.update({ where: { id }, data: { isBlocked: true } });
            return res.json(updated);
        }
        catch (err) {
            console.error('blockProfile error', err);
            return res.status(500).json({ message: 'Failed to block profile' });
        }
    },
    async getMessages(req, res) {
        try {
            const { profileId } = req.params;
            const messages = await prisma.matrimonialMessage.findMany({
                where: { toProfileId: profileId },
                orderBy: { createdAt: 'asc' }
            });
            return res.json(messages);
        }
        catch (err) {
            console.error('getMessages error', err);
            return res.status(500).json({ message: 'Failed to fetch messages' });
        }
    },
    async sendMessage(req, res) {
        try {
            const { fromProfileId, toProfileId, content } = req.body;
            const created = await prisma.matrimonialMessage.create({ data: { fromProfileId, toProfileId, content } });
            return res.status(201).json(created);
        }
        catch (err) {
            console.error('sendMessage error', err);
            return res.status(500).json({ message: 'Failed to send message' });
        }
    },
};
//# sourceMappingURL=matrimonialController.js.map