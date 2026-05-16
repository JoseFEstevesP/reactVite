const ALGORITHM = 'AES-GCM';

function hexToBuffer(hex: string): ArrayBuffer {
	const bytes: number[] = [];
	for (let i = 0; i < hex.length; i += 2) {
		bytes.push(Number.parseInt(hex.slice(i, i + 2), 16));
	}
	const buffer = new ArrayBuffer(bytes.length);
	const view = new Uint8Array(buffer);
	view.set(bytes);
	return buffer;
}

async function deriveKey(key: string): Promise<CryptoKey> {
	const encoder = new TextEncoder();
	const keyData = encoder.encode(key);
	const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
	return crypto.subtle.importKey('raw', hashBuffer, { name: ALGORITHM }, false, ['decrypt']);
}

export async function decrypt(encryptedText: string, key: string): Promise<string> {
	const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
	const iv = hexToBuffer(ivHex);
	const encrypted = hexToBuffer(encryptedHex);
	const authTag = hexToBuffer(authTagHex);

	const merged = new Uint8Array(encrypted.byteLength + authTag.byteLength);
	merged.set(new Uint8Array(encrypted), 0);
	merged.set(new Uint8Array(authTag), encrypted.byteLength);

	const cryptoKey = await deriveKey(key);
	const decryptedBuffer = await crypto.subtle.decrypt(
		{ name: ALGORITHM, iv, tagLength: 128 },
		cryptoKey,
		merged,
	);

	return new TextDecoder().decode(decryptedBuffer);
}
