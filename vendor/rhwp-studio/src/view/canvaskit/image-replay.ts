import { blake3 } from '@noble/hashes/blake3.js';
import { bytesToHex } from '@noble/hashes/utils.js';

export interface CanvasKitImageBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasKitImageCrop {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface CanvasKitImageSourceRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * HWPUNIT image crop coordinates use the same 96 DPI scale as SVG replay:
 * 7200 HWPUNIT = 96 px, so 75 HWPUNIT = 1 px.
 */
export const HWPUNIT_PER_PIXEL = 75;

export interface CanvasKitImageCacheKeyInput {
  imageRef?: number | string;
  sourceImageKey?: string;
  mime?: string;
  base64?: string;
}

export function boundedCanvasKitSourceImageKey(value: string | undefined): string | null {
  return value !== undefined
    && value.length > 0
    && value.length <= 256
    && !/[\u0000-\u001f\u007f]/.test(value)
    ? value
    : null;
}

export function canvasKitImageCacheKey(
  input: CanvasKitImageCacheKeyInput,
  documentGeneration?: number,
): string | null {
  const parts: string[] = [];
  const sourceImageKey = boundedCanvasKitSourceImageKey(input.sourceImageKey);
  if (sourceImageKey !== null) {
    parts.push(`source:${sourceImageKey}`);
  } else {
    if (
      (typeof input.imageRef === 'number' && Number.isSafeInteger(input.imageRef))
      || (
        typeof input.imageRef === 'string'
        && input.imageRef.length > 0
        && input.imageRef.length <= 256
        && !/[\u0000-\u001f\u007f]/.test(input.imageRef)
      )
    ) {
      parts.push(`ref:${String(input.imageRef)}`);
    }
    if (input.base64) {
      const mime = input.mime
        && input.mime.length <= 128
        && !/[\u0000-\u001f\u007f]/.test(input.mime)
        ? input.mime
        : 'application/octet-stream';
      const digest = bytesToHex(blake3(new TextEncoder().encode(input.base64)));
      parts.push(`${mime}:${input.base64.length}:blake3:${digest}`);
    }
  }
  if (parts.length === 0) return null;
  return Number.isSafeInteger(documentGeneration)
    ? `document:${documentGeneration}|${parts.join('|')}`
    : parts.join('|');
}

export function canvasKitImageSourceRect(
  imageWidth: number,
  imageHeight: number,
  crop?: CanvasKitImageCrop,
  cropReferenceSize?: [number, number],
): CanvasKitImageSourceRect | null {
  if (!crop) return null;
  if (
    !Number.isFinite(imageWidth)
    || !Number.isFinite(imageHeight)
    || imageWidth <= 0
    || imageHeight <= 0
    || !Number.isFinite(crop.left)
    || !Number.isFinite(crop.top)
    || !Number.isFinite(crop.right)
    || !Number.isFinite(crop.bottom)
  ) {
    return null;
  }

  const referenceWidth = cropReferenceSize?.[0];
  const referenceHeight = cropReferenceSize?.[1];
  const scaleX = Number.isFinite(referenceWidth) && (referenceWidth ?? 0) > 0
    ? (referenceWidth as number) / imageWidth
    : HWPUNIT_PER_PIXEL;
  const scaleY = Number.isFinite(referenceHeight) && (referenceHeight ?? 0) > 0
    ? (referenceHeight as number) / imageHeight
    : HWPUNIT_PER_PIXEL;
  const x = crop.left / scaleX;
  const y = crop.top / scaleY;
  const width = (crop.right - crop.left) / scaleX;
  const height = (crop.bottom - crop.top) / scaleY;
  if (width <= 0 || height <= 0) return null;

  const clampedX = clamp(x, 0, imageWidth);
  const clampedY = clamp(y, 0, imageHeight);
  const clampedWidth = clamp(width, 0, imageWidth - clampedX);
  const clampedHeight = clamp(height, 0, imageHeight - clampedY);
  if (clampedWidth <= 0 || clampedHeight <= 0) return null;

  const isCropped = x > 0.5
    || y > 0.5
    || Math.abs(clampedWidth - imageWidth) > 1
    || Math.abs(clampedHeight - imageHeight) > 1;
  if (!isCropped) return null;

  return {
    x: clampedX,
    y: clampedY,
    width: clampedWidth,
    height: clampedHeight,
  };
}

export function canvasKitImagePlacement(
  fillMode: string | undefined,
  bbox: CanvasKitImageBounds,
  imageWidth: number,
  imageHeight: number,
): { x: number; y: number } {
  switch (fillMode) {
    case 'centerTop':
      return { x: bbox.x + (bbox.width - imageWidth) / 2, y: bbox.y };
    case 'rightTop':
      return { x: bbox.x + bbox.width - imageWidth, y: bbox.y };
    case 'leftCenter':
      return { x: bbox.x, y: bbox.y + (bbox.height - imageHeight) / 2 };
    case 'center':
      return { x: bbox.x + (bbox.width - imageWidth) / 2, y: bbox.y + (bbox.height - imageHeight) / 2 };
    case 'rightCenter':
      return { x: bbox.x + bbox.width - imageWidth, y: bbox.y + (bbox.height - imageHeight) / 2 };
    case 'leftBottom':
      return { x: bbox.x, y: bbox.y + bbox.height - imageHeight };
    case 'centerBottom':
      return { x: bbox.x + (bbox.width - imageWidth) / 2, y: bbox.y + bbox.height - imageHeight };
    case 'rightBottom':
      return { x: bbox.x + bbox.width - imageWidth, y: bbox.y + bbox.height - imageHeight };
    case 'leftTop':
    default:
      return { x: bbox.x, y: bbox.y };
  }
}

export function canvasKitImageFillModeTiles(fillMode: string | undefined): boolean {
  return fillMode === 'tileAll'
    || fillMode === 'tileHorzTop'
    || fillMode === 'tileHorzBottom'
    || fillMode === 'tileVertLeft'
    || fillMode === 'tileVertRight';
}

export function canvasKitImageFillModeStretches(fillMode: string | undefined): boolean {
  return fillMode === undefined || fillMode === 'fitToSize' || fillMode === 'total';
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
