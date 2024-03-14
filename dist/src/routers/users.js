"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = __importDefault(require("../middleware/auth"));
const admin_1 = __importDefault(require("../middleware/admin"));
const router = express_1.default.Router();
/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - User
 *     description: Get current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Current user retrieved successfully
 *       '401':
 *         description: Unauthorized - user authentication failed
 */
router.get("/me", auth_1.default, userController_1.currentUser);
/**
 * @openapi
 * /api/users/getALL:
 *   get:
 *     tags:
 *       - User
 *     description: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Users retrieved successfully
 *       '401':
 *         description: Unauthorized - user is not an admin
 */
router.get("/getALL", admin_1.default, userController_1.getAllUsers);
/**
 * @openapi
 * /api/users/create:
 *   post:
 *     tags:
 *       - User
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 description: The name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 5
 *                 maxLength: 255
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 5
 *                 maxLength: 1024
 *                 description: The password of the user.
 *               confirmpassword:
 *                 type: string
 *                 format: password
 *                 minLength: 5
 *                 maxLength: 1024
 *                 description: The confirmed password of the user.
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmpassword
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         headers:
 *           x-auth-token:
 *             description: The authentication token for the newly created user
 *             schema:
 *               type: string
 *       '400':
 *         description: Bad request - missing or invalid user data
 */
router.post("/create", userController_1.registerUser);
/**
 * @openapi
 * /api/users/login:
 *   post:
 *     tags:
 *       - User
 *     description: Login with username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Unauthorized - invalid username or password
 */
router.post("/login", userController_1.loginUser);
/**
 * @openapi
 * /api/users/delete/{id}:
 *   delete:
 *     tags:
 *       - User
 *     description: Delete user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized - user authentication failed
 *       '403':
 *         description: Forbidden - user is not authorized to delete users
 *       '404':
 *         description: Not found - user with the specified ID not found
 */
router.delete("/delete/:id", admin_1.default, userController_1.deleteUser);
/**
 * @openapi
 * /api/users/getUserCount:
 *   get:
 *     tags:
 *       - User
 *     description: Get total number of users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User count retrieved successfully
 *       '401':
 *         description: Unauthorized - user authentication failed
 */
router.get("/getUserCount", auth_1.default, userController_1.getUserCount);
exports.default = router;
