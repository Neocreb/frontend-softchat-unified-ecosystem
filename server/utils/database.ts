
import { QueryResult } from "pg";

export function checkRowCount(result: QueryResult<any>): number {
  return result.rowCount ?? 0;
}

export function ensureArray<T>(value: T[] | QueryResult<T>): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value.rows || [];
}
