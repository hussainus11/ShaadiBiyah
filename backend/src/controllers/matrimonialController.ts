import { PrismaClient, Gender } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const MatrimonialController = {
  async getProfiles(req: Request, res: Response) {
    try {
      const { email } = req.query as { email?: string };
      const where = email ? { email: String(email) } : {};
      const profiles = await prisma.matrimonialProfile.findMany({ where, orderBy: { createdAt: 'desc' } });
      return res.json(profiles);
    } catch (err) {
      console.error('getProfiles error', err);
      return res.status(500).json({ message: 'Failed to fetch profiles' });
    }
  },

  async createProfile(req: Request, res: Response) {
    try {
      const data = req.body as any;
      const age = data.dateOfBirth ? (new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear()) : data.age ?? null;
      const profile = await prisma.matrimonialProfile.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender?.toUpperCase() as Gender,
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
    } catch (err) {
      console.error('createProfile error', err);
      return res.status(500).json({ message: 'Failed to create profile' });
    }
  },

  async toggleInterest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const existing = await prisma.matrimonialProfile.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ message: 'Profile not found' });
      const updated = await prisma.matrimonialProfile.update({
        where: { id },
        data: { isInterested: !existing.isInterested }
      });
      return res.json(updated);
    } catch (err) {
      console.error('toggleInterest error', err);
      return res.status(500).json({ message: 'Failed to update interest' });
    }
  },

  async setMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await prisma.matrimonialProfile.update({ where: { id }, data: { isMatched: true } });
      return res.json(updated);
    } catch (err) {
      console.error('setMatch error', err);
      return res.status(500).json({ message: 'Failed to set match' });
    }
  },

  async blockProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await prisma.matrimonialProfile.update({ where: { id }, data: { isBlocked: true } });
      return res.json(updated);
    } catch (err) {
      console.error('blockProfile error', err);
      return res.status(500).json({ message: 'Failed to block profile' });
    }
  },

  async getMessages(req: Request, res: Response) {
    try {
      const { profileId } = req.params;
      const messages = await prisma.matrimonialMessage.findMany({
        where: { toProfileId: profileId },
        orderBy: { createdAt: 'asc' }
      });
      return res.json(messages);
    } catch (err) {
      console.error('getMessages error', err);
      return res.status(500).json({ message: 'Failed to fetch messages' });
    }
  },

  async sendMessage(req: Request, res: Response) {
    try {
      const { fromProfileId, toProfileId, content } = req.body as { fromProfileId: string; toProfileId: string; content: string };
      const created = await prisma.matrimonialMessage.create({ data: { fromProfileId, toProfileId, content } });
      return res.status(201).json(created);
    } catch (err) {
      console.error('sendMessage error', err);
      return res.status(500).json({ message: 'Failed to send message' });
    }
  },
};