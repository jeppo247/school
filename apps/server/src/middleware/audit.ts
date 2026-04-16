import type { Request, Response, NextFunction } from "express";
import { db } from "../db/client.js";
import { auditEvents } from "../db/schema.js";

/**
 * Records an audit event for data access and modifications.
 * Used for Australian Privacy Principles compliance.
 */
export async function recordAudit(
  actorId: string | null,
  entityType: string,
  entityId: string,
  action: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  await db.insert(auditEvents).values({
    actorId: actorId ?? "system",
    entityType,
    entityId,
    action,
    metadata: metadata ?? {},
  });
}

/**
 * Middleware that logs data-access audit events for sensitive routes.
 * Attach to routes that read or modify student data.
 */
export function auditMiddleware(entityType: string, action: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const actorId = (req as Record<string, unknown>).userId as string ?? "anonymous";
    const entityId = req.params.id ?? req.params.studentId ?? "unknown";

    // Fire and forget — don't block the request
    recordAudit(actorId, entityType, entityId, action, {
      method: req.method,
      path: req.path,
      ip: req.ip,
    }).catch(() => {});

    next();
  };
}
