import { NextResponse } from "next/server";
import { getCollection } from "../../../lib/mongodb";
import { requireAdmin, checkOrigin } from "../../../lib/apiGuards";

// Schema for shipping and tax settings
const ShippingTaxSettings = {
  _id: "shipping_tax_settings", // Fixed ID to ensure single document
  shippingSettings: {
    shippingCharge: 15.99, // Fixed shipping cost
    enabled: true
  },
  taxSettings: {
    taxRate: 8.25, // Tax percentage
    enabled: true,
    taxName: "Sales Tax"
  },
  lastUpdated: new Date()
};

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyAllowedFields(value, allowedFields) {
  return Object.keys(value).every((field) => allowedFields.includes(field));
}

function parseNonNegativeNumber(value, fieldName) {
  if (typeof value !== "number" && typeof value !== "string") {
    return {
      error: NextResponse.json(
        { success: false, error: `${fieldName} must be a valid non-negative number` },
        { status: 400 }
      )
    };
  }

  if (typeof value === "string" && value.trim() === "") {
    return {
      error: NextResponse.json(
        { success: false, error: `${fieldName} must be a valid non-negative number` },
        { status: 400 }
      )
    };
  }

  const numericValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return {
      error: NextResponse.json(
        { success: false, error: `${fieldName} must be a valid non-negative number` },
        { status: 400 }
      )
    };
  }

  return { value: numericValue };
}

function validateSettingsBody(body) {
  if (!isPlainObject(body)) {
    return {
      error: NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      )
    };
  }

  if (!hasOnlyAllowedFields(body, ["shippingSettings", "taxSettings"])) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unknown settings field provided" },
        { status: 400 }
      )
    };
  }

  const { shippingSettings, taxSettings } = body;
  const hasShippingSettings = Object.hasOwn(body, "shippingSettings");
  const hasTaxSettings = Object.hasOwn(body, "taxSettings");

  if (!hasShippingSettings && !hasTaxSettings) {
    return {
      error: NextResponse.json(
        { success: false, error: "Either shipping or tax settings must be provided" },
        { status: 400 }
      )
    };
  }

  const updateData = {
    lastUpdated: new Date()
  };

  if (hasShippingSettings) {
    if (!isPlainObject(shippingSettings) || !hasOnlyAllowedFields(shippingSettings, ["shippingCharge", "enabled"])) {
      return {
        error: NextResponse.json(
          { success: false, error: "Invalid shipping settings fields" },
          { status: 400 }
        )
      };
    }

    if (!Object.hasOwn(shippingSettings, "shippingCharge")) {
      return {
        error: NextResponse.json(
          { success: false, error: "Shipping charge is required" },
          { status: 400 }
        )
      };
    }

    if (Object.hasOwn(shippingSettings, "enabled") && typeof shippingSettings.enabled !== "boolean") {
      return {
        error: NextResponse.json(
          { success: false, error: "Shipping enabled must be a boolean" },
          { status: 400 }
        )
      };
    }

    const { value: shippingCharge, error } = parseNonNegativeNumber(
      shippingSettings.shippingCharge,
      "Shipping charge"
    );
    if (error) return { error };

    updateData.shippingSettings = {
      shippingCharge,
      enabled: Boolean(shippingSettings.enabled)
    };
  }

  if (hasTaxSettings) {
    if (!isPlainObject(taxSettings) || !hasOnlyAllowedFields(taxSettings, ["taxRate", "enabled", "taxName"])) {
      return {
        error: NextResponse.json(
          { success: false, error: "Invalid tax settings fields" },
          { status: 400 }
        )
      };
    }

    if (!Object.hasOwn(taxSettings, "taxRate")) {
      return {
        error: NextResponse.json(
          { success: false, error: "Tax rate is required" },
          { status: 400 }
        )
      };
    }

    if (Object.hasOwn(taxSettings, "enabled") && typeof taxSettings.enabled !== "boolean") {
      return {
        error: NextResponse.json(
          { success: false, error: "Tax enabled must be a boolean" },
          { status: 400 }
        )
      };
    }

    if (Object.hasOwn(taxSettings, "taxName") && typeof taxSettings.taxName !== "string") {
      return {
        error: NextResponse.json(
          { success: false, error: "Tax name must be a string" },
          { status: 400 }
        )
      };
    }

    const { value: taxRate, error } = parseNonNegativeNumber(taxSettings.taxRate, "Tax rate");
    if (error) return { error };

    const taxName = typeof taxSettings.taxName === "string" ? taxSettings.taxName.trim() : "";

    updateData.taxSettings = {
      taxRate,
      enabled: Boolean(taxSettings.enabled),
      taxName: taxName || "Sales Tax"
    };
  }

  return { updateData };
}

// GET - Fetch current shipping and tax settings
export async function GET(request) {
  try {
    const collection = await getCollection('shippingTaxSettings');
    
    let settings = await collection.findOne({ _id: "shipping_tax_settings" });
    
    // If no settings exist, create default settings
    if (!settings) {
      await collection.insertOne(ShippingTaxSettings);
      settings = ShippingTaxSettings;
    }
    
    return NextResponse.json({
      success: true,
      data: settings
    });
    
  } catch (error) {
    console.error("Error fetching shipping and tax settings:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch shipping and tax settings" 
      },
      { status: 500 }
    );
  }
}

// PUT - Update shipping and tax settings (Admin only)
export async function PUT(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { updateData, error } = validateSettingsBody(body);
    if (error) return error;
    
    const collection = await getCollection('shippingTaxSettings');
    const result = await collection.updateOne(
      { _id: "shipping_tax_settings" },
      { $set: updateData },
      { upsert: true }
    );
    
    if (result.acknowledged) {
      // Fetch updated settings
      const updatedSettings = await collection.findOne({ _id: "shipping_tax_settings" });
      
      return NextResponse.json({
        success: true,
        message: "Shipping and tax settings updated successfully",
        data: updatedSettings
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to update settings" 
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("Error updating shipping and tax settings:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update shipping and tax settings" 
      },
      { status: 500 }
    );
  }
}
