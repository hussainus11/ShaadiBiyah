import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import crypto from 'crypto';
import { sendEmail } from '../utils/email';

const prisma = new PrismaClient();

export class VendorVerificationController {
  // Generate verification document and send signing link
  static generateVerificationDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { vendorId } = req.params;

    // Verify vendor belongs to user
    const vendor = await prisma.vendor.findFirst({
      where: {
        id: vendorId,
        userId: userId
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found or unauthorized'
      });
    }

    // Check if verification is already in progress
    if (vendor.verificationStatus === 'DOCUMENT_SENT' || vendor.verificationStatus === 'DOCUMENT_SIGNED') {
      return res.status(400).json({
        success: false,
        error: 'Verification document already sent'
      });
    }

    // Generate signing token
    const signingToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create verification document
    const documentContent = generateVerificationDocumentContent(vendor);
    const documentHash = crypto.createHash('sha256').update(documentContent).digest('hex');

    const verificationDocument = await prisma.vendorVerificationDocument.create({
      data: {
        vendorId: vendor.id,
        documentType: 'TERMS_AND_CONDITIONS',
        documentTitle: 'Vendor Terms and Conditions Agreement',
        documentContent,
        documentHash,
        signingToken,
        tokenExpiresAt,
        status: 'PENDING'
      }
    });

    // Update vendor status
    await prisma.vendor.update({
      where: { id: vendor.id },
      data: { verificationStatus: 'DOCUMENT_SENT' }
    });

    // Send email with signing link
    const signingLink = `${process.env.FRONTEND_URL}/vendor/verify-document/${signingToken}`;
    
    try {
      await sendEmail({
        to: vendor.user.email,
        subject: 'Action Required: Sign Your Vendor Agreement - ShaadiBiyah',
        html: generateVerificationEmailTemplate(vendor.user.firstName, signingLink, vendor.businessName)
      });

      return res.status(200).json({
        success: true,
        message: 'Verification document sent successfully',
        data: {
          documentId: verificationDocument.id,
          expiresAt: tokenExpiresAt
        }
      });
    } catch (error) {
      // If email fails, update status back to pending
      await prisma.vendor.update({
        where: { id: vendor.id },
        data: { verificationStatus: 'PENDING' }
      });

      await prisma.vendorVerificationDocument.delete({
        where: { id: verificationDocument.id }
      });

      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email'
      });
    }
  });

  // Get document for signing
  static getDocumentForSigning = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;

    const document = await prisma.vendorVerificationDocument.findUnique({
      where: { signingToken: token },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired verification link'
      });
    }

    if (document.tokenExpiresAt < new Date()) {
      await prisma.vendorVerificationDocument.update({
        where: { id: document.id },
        data: { status: 'EXPIRED' }
      });

      await prisma.vendor.update({
        where: { id: document.vendorId },
        data: { verificationStatus: 'EXPIRED' }
      });

      return res.status(400).json({
        success: false,
        error: 'Verification link has expired'
      });
    }

    if (document.status === 'SIGNED') {
      return res.status(400).json({
        success: false,
        error: 'Document has already been signed'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        documentId: document.id,
        title: document.documentTitle,
        content: document.documentContent,
        vendorName: document.vendor.businessName,
        expiresAt: document.tokenExpiresAt
      }
    });
  });

  // Sign the document
  static signDocument = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    const { signatureData, ipAddress, userAgent } = req.body;

    const document = await prisma.vendorVerificationDocument.findUnique({
      where: { signingToken: token },
      include: {
        vendor: true
      }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Invalid verification link'
      });
    }

    if (document.tokenExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Verification link has expired'
      });
    }

    if (document.status === 'SIGNED') {
      return res.status(400).json({
        success: false,
        error: 'Document has already been signed'
      });
    }

    // Update document with signature
    const signedDocument = await prisma.vendorVerificationDocument.update({
      where: { id: document.id },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
        signatureData,
        ipAddress,
        userAgent
      }
    });

    // Update vendor status
    await prisma.vendor.update({
      where: { id: document.vendorId },
      data: {
        verificationStatus: 'DOCUMENT_SIGNED',
        documentSignedAt: new Date()
      }
    });

    // Send confirmation email
    try {
      await sendEmail({
        to: document.vendor.email,
        subject: 'Document Signed Successfully - ShaadiBiyah',
        html: generateConfirmationEmailTemplate(document.vendor.businessName)
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    return res.status(200).json({
      success: true,
      message: 'Document signed successfully',
      data: {
        signedAt: signedDocument.signedAt,
        nextSteps: 'Your account will be reviewed by our team within 24-48 hours'
      }
    });
  });

  // Get verification status
  static getVerificationStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { vendorId } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: {
        id: vendorId,
        userId: userId
      },
      include: {
        verificationDocuments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        verificationStatus: vendor.verificationStatus,
        documentSignedAt: vendor.documentSignedAt,
        verificationNotes: vendor.verificationNotes,
        latestDocument: vendor.verificationDocuments[0] || null
      }
    });
  });

  // Admin: Get pending verifications
  static getPendingVerifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const adminId = req.user!.id;

    // Verify admin role
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });

    if (admin?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const vendors = await prisma.vendor.findMany({
      where: {
        verificationStatus: {
          in: ['DOCUMENT_SIGNED', 'REJECTED']
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        verificationDocuments: {
          where: { status: 'SIGNED' },
          orderBy: { signedAt: 'desc' },
          take: 1
        }
      },
      orderBy: { documentSignedAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: vendors
    });
  });

  // Admin: Review and approve/reject verification
  static reviewVerification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const adminId = req.user!.id;
    const { vendorId } = req.params;
    const { action, notes } = req.body; // action: 'APPROVE' | 'REJECT'

    // Verify admin role
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });

    if (admin?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        verificationDocuments: {
          where: { status: 'SIGNED' },
          orderBy: { signedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    if (vendor.verificationStatus !== 'DOCUMENT_SIGNED') {
      return res.status(400).json({
        success: false,
        error: 'Vendor has not signed the verification document'
      });
    }

    const newStatus = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED';
    const isVerified = action === 'APPROVE';

    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        verificationStatus: newStatus,
        isVerified,
        verificationNotes: notes
      }
    });

    // Send notification email to vendor
    try {
      const subject = action === 'APPROVE' 
        ? 'Congratulations! Your Vendor Account is Verified - ShaadiBiyah'
        : 'Vendor Verification Update - ShaadiBiyah';
      
      const html = action === 'APPROVE'
        ? generateApprovalEmailTemplate(vendor.businessName)
        : generateRejectionEmailTemplate(vendor.businessName, notes);

      await sendEmail({
        to: vendor.email,
        subject,
        html
      });
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }

    return res.status(200).json({
      success: true,
      message: `Vendor verification ${action.toLowerCase()}d successfully`,
      data: {
        verificationStatus: newStatus,
        isVerified
      }
    });
  });
}

// Helper functions
function generateVerificationDocumentContent(vendor: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Vendor Terms and Conditions Agreement</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 10px; }
            h2 { color: #34495e; margin-top: 30px; }
            .vendor-info { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .terms-section { margin: 20px 0; }
            .signature-section { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
    </head>
    <body>
        <h1>Vendor Terms and Conditions Agreement</h1>
        
        <div class="vendor-info">
            <h3>Vendor Information</h3>
            <p><strong>Business Name:</strong> ${vendor.businessName}</p>
            <p><strong>Category:</strong> ${vendor.category}</p>
            <p><strong>Location:</strong> ${vendor.location}</p>
            <p><strong>Email:</strong> ${vendor.email}</p>
            <p><strong>Phone:</strong> ${vendor.phone}</p>
        </div>

        <div class="terms-section">
            <h2>1. Service Agreement</h2>
            <p>By signing this agreement, you agree to provide wedding-related services through the ShaadiBiyah platform in accordance with the following terms and conditions.</p>
        </div>

        <div class="terms-section">
            <h2>2. Quality Standards</h2>
            <p>You commit to maintaining high-quality services and professional conduct. All services must meet the standards described in your vendor profile and any additional specifications agreed upon with clients.</p>
        </div>

        <div class="terms-section">
            <h2>3. Pricing and Payments</h2>
            <p>You agree to honor the pricing listed in your vendor profile. Payment processing will be handled through ShaadiBiyah's secure payment system, with funds transferred to your registered bank account.</p>
        </div>

        <div class="terms-section">
            <h2>4. Client Communication</h2>
            <p>You agree to maintain professional communication with clients and respond to inquiries within 24 hours during business days.</p>
        </div>

        <div class="terms-section">
            <h2>5. Cancellation Policy</h2>
            <p>You must provide clear cancellation policies and honor any commitments made to clients. Cancellations must be communicated promptly and professionally.</p>
        </div>

        <div class="terms-section">
            <h2>6. Compliance and Legal</h2>
            <p>You certify that you have all necessary licenses, permits, and insurance required to provide your services. You agree to comply with all applicable local, state, and federal laws.</p>
        </div>

        <div class="terms-section">
            <h2>7. Platform Rules</h2>
            <p>You agree to follow ShaadiBiyah's community guidelines, not engage in fraudulent activities, and maintain accurate information in your vendor profile.</p>
        </div>

        <div class="terms-section">
            <h2>8. Termination</h2>
            <p>Either party may terminate this agreement with 30 days written notice. ShaadiBiyah reserves the right to suspend or terminate accounts for violations of these terms.</p>
        </div>

        <div class="signature-section">
            <h2>Digital Signature</h2>
            <p>By signing this document electronically, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.</p>
            <p><strong>Date:</strong> <span id="signature-date"></span></p>
            <p><strong>Digital Signature:</strong> <span id="digital-signature"></span></p>
        </div>
    </body>
    </html>
  `;
}

function generateVerificationEmailTemplate(firstName: string, signingLink: string, businessName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Vendor Verification Required</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #e74c3c; font-size: 24px; font-weight: bold; }
            .button { display: inline-block; background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">ShaadiBiyah</div>
                <h1>Action Required: Sign Your Vendor Agreement</h1>
            </div>
            
            <p>Dear ${firstName},</p>
            
            <p>Thank you for registering your business "<strong>${businessName}</strong>" with ShaadiBiyah!</p>
            
            <p>To complete your vendor verification and protect against fraud, we require you to sign our Vendor Terms and Conditions Agreement. This is a mandatory step to activate your vendor account.</p>
            
            <div style="text-align: center;">
                <a href="${signingLink}" class="button">Sign Agreement Now</a>
            </div>
            
            <h3>What happens next?</h3>
            <ul>
                <li>Click the button above to review and sign the agreement</li>
                <li>The document contains important terms about service quality, payments, and platform rules</li>
                <li>After signing, our team will review your account within 24-48 hours</li>
                <li>Once approved, you'll be able to accept bookings and manage your vendor dashboard</li>
            </ul>
            
            <p><strong>Important:</strong> This link expires in 7 days. Please complete the signing process as soon as possible.</p>
            
            <div class="footer">
                <p>If you have any questions, please contact our support team.</p>
                <p>Best regards,<br>The ShaadiBiyah Team</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateConfirmationEmailTemplate(businessName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Document Signed Successfully</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #e74c3c; font-size: 24px; font-weight: bold; }
            .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">ShaadiBiyah</div>
                <h1>Document Signed Successfully!</h1>
            </div>
            
            <div class="success">
                <strong>✓ Agreement Signed:</strong> Your Vendor Terms and Conditions Agreement has been successfully signed for ${businessName}.
            </div>
            
            <h3>What happens next?</h3>
            <ul>
                <li>Our team will review your signed agreement within 24-48 hours</li>
                <li>You'll receive an email notification once your account is approved</li>
                <li>After approval, you can start accepting bookings and managing your vendor profile</li>
            </ul>
            
            <p>Thank you for choosing ShaadiBiyah. We look forward to helping you grow your wedding business!</p>
            
            <p>Best regards,<br>The ShaadiBiyah Team</p>
        </div>
    </body>
    </html>
  `;
}

function generateApprovalEmailTemplate(businessName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Account Verified Successfully</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #e74c3c; font-size: 24px; font-weight: bold; }
            .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">ShaadiBiyah</div>
                <h1>🎉 Congratulations! Your Account is Verified</h1>
            </div>
            
            <div class="success">
                <strong>✓ Account Approved:</strong> Your vendor account for ${businessName} has been successfully verified and is now active!
            </div>
            
            <h3>You can now:</h3>
            <ul>
                <li>Access your vendor dashboard</li>
                <li>Accept and manage bookings</li>
                <li>Update your services and pricing</li>
                <li>Communicate with potential clients</li>
                <li>Receive payments through our secure system</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/vendor/dashboard" class="button">Access Your Dashboard</a>
            </div>
            
            <p>Welcome to the ShaadiBiyah family! We're excited to help you grow your wedding business.</p>
            
            <p>Best regards,<br>The ShaadiBiyah Team</p>
        </div>
    </body>
    </html>
  `;
}

function generateRejectionEmailTemplate(businessName: string, notes?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Verification Update</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #e74c3c; font-size: 24px; font-weight: bold; }
            .notice { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">ShaadiBiyah</div>
                <h1>Verification Update</h1>
            </div>
            
            <div class="notice">
                <strong>Verification Status:</strong> Your vendor account for ${businessName} requires additional review.
            </div>
            
            ${notes ? `<p><strong>Review Notes:</strong> ${notes}</p>` : ''}
            
            <h3>Next Steps:</h3>
            <ul>
                <li>Please review the feedback provided above</li>
                <li>Update your vendor profile with any required information</li>
                <li>Contact our support team if you have questions</li>
                <li>You may reapply for verification once issues are resolved</li>
            </ul>
            
            <p>If you have any questions about this decision, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The ShaadiBiyah Team</p>
        </div>
    </body>
    </html>
  `;
}
