import express from "express";
import {
    createCustomer,
    deleteCustomer,
    getCustomers,
    updateCustomer,
} from "../controllers/customer.js";

const router = express.Router();

router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.get("/:userId", getCustomers);

export default router;