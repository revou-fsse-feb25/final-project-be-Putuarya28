import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// Update the path below to the correct location of your user.entity.ts file
import { User } from '../../users/entities/user.entity'; // Example path, adjust as needed
import { ROLES_KEY } from '../decorators/roles.decorator'; // Adjust the import based on your roles decorator location

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true; // If no roles are required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // Assuming user is attached to the request object

    return user && typeof user.role === 'string' && requiredRoles.includes(user.role); // Check if user role matches required roles
  }
}