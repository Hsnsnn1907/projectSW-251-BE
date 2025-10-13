import { customAlphabet } from "nanoid";
// 26 letters + 10 digits
const nano = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 32);
export const randomId = () => nano();
