import type { LayerGlyphOutlineOp, LayerGlyphRunOp, LayerPaintOp } from '@/core/types';
import type { StaticSvgPathLayer } from '../static-svg-path-layers';

export function staticSvgPathLayersAreReplayable(
  layers: readonly StaticSvgPathLayer[],
  makePath: (pathData: string) => { delete?: () => void } | null,
): boolean {
  if (layers.length === 0) return false;
  for (const layer of layers) {
    let path: { delete?: () => void } | null = null;
    try {
      path = makePath(layer.pathData);
    } catch {
      return false;
    }
    if (!path) return false;
    path.delete?.();
  }
  return true;
}

export function selectLayerTextVariantsForLeaf(
  ops: readonly LayerPaintOp[],
  canReplayGlyphOutline: (op: LayerGlyphOutlineOp) => boolean,
  canReplayGlyphRun: (op: LayerGlyphRunOp) => boolean = () => false,
): Set<LayerPaintOp> {
  const MAX_VARIANT_PARTS = 4096;
  const selected = new Set<LayerPaintOp>();
  const groups = new Map<string, LayerPaintOp[]>();
  for (const op of ops) {
    const group = 'variant' in op ? op.variant?.equivalenceGroup : undefined;
    if (!group) continue;
    const variants = groups.get(group) ?? [];
    variants.push(op);
    groups.set(group, variants);
  }
  for (const variants of groups.values()) {
    const candidates = new Map<string, {
      kind: string;
      expectedPartCount: number;
      parts: Set<number>;
      ops: LayerPaintOp[];
      structurallyValid: boolean;
      duplicatePart: boolean;
      fallback: boolean;
    }>();
    for (const op of variants) {
      if (!('variant' in op) || !op.variant?.variantId) continue;
      const partIndex = op.variant.partIndex ?? 0;
      const partCount = op.variant.partCount ?? 1;
      const declaredKind = op.variant.variantKind ?? op.type;
      const candidate = candidates.get(op.variant.variantId) ?? {
        kind: op.type,
        expectedPartCount: partCount,
        parts: new Set<number>(),
        ops: [],
        structurallyValid: true,
        duplicatePart: false,
        fallback: op.variant.isDefaultFallback === true || op.type === 'textRun',
      };
      candidate.structurallyValid &&= candidate.kind === op.type
        && declaredKind === op.type
        && candidate.expectedPartCount === partCount
        && Number.isInteger(partCount)
        && partCount > 0
        && partCount <= MAX_VARIANT_PARTS
        && Number.isInteger(partIndex)
        && partIndex >= 0
        && partIndex < partCount;
      candidate.duplicatePart ||= candidate.parts.has(partIndex);
      candidate.parts.add(partIndex);
      candidate.ops.push(op);
      candidate.fallback ||= op.variant.isDefaultFallback === true || op.type === 'textRun';
      candidates.set(op.variant.variantId, candidate);
    }
    const complete = [...candidates.values()].filter(candidate => (
      candidate.structurallyValid
      && !candidate.duplicatePart
      && candidate.parts.size === candidate.expectedPartCount
      && Array.from({ length: candidate.expectedPartCount }, (_, index) => index)
        .every(index => candidate.parts.has(index))
    ));
    let chosen: (typeof complete)[number] | undefined;
    for (const kind of ['glyphOutline', 'glyphRun'] as const) {
      chosen = complete.find(candidate => (
        candidate.kind === kind
        && !candidate.fallback
        && candidate.ops.every(op => (
          op.type === 'glyphOutline'
            ? canReplayGlyphOutline(op)
            : op.type === 'glyphRun' && canReplayGlyphRun(op)
        ))
      ));
      if (chosen) break;
    }
    chosen ??= complete.find(candidate => candidate.kind === 'textRun' && candidate.fallback);
    for (const op of chosen?.ops ?? []) selected.add(op);
  }
  return selected;
}
