"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    const adminPassword = await bcryptjs_1.default.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@weddingsaas.com' },
        update: {},
        create: {
            email: 'admin@weddingsaas.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            isVerified: true,
            phone: '+1234567890'
        }
    });
    const userPassword = await bcryptjs_1.default.hash('user123', 12);
    const user1 = await prisma.user.upsert({
        where: { email: 'john.doe@example.com' },
        update: {},
        create: {
            email: 'john.doe@example.com',
            password: userPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: 'USER',
            isVerified: true,
            phone: '+1234567891',
            weddingDate: new Date('2024-06-15'),
            budget: 50000,
            location: 'New York, NY'
        }
    });
    const user2 = await prisma.user.upsert({
        where: { email: 'jane.smith@example.com' },
        update: {},
        create: {
            email: 'jane.smith@example.com',
            password: userPassword,
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'USER',
            isVerified: true,
            phone: '+1234567892',
            weddingDate: new Date('2024-08-20'),
            budget: 75000,
            location: 'Los Angeles, CA'
        }
    });
    const vendor1 = await prisma.user.upsert({
        where: { email: 'vendor1@example.com' },
        update: {},
        create: {
            email: 'vendor1@example.com',
            password: userPassword,
            firstName: 'Mike',
            lastName: 'Johnson',
            role: 'VENDOR',
            isVerified: true,
            phone: '+1234567893'
        }
    });
    const vendor2 = await prisma.user.upsert({
        where: { email: 'vendor2@example.com' },
        update: {},
        create: {
            email: 'vendor2@example.com',
            password: userPassword,
            firstName: 'Sarah',
            lastName: 'Wilson',
            role: 'VENDOR',
            isVerified: true,
            phone: '+1234567894'
        }
    });
    const vendorProfile1 = await prisma.vendor.upsert({
        where: { userId: vendor1.id },
        update: {},
        create: {
            userId: vendor1.id,
            businessName: 'Elegant Venues',
            category: 'VENUE',
            description: 'Beautiful wedding venues with stunning architecture and excellent service.',
            location: 'New York, NY',
            phone: '+1234567893',
            email: 'vendor1@example.com',
            experience: 10,
            rating: 4.8,
            totalReviews: 150,
            isVerified: true,
            basePrice: 15000,
            priceRange: '$15,000 - $50,000'
        }
    });
    const vendorProfile2 = await prisma.vendor.upsert({
        where: { userId: vendor2.id },
        update: {},
        create: {
            userId: vendor2.id,
            businessName: 'Dream Photography',
            category: 'PHOTOGRAPHER',
            description: 'Professional wedding photography capturing your special moments with artistic flair.',
            location: 'Los Angeles, CA',
            phone: '+1234567894',
            email: 'vendor2@example.com',
            experience: 8,
            rating: 4.9,
            totalReviews: 120,
            isVerified: true,
            basePrice: 3500,
            priceRange: '$3,500 - $8,000'
        }
    });
    await prisma.service.createMany({
        data: [
            {
                vendorId: vendorProfile1.id,
                name: 'Garden Wedding Package',
                description: 'Outdoor wedding in our beautiful garden venue with catering for up to 100 guests.',
                price: 25000,
                duration: 8,
                maxCapacity: 100,
                includes: ['Venue rental', 'Basic decoration', 'Sound system', 'Parking'],
                isActive: true
            },
            {
                vendorId: vendorProfile1.id,
                name: 'Grand Ballroom Package',
                description: 'Elegant indoor wedding in our grand ballroom with premium amenities.',
                price: 40000,
                duration: 10,
                maxCapacity: 200,
                includes: ['Venue rental', 'Premium decoration', 'Sound system', 'Lighting', 'Parking', 'Bridal suite'],
                isActive: true
            },
            {
                vendorId: vendorProfile2.id,
                name: 'Full Day Photography',
                description: 'Complete wedding day photography coverage from preparation to reception.',
                price: 5000,
                duration: 12,
                includes: ['Full day coverage', 'Edited photos', 'Online gallery', 'USB drive'],
                isActive: true
            },
            {
                vendorId: vendorProfile2.id,
                name: 'Ceremony Only',
                description: 'Wedding ceremony photography with basic editing.',
                price: 2000,
                duration: 4,
                includes: ['Ceremony coverage', 'Edited photos', 'Online gallery'],
                isActive: true
            }
        ]
    });
    await prisma.matrimonialProfile.createMany({
        data: [
            {
                name: 'Priya Sharma',
                email: 'priya.sharma@email.com',
                phone: '+91 98765 43210',
                gender: 'FEMALE',
                city: 'Mumbai',
                profession: 'Software Engineer',
                education: 'B.Tech in Computer Science',
                religion: 'Hindu',
                height: "5'5\"",
                bio: 'Looking for a well-educated partner who values family and culture.',
                interests: ['Reading', 'Travel', 'Cooking', 'Music'],
                photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'],
                familyBackground: 'Middle class, well-educated family',
                partnerPreferences: 'Looking for someone with similar educational background',
                isVerified: true,
                isOnline: true,
                compatibilityScore: 85
            },
            {
                name: 'Rahul Kapoor',
                email: 'rahul.kapoor@email.com',
                phone: '+91 98765 43211',
                gender: 'MALE',
                city: 'Delhi',
                profession: 'Business Analyst',
                education: 'MBA',
                religion: 'Hindu',
                height: "5'10\"",
                bio: 'Family-oriented person seeking a life partner to share dreams and values.',
                interests: ['Sports', 'Technology', 'Photography'],
                photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'],
                familyBackground: 'Business family, well-established',
                partnerPreferences: 'Looking for someone family-oriented',
                isVerified: true,
                isOnline: false,
                compatibilityScore: 78
            },
            {
                name: 'Ayesha Khan',
                email: 'ayesha.khan@email.com',
                phone: '+92 98765 43212',
                gender: 'FEMALE',
                city: 'Karachi',
                profession: 'Doctor',
                education: 'MBBS',
                religion: 'Muslim',
                height: "5'4\"",
                bio: 'Passionate about healthcare and looking for a supportive partner.',
                interests: ['Medicine', 'Volunteering', 'Art'],
                photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'],
                familyBackground: 'Medical family, well-educated',
                partnerPreferences: 'Looking for someone understanding of medical profession',
                isVerified: true,
                isOnline: true,
                compatibilityScore: 92
            }
        ]
    });
    await prisma.booking.createMany({
        data: [
            {
                userId: user1.id,
                vendorId: vendorProfile1.id,
                serviceId: (await prisma.service.findFirst({ where: { vendorId: vendorProfile1.id } })).id,
                eventDate: new Date('2024-06-15'),
                eventTime: '14:00',
                eventDuration: 8,
                guestCount: 80,
                location: 'New York, NY',
                basePrice: 25000,
                additionalCosts: 2000,
                totalAmount: 27000,
                status: 'CONFIRMED',
                paymentStatus: 'COMPLETED',
                requestedAt: new Date('2024-01-15'),
                approvedAt: new Date('2024-01-16'),
                confirmedAt: new Date('2024-01-17')
            },
            {
                userId: user2.id,
                vendorId: vendorProfile2.id,
                serviceId: (await prisma.service.findFirst({ where: { vendorId: vendorProfile2.id } })).id,
                eventDate: new Date('2024-08-20'),
                eventTime: '10:00',
                eventDuration: 12,
                guestCount: 120,
                location: 'Los Angeles, CA',
                basePrice: 5000,
                additionalCosts: 500,
                totalAmount: 5500,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                requestedAt: new Date('2024-02-01')
            }
        ]
    });
    await prisma.review.createMany({
        data: [
            {
                userId: user1.id,
                vendorId: vendorProfile1.id,
                rating: 5,
                comment: 'Absolutely stunning venue! The staff was professional and the service was impeccable. Highly recommended!'
            },
            {
                userId: user2.id,
                vendorId: vendorProfile2.id,
                rating: 5,
                comment: 'Sarah captured our wedding perfectly! The photos are beautiful and she was so easy to work with.'
            }
        ]
    });
    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Created:');
    console.log(`   - 1 Admin user (admin@weddingsaas.com / admin123)`);
    console.log(`   - 2 Regular users (john.doe@example.com / user123, jane.smith@example.com / user123)`);
    console.log(`   - 2 Vendor users (vendor1@example.com / user123, vendor2@example.com / user123)`);
    console.log(`   - 2 Vendor profiles`);
    console.log(`   - 4 Services`);
    console.log(`   - 2 Bookings`);
    console.log(`   - 2 Reviews`);
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map