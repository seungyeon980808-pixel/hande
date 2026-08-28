export const CANVASKIT_MAX_ENCODED_IMAGE_BASE64_LENGTH = 24 * 1024 * 1024;
export const CANVASKIT_MAX_IMAGE_DIMENSION = 8192;
export const CANVASKIT_MAX_DECODED_IMAGE_PIXELS = 32 * 1024 * 1024;

export type EncodedImageFormat = 'png' | 'jpeg' | 'gif' | 'webp' | 'bmp';

export interface EncodedImageDimensions {
  width: number;
  height: number;
}

export interface EncodedImageHeader extends EncodedImageDimensions {
  format: EncodedImageFormat;
}

export function encodedImageHeader(bytes: Uint8Array): EncodedImageHeader | null {
  return parsePngHeader(bytes)
    ?? parseGifHeader(bytes)
    ?? parseWebpHeader(bytes)
    ?? parseBmpHeader(bytes)
    ?? parseJpegHeader(bytes);
}

/** CanvasKit decode 전에 지원 형식과 bounded raster dimensions를 확인한다. */
export function replayableEncodedImageHeader(bytes: Uint8Array): EncodedImageHeader | null {
  if (
    bytes.byteLength === 0
    || Math.ceil(bytes.byteLength / 3) * 4 > CANVASKIT_MAX_ENCODED_IMAGE_BASE64_LENGTH
  ) {
    return null;
  }

  const header = encodedImageHeader(bytes);
  if (!header) return null;
  const pixels = header.width * header.height;
  return header.width <= CANVASKIT_MAX_IMAGE_DIMENSION
    && header.height <= CANVASKIT_MAX_IMAGE_DIMENSION
    && Number.isSafeInteger(pixels)
    && pixels <= CANVASKIT_MAX_DECODED_IMAGE_PIXELS
    ? header
    : null;
}

export function encodedImageIsReplayable(bytes: Uint8Array): boolean {
  return replayableEncodedImageHeader(bytes) !== null;
}

export function decodedImageMatchesEncodedHeader(
  header: EncodedImageHeader,
  width: unknown,
  height: unknown,
): boolean {
  if (
    !Number.isSafeInteger(width)
    || !Number.isSafeInteger(height)
    || (width as number) <= 0
    || (height as number) <= 0
    || (width as number) > CANVASKIT_MAX_IMAGE_DIMENSION
    || (height as number) > CANVASKIT_MAX_IMAGE_DIMENSION
  ) {
    return false;
  }
  const pixels = (width as number) * (height as number);
  if (!Number.isSafeInteger(pixels) || pixels > CANVASKIT_MAX_DECODED_IMAGE_PIXELS) {
    return false;
  }
  return (
    width === header.width
    && height === header.height
  ) || (
    header.format === 'jpeg'
    && width === header.height
    && height === header.width
  );
}

export function encodedImageDimensions(bytes: Uint8Array): EncodedImageDimensions | null {
  const header = encodedImageHeader(bytes);
  return header ? { width: header.width, height: header.height } : null;
}

function parsePngHeader(bytes: Uint8Array): EncodedImageHeader | null {
  if (
    bytes.byteLength < 33
    || !bytesEqual(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    || readUint32(bytes, 8, false) !== 13
    || !bytesEqual(bytes, 12, [0x49, 0x48, 0x44, 0x52])
  ) {
    return null;
  }

  const width = readUint32(bytes, 16, false);
  const height = readUint32(bytes, 20, false);
  const bitDepth = bytes[24];
  const colorType = bytes[25];
  const validDepth = colorType === 0
    ? [1, 2, 4, 8, 16].includes(bitDepth)
    : [2, 4, 6].includes(colorType)
      ? [8, 16].includes(bitDepth)
      : colorType === 3 && [1, 2, 4, 8].includes(bitDepth);
  if (
    width === 0
    || height === 0
    || !validDepth
    || bytes[26] !== 0
    || bytes[27] !== 0
    || bytes[28] > 1
  ) {
    return null;
  }

  return { format: 'png', width, height };
}

function parseGifHeader(bytes: Uint8Array): EncodedImageHeader | null {
  if (
    bytes.byteLength < 13
    || (
      !bytesEqual(bytes, 0, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61])
      && !bytesEqual(bytes, 0, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
    )
  ) {
    return null;
  }

  const width = readUint16(bytes, 6, true);
  const height = readUint16(bytes, 8, true);
  if (width === 0 || height === 0) return null;

  const packed = bytes[10];
  if ((packed & 0x80) !== 0) {
    const colorCount = 1 << ((packed & 0x07) + 1);
    if (bytes.byteLength < 13 + colorCount * 3) return null;
  }

  return { format: 'gif', width, height };
}

function parseWebpHeader(bytes: Uint8Array): EncodedImageHeader | null {
  if (
    bytes.byteLength < 20
    || !bytesEqual(bytes, 0, [0x52, 0x49, 0x46, 0x46])
    || !bytesEqual(bytes, 8, [0x57, 0x45, 0x42, 0x50])
  ) {
    return null;
  }

  const riffEnd = readUint32(bytes, 4, true) + 8;
  const chunkLength = readUint32(bytes, 16, true);
  const chunkEnd = 20 + chunkLength + (chunkLength & 1);
  if (
    !Number.isSafeInteger(riffEnd)
    || !Number.isSafeInteger(chunkEnd)
    || riffEnd > bytes.byteLength
    || riffEnd < 20
    || chunkEnd > riffEnd
    || chunkEnd > bytes.byteLength
  ) {
    return null;
  }

  let width: number;
  let height: number;
  if (bytesEqual(bytes, 12, [0x56, 0x50, 0x38, 0x58]) && chunkLength >= 10) {
    width = readUint24Le(bytes, 24) + 1;
    height = readUint24Le(bytes, 27) + 1;
  } else if (
    bytesEqual(bytes, 12, [0x56, 0x50, 0x38, 0x20])
    && chunkLength >= 10
    && bytesEqual(bytes, 23, [0x9d, 0x01, 0x2a])
  ) {
    width = readUint16(bytes, 26, true) & 0x3fff;
    height = readUint16(bytes, 28, true) & 0x3fff;
  } else if (
    bytesEqual(bytes, 12, [0x56, 0x50, 0x38, 0x4c])
    && chunkLength >= 5
    && bytes[20] === 0x2f
  ) {
    const bits = readUint32(bytes, 21, true);
    width = (bits & 0x3fff) + 1;
    height = ((bits >>> 14) & 0x3fff) + 1;
  } else {
    return null;
  }

  return width > 0 && height > 0 ? { format: 'webp', width, height } : null;
}

function parseBmpHeader(bytes: Uint8Array): EncodedImageHeader | null {
  if (bytes.byteLength < 54 || !bytesEqual(bytes, 0, [0x42, 0x4d])) {
    return null;
  }

  const dibLength = readUint32(bytes, 14, true);
  const dibEnd = 14 + dibLength;
  const pixelOffset = readUint32(bytes, 10, true);
  const bitsPerPixel = readUint16(bytes, 28, true);
  if (
    dibLength < 40
    || dibEnd > bytes.byteLength
    || pixelOffset < dibEnd
    || pixelOffset > bytes.byteLength
    || readUint16(bytes, 26, true) !== 1
    || ![1, 4, 8, 16, 24, 32].includes(bitsPerPixel)
  ) {
    return null;
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const width = view.getInt32(18, true);
  const height = view.getInt32(22, true);
  if (width <= 0 || height === 0 || height === -0x80000000) return null;

  return { format: 'bmp', width, height: Math.abs(height) };
}

function parseJpegHeader(bytes: Uint8Array): EncodedImageHeader | null {
  if (bytes.byteLength < 4 || !bytesEqual(bytes, 0, [0xff, 0xd8])) {
    return null;
  }

  let offset = 2;
  while (offset < bytes.byteLength) {
    if (bytes[offset] !== 0xff) return null;
    while (offset < bytes.byteLength && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.byteLength) return null;
    const marker = bytes[offset];
    offset += 1;

    if (marker === 0 || (marker >= 0xd8 && marker <= 0xda)) return null;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > bytes.byteLength) return null;

    const segmentLength = readUint16(bytes, offset, false);
    const segmentEnd = offset + segmentLength;
    if (segmentLength < 2 || segmentEnd > bytes.byteLength) return null;

    const isStartOfFrame = marker >= 0xc0
      && marker <= 0xcf
      && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isStartOfFrame) {
      if (segmentLength < 11 || offset + 8 > bytes.byteLength) return null;
      const componentCount = bytes[offset + 7];
      if (componentCount === 0 || segmentLength !== 8 + componentCount * 3) return null;
      const height = readUint16(bytes, offset + 3, false);
      const width = readUint16(bytes, offset + 5, false);
      return width > 0 && height > 0 ? { format: 'jpeg', width, height } : null;
    }

    offset = segmentEnd;
  }

  return null;
}

function readUint16(bytes: Uint8Array, offset: number, littleEndian: boolean): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    .getUint16(offset, littleEndian);
}

function readUint32(bytes: Uint8Array, offset: number, littleEndian: boolean): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    .getUint32(offset, littleEndian);
}

function readUint24Le(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16);
}

function bytesEqual(bytes: Uint8Array, offset: number, expected: readonly number[]): boolean {
  if (offset < 0 || offset + expected.length > bytes.byteLength) return false;
  return expected.every((byte, index) => bytes[offset + index] === byte);
}
