import { Router } from "express";
export const certsRouter = Router();
import { certificatesService } from "./certificates.service.js";

certsRouter.get("/list", async (req, res, next) => {
  try {
    const certificates = await certificatesService.getCertificatesList({
      ...req.query,
    });
    return res.status(200).json(certificates);
  } catch (e) {
    next(e);
  }
});
