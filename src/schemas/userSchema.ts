import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           description: The name of the user.
 *         email:
 *           type: string
 *           format: email
 *           minLength: 5
 *           maxLength: 255
 *           description: The email address of the user.
 *         password:
 *           type: string
 *           format: password
 *           minLength: 5
 *           maxLength: 1024
 *           description: The password of the user.
 *         confirmpassword:
 *           type: string
 *           format: password
 *           minLength: 5
 *           maxLength: 1024
 *           description: The confirmed password of the user.
 *         isAdmin:
 *           type: boolean
 *           description: Indicates whether the user is an administrator or not.
 *           default: false
 *       required:
 *         - name
 *         - email
 *         - password
 *         - confirmpassword
 */

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  confirmpassword: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

const User = mongoose.model("User", userSchema);

export default User;
