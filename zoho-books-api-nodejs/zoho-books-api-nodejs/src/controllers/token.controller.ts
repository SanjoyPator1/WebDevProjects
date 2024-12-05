// src/controllers/token.controller.ts

import { Request, Response } from "express";
import { createZohoClient } from "../lib/zoho-client";
import config from "../config";

// In-memory token store (replace with database in production)
let globalRefreshToken: string | null = null;

export const setRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token is required" });
      return;
    }

    // Validate the refresh token by trying to create a client
    try {
      const zoho = await createZohoClient(config.zoho, undefined, refreshToken);
      // Try to make a test API call to verify the token works
      await zoho.getOrganizations();
    } catch (error) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    // If validation successful, store the token
    globalRefreshToken = refreshToken;
    res.json({ success: true, message: "Refresh token set successfully" });
  } catch (error) {
    handleError(error, res);
  }
};

export const getRefreshToken = (req: Request, res: Response): void => {
  if (!globalRefreshToken) {
    res.status(404).json({ error: "No refresh token set" });
    return;
  }

  res.json({ refreshToken: globalRefreshToken });
};

export const clearRefreshToken = (req: Request, res: Response): void => {
  globalRefreshToken = null;
  res.json({ success: true, message: "Refresh token cleared successfully" });
};

// Helper function to handle errors
const handleError = (error: unknown, res: Response): void => {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred" });
  }
};

// Export the token getter for other controllers to use
export const getStoredRefreshToken = (): string | null => {
  return globalRefreshToken;
};
