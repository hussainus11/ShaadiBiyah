import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class PackageDynamicFieldsController {
  // Get all dynamic fields for a package
  static getPackageDynamicFields = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { packageId } = req.params;

    const fields = await prisma.packageDynamicField.findMany({
      where: { packageId },
      orderBy: { displayOrder: 'asc' }
    });

    return res.status(200).json({
      success: true,
      data: fields
    });
  });

  // Add a new dynamic field for a package
  static addPackageDynamicField = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { packageId } = req.params;
    const { fieldLabel, fieldType, fieldOptions = [], isRequired = false } = req.body;

    // Generate unique field name
    const fieldName = `packageField_${Date.now()}`;

    // Get next display order
    const lastField = await prisma.packageDynamicField.findFirst({
      where: { packageId },
      orderBy: { displayOrder: 'desc' }
    });

    const displayOrder = (lastField?.displayOrder || 0) + 1;

    const field = await prisma.packageDynamicField.create({
      data: {
        packageId,
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
      message: 'Package dynamic field added successfully'
    });
  });

  // Update a package dynamic field
  static updatePackageDynamicField = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { fieldId } = req.params;
    const { fieldLabel, fieldType, fieldOptions, fieldValue, isRequired, displayOrder } = req.body;

    const field = await prisma.packageDynamicField.updateMany({
      where: { id: fieldId },
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
        error: 'Package dynamic field not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Package dynamic field updated successfully'
    });
  });

  // Delete a package dynamic field
  static deletePackageDynamicField = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { fieldId } = req.params;

    const field = await prisma.packageDynamicField.deleteMany({
      where: { id: fieldId }
    });

    if (field.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Package dynamic field not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Package dynamic field deleted successfully'
    });
  });

  // Update field values for a package
  static updatePackageFieldValues = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { packageId } = req.params;
    const { fieldValues } = req.body; // Array of { fieldId, fieldValue }

    // Update multiple fields in a transaction
    const updatePromises = fieldValues.map(({ fieldId, fieldValue }: any) =>
      prisma.packageDynamicField.updateMany({
        where: { 
          id: fieldId,
          packageId 
        },
        data: { fieldValue }
      })
    );

    await Promise.all(updatePromises);

    return res.status(200).json({
      success: true,
      message: 'Package field values updated successfully'
    });
  });

  // Reorder package fields
  static reorderPackageFields = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { packageId } = req.params;
    const { fieldOrders } = req.body; // Array of { fieldId, displayOrder }

    // Update field orders in a transaction
    const updatePromises = fieldOrders.map(({ fieldId, displayOrder }: any) =>
      prisma.packageDynamicField.updateMany({
        where: { 
          id: fieldId,
          packageId 
        },
        data: { displayOrder }
      })
    );

    await Promise.all(updatePromises);

    return res.status(200).json({
      success: true,
      message: 'Package field order updated successfully'
    });
  });
}
