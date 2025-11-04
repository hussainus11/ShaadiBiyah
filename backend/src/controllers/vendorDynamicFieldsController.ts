import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class VendorDynamicFieldsController {
  // Get all dynamic fields for a vendor
  static getDynamicFields = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    const fields = await prisma.vendorDynamicField.findMany({
      where: { vendorId: vendor.id },
      orderBy: { displayOrder: 'asc' }
    });

    return res.status(200).json({
      success: true,
      data: fields
    });
  });

  // Add a new dynamic field
  static addDynamicField = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { fieldLabel, fieldType, fieldOptions = [], isRequired = false } = req.body;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    // Generate unique field name
    const fieldName = `customField_${Date.now()}`;

    // Get next display order
    const lastField = await prisma.vendorDynamicField.findFirst({
      where: { vendorId: vendor.id },
      orderBy: { displayOrder: 'desc' }
    });

    const displayOrder = (lastField?.displayOrder || 0) + 1;

    const field = await prisma.vendorDynamicField.create({
      data: {
        vendorId: vendor.id,
        fieldName,
        fieldLabel,
        fieldType,
        fieldOptions,
        isRequired,
        displayOrder
      }
    });

    return res.status(201).json({
      success: true,
      data: field,
      message: 'Dynamic field added successfully'
    });
  });

  // Update a dynamic field
  static updateDynamicField = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { fieldId } = req.params;
    const { fieldLabel, fieldType, fieldOptions, fieldValue, isRequired, displayOrder } = req.body;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    const field = await prisma.vendorDynamicField.updateMany({
      where: { 
        id: fieldId,
        vendorId: vendor.id 
      },
      data: {
        fieldLabel,
        fieldType,
        fieldOptions,
        fieldValue,
        isRequired,
        displayOrder
      }
    });

    if (field.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Dynamic field not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Dynamic field updated successfully'
    });
  });

  // Delete a dynamic field
  static deleteDynamicField = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { fieldId } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    const field = await prisma.vendorDynamicField.deleteMany({
      where: { 
        id: fieldId,
        vendorId: vendor.id 
      }
    });

    if (field.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Dynamic field not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Dynamic field deleted successfully'
    });
  });

  // Update field values (for form submission)
  static updateFieldValues = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { fieldValues } = req.body; // Array of { fieldId, fieldValue }

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    // Update multiple fields in a transaction
    const updatePromises = fieldValues.map(({ fieldId, fieldValue }: any) =>
      prisma.vendorDynamicField.updateMany({
        where: { 
          id: fieldId,
          vendorId: vendor.id 
        },
        data: { fieldValue }
      })
    );

    await Promise.all(updatePromises);

    return res.status(200).json({
      success: true,
      message: 'Field values updated successfully'
    });
  });

  // Reorder fields
  static reorderFields = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { fieldOrders } = req.body; // Array of { fieldId, displayOrder }

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    // Update field orders in a transaction
    const updatePromises = fieldOrders.map(({ fieldId, displayOrder }: any) =>
      prisma.vendorDynamicField.updateMany({
        where: { 
          id: fieldId,
          vendorId: vendor.id 
        },
        data: { displayOrder }
      })
    );

    await Promise.all(updatePromises);

    return res.status(200).json({
      success: true,
      message: 'Field order updated successfully'
    });
  });
}
