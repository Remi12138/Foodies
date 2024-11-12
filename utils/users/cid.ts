import * as Crypto from "expo-crypto";

// Function to generate a unique, non-reversible, 14-character string
async function generateUniqueString14(input: string): Promise<string> {
  // Step 1: Create a SHA-256 hash of the input
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    input
  );

  // Step 2: Convert to Base62 to make it more compact, then truncate to 14 characters
  const base62Hash = base62Encode(BigInt("0x" + hash));

  // Step 3: Return the first 14 characters
  return base62Hash.substring(0, 14);
}

// Helper function to encode a BigInt to Base62
function base62Encode(num: bigint): string {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  while (num > 0) {
    result = chars[Number(num % 62n)] + result;
    num = num / 62n;
  }

  return result || "0";
}

export { generateUniqueString14 };
