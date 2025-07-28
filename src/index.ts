import fs from "fs";
import path from "path";

// Types
type Share = {
  x: bigint;
  y: bigint;
  original: string;
  base: number;
};

// Read & parse the share values
function parseShare(valueStr: string, base: number): bigint {
  return BigInt(parseInt(valueStr, base));
}

// Generate combinations of size k
function combinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = [];

  const backtrack = (start: number, curr: T[]) => {
    if (curr.length === k) {
      result.push([...curr]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      curr.push(arr[i]);
      backtrack(i + 1, curr);
      curr.pop();
    }
  };

  backtrack(0, []);
  return result;
}

// Lagrange Interpolation to get the secret (constant term of polynomial)
function interpolate(shares: Share[]): bigint {
  let secret = 0n;

  for (let i = 0; i < shares.length; i++) {
    let xi = shares[i].x;
    let yi = shares[i].y;
    let num = 1n;
    let den = 1n;

    for (let j = 0; j < shares.length; j++) {
      if (i !== j) {
        let xj = shares[j].x;
        num *= -xj;
        den *= xi - xj;
      }
    }

    const li = num / den;
    secret += yi * li;
  }

  return secret;
}

// Find the most common value
function mostCommon<T>(arr: T[]): T {
  const map = new Map<T, number>();
  for (const val of arr) {
    map.set(val, (map.get(val) || 0) + 1);
  }
  return [...map.entries()].reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}

async function main() {
  // ✅ Fix: Use process.cwd() instead of __dirname for ts-node compatibility
  const filePath = path.join(process.cwd(), "src", "secret.json");

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const { n, k } = data.keys;
  const shares: Share[] = [];

  for (const key in data) {
    if (key === "keys") continue;
    const { base, value } = data[key];
    shares.push({
      x: BigInt(key),
      y: parseShare(value, parseInt(base)),
      original: value,
      base: parseInt(base),
    });
  }

  // Try all k-share combinations
  const kCombos = combinations(shares, k);
  const secrets = kCombos.map(combo => interpolate(combo).toString());

  const finalSecret = mostCommon(secrets);
  console.log(`✅ Secret: ${finalSecret}`);

  // Find incorrect shares
  const incorrectShares: Set<string> = new Set();

  for (const share of shares) {
    const others = shares.filter(s => s !== share);
    if (others.length < k) continue;

    const testCombos = combinations(others, k);
    const allMatch = testCombos.some(combo =>
      interpolate(combo).toString() === finalSecret
    );

    if (!allMatch) {
      incorrectShares.add(share.original);
    }
  }

  console.log("❌ Incorrect Shares:");
  if (incorrectShares.size === 0) {
    console.log("All shares are valid.");
  } else {
    for (const share of incorrectShares) {
      console.log("-", share);
    }
  }
}

main().catch(console.error);
