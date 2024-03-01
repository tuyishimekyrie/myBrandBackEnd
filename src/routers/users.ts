import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  getUserCount,
  currentUser,
} from "../controllers/userController";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
const router = express.Router();

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
router.get("/me", auth, currentUser);
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
router.get("/getALL", admin, getAllUsers);
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
router.post("/create", registerUser);
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
router.post("/login", loginUser);
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
router.delete("/delete/:id", auth, deleteUser);
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
router.get("/getUserCount", auth, getUserCount);

export default router;
