const ADMIN_KEY_BASE64 = process.env.ADMIN_KEY_BASE64;

const base64ToUint8Array = (value: string): Uint8Array => {
  if (typeof Buffer !== "undefined") {
    // Node.js environment
    return new Uint8Array(Buffer.from(value, "base64"));
  }
  // Browser environment
  const binary = atob(value);
  const result = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    result[i] = binary.charCodeAt(i);
  }
  return result;
};

const toUint8Array = (value: string): Uint8Array => {
  const encoder = new TextEncoder();
  return encoder.encode(value);
};

const equalBuffers = (a: Uint8Array, b: Uint8Array) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const digestSha256 = async (value: Uint8Array): Promise<Uint8Array> => {
  if (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.subtle) {
    const buffer = new Uint8Array(value).buffer;
    const hashed = await globalThis.crypto.subtle.digest("SHA-256", buffer);
    return new Uint8Array(hashed);
  }
  const { createHash } = await import("node:crypto");
  const hash = createHash("sha256");
  hash.update(Buffer.from(value));
  return new Uint8Array(hash.digest());
};

const decodeAdminBytes = (): Uint8Array | null => {
  if (!ADMIN_KEY_BASE64) {
    console.error("ADMIN_KEY_BASE64 is not set in environment variables");
    return null;
  }
  try {
    return base64ToUint8Array(ADMIN_KEY_BASE64);
  } catch (error) {
    console.error("Failed to decode ADMIN_KEY_BASE64:", error);
    return null;
  }
};

export const validateAdminKey = async (candidate: string): Promise<boolean> => {
  if (!candidate || candidate.trim() === "") {
    console.log("Validation failed: empty candidate");
    return false;
  }

  const stored = decodeAdminBytes();
  if (!stored) {
    console.log("Validation failed: no stored key");
    return false;
  }

  // Log untuk debugging (hapus di production)
  console.log("Stored key length:", stored.length);
  console.log("Candidate:", candidate);

  const candidateBytes = toUint8Array(candidate);
  
  // Check 1: Plain text comparison
  if (equalBuffers(candidateBytes, stored)) {
    console.log("Match: plain text");
    return true;
  }

  // Check 2: Hashed comparison
  const hashedCandidate = await digestSha256(candidateBytes);
  const isMatch = equalBuffers(hashedCandidate, stored);
  
  console.log("Match: hashed =", isMatch);
  console.log("Hashed candidate length:", hashedCandidate.length);
  
  return isMatch;
};

// Utility function untuk generate base64 key (gunakan ini untuk setup)
export const generateAdminKeyBase64 = (plainKey: string, useHash = false): string => {
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(plainKey);
  
  if (useHash) {
    // Untuk hash, Anda perlu menjalankan ini di environment yang support crypto
    console.log("Use this in a crypto-enabled environment to hash first");
    return Buffer.from(keyBytes).toString("base64");
  }
  
  return Buffer.from(keyBytes).toString("base64");
};

// Helper function to test in Node.js environment
export const testAdminKey = async (plainKey: string) => {
  console.log("\n=== Admin Key Test ===");
  console.log("Plain key:", plainKey);
  
  // Generate plain text base64
  const plainBase64 = Buffer.from(plainKey).toString("base64");
  console.log("Plain Base64:", plainBase64);
  
  // Generate hashed base64
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(plainKey);
  const { createHash } = await import("node:crypto");
  const hash = createHash("sha256");
  hash.update(Buffer.from(keyBytes));
  const hashedBytes = hash.digest();
  const hashedBase64 = hashedBytes.toString("base64");
  console.log("Hashed Base64:", hashedBase64);
  
  console.log("\nAdd to .env.local:");
  console.log("ADMIN_KEY_BASE64=" + plainBase64);
  console.log("\nOr for hashed version:");
  console.log("ADMIN_KEY_BASE64=" + hashedBase64);
};