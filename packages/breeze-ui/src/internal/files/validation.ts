import type { FileRejection, FileRejectionReason } from '../types/file';

interface FileConstraints {
  acceptedFileTypes?: readonly string[];
  allowsMultiple: boolean;
  maxFileSize?: number;
}

/** Result of applying Breeze-owned file constraints. */
export interface FileValidationResult {
  /** Files that satisfy every constraint. */
  accepted: File[];
  /** Files that failed one or more constraints. */
  rejected: FileRejection[];
}

function matchesAcceptedType(
  file: File,
  acceptedFileTypes: readonly string[],
): boolean {
  const normalizedName = file.name.toLowerCase();
  const normalizedType = file.type.toLowerCase();

  return acceptedFileTypes.some((acceptedType) => {
    const normalizedAcceptedType = acceptedType.toLowerCase();

    if (normalizedAcceptedType.startsWith('.')) {
      return normalizedName.endsWith(normalizedAcceptedType);
    }

    if (normalizedAcceptedType.endsWith('/*')) {
      return normalizedType.startsWith(normalizedAcceptedType.slice(0, -1));
    }

    return normalizedType === normalizedAcceptedType;
  });
}

/** Splits native files into accepted files and stable rejection records. */
export default function validateFiles(
  files: readonly File[],
  { acceptedFileTypes, allowsMultiple, maxFileSize }: FileConstraints,
): FileValidationResult {
  const validation = files.map((file, index) => {
    const reasons: FileRejectionReason[] = [];

    if (!allowsMultiple && index > 0) {
      reasons.push('file-count');
    }

    if (
      acceptedFileTypes?.length &&
      !matchesAcceptedType(file, acceptedFileTypes)
    ) {
      reasons.push('file-type');
    }

    if (maxFileSize !== undefined && file.size > maxFileSize) {
      reasons.push('file-size');
    }

    return { file, reasons };
  });

  return {
    accepted: validation
      .filter(({ reasons }) => reasons.length === 0)
      .map(({ file }) => file),
    rejected: validation.filter(({ reasons }) => reasons.length > 0),
  };
}
