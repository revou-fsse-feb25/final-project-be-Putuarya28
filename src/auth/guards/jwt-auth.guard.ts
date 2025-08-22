import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers["authorization"];
    if (!authHeader) {
      console.warn("[JwtAuthGuard] No Authorization header found");
      return false;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.warn(
        "[JwtAuthGuard] No token found in Authorization header",
        authHeader
      );
      return false;
    }
    try {
      console.log("[JwtAuthGuard] Verifying token:", token);
      const user = this.jwtService.verify(token);
      console.log("[JwtAuthGuard] Token verified, user:", user);
      (request as any).user = user;
      return true;
    } catch (e) {
      console.error("[JwtAuthGuard] Token verification failed", e);
      return false;
    }
  }
}
