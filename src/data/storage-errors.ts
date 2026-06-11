export type StorageErrorCode =
  | 'DB_NOT_AVAILABLE'
  | 'DB_OPEN_FAILED'
  | 'DB_BLOCKED'
  | 'DB_VERSION_CHANGED'
  | 'DB_STORE_MISSING'
  | 'DB_READ_FAILED'
  | 'DB_WRITE_FAILED'
  | 'DB_DELETE_FAILED'
  | 'DB_IMPORT_VALIDATION_FAILED'
  | 'DB_IMPORT_TRANSACTION_FAILED'
  | 'DB_QUOTA_EXCEEDED'
  | 'ID_GENERATION_FAILED';

export class StorageError extends Error {
  constructor(
    public readonly code: StorageErrorCode,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

export function toStorageError(code: StorageErrorCode, message: string, cause?: unknown): StorageError {
  if (cause instanceof StorageError) return cause;

  const domName = cause instanceof DOMException ? cause.name : getErrorName(cause);
  if (domName === 'QuotaExceededError' || domName === 'QuotaExceeded') {
    return new StorageError('DB_QUOTA_EXCEEDED', 'Der lokale Speicherplatz ist voll.', cause);
  }
  if (domName === 'VersionError') {
    return new StorageError('DB_VERSION_CHANGED', 'Die lokale Datenbankversion hat sich geaendert.', cause);
  }
  if (domName === 'NotFoundError') {
    return new StorageError('DB_STORE_MISSING', 'Eine lokale Datentabelle fehlt.', cause);
  }

  return new StorageError(code, message, cause);
}

export function logStorageError(context: string, error: unknown): void {
  console.error(`[SoloTodo storage] ${context}`, error);
}

export function storageErrorToUserMessage(error: unknown): string {
  const storageError = isStorageError(error) ? error : undefined;
  switch (storageError?.code) {
    case 'DB_NOT_AVAILABLE':
      return 'Lokale Speicherung ist in diesem Browser nicht verfuegbar.';
    case 'DB_BLOCKED':
      return 'Die lokale Datenbank ist durch einen anderen geoeffneten App-Tab blockiert. Bitte andere Tabs schliessen und neu laden.';
    case 'DB_VERSION_CHANGED':
      return 'Die lokale Datenbank wurde in einem anderen Tab aktualisiert. Bitte die App neu laden.';
    case 'DB_STORE_MISSING':
      return 'Die lokale Datenbankstruktur ist unvollstaendig. Bitte Speicherdiagnose ausfuehren.';
    case 'DB_QUOTA_EXCEEDED':
      return 'Der lokale Speicherplatz ist voll. Bitte Speicherplatz am Geraet freigeben und erneut versuchen.';
    case 'DB_IMPORT_VALIDATION_FAILED':
      return 'Das Backup ist ungueltig. Bestehende Daten wurden nicht veraendert.';
    case 'DB_IMPORT_TRANSACTION_FAILED':
      return 'Das Backup konnte nicht importiert werden. Bestehende Daten wurden nicht veraendert.';
    case 'ID_GENERATION_FAILED':
      return 'Es konnte keine sichere lokale ID erzeugt werden.';
    case 'DB_READ_FAILED':
      return 'Lokale Daten konnten nicht gelesen werden.';
    case 'DB_WRITE_FAILED':
      return 'Lokale Daten konnten nicht gespeichert werden.';
    case 'DB_DELETE_FAILED':
      return 'Lokale Daten konnten nicht geloescht werden.';
    case 'DB_OPEN_FAILED':
    default:
      return 'Lokale Datenbank konnte nicht geoeffnet werden.';
  }
}

function getErrorName(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'name' in error) return String((error as { name: unknown }).name);
  return undefined;
}
