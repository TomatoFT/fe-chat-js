/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoleCreate } from '../models/RoleCreate';
import type { RoleResponse } from '../models/RoleResponse';
import type { RoleUpdate } from '../models/RoleUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RolesService {
    /**
     * Get Roles
     * Get all roles
     * @returns RoleResponse Successful Response
     * @throws ApiError
     */
    public static getRolesRolesGet(): CancelablePromise<Array<RoleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/roles/',
        });
    }
    /**
     * Create Role
     * Create new role (admin only)
     * @param requestBody
     * @returns RoleResponse Successful Response
     * @throws ApiError
     */
    public static createRoleRolesPost(
        requestBody: RoleCreate,
    ): CancelablePromise<RoleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Role
     * Get role by ID
     * @param roleId
     * @returns RoleResponse Successful Response
     * @throws ApiError
     */
    public static getRoleRolesRoleIdGet(
        roleId: number,
    ): CancelablePromise<RoleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/roles/{role_id}',
            path: {
                'role_id': roleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Role
     * Update role (admin only)
     * @param roleId
     * @param requestBody
     * @returns RoleResponse Successful Response
     * @throws ApiError
     */
    public static updateRoleRolesRoleIdPut(
        roleId: number,
        requestBody: RoleUpdate,
    ): CancelablePromise<RoleResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/roles/{role_id}',
            path: {
                'role_id': roleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Role
     * Delete role (admin only)
     * @param roleId
     * @returns void
     * @throws ApiError
     */
    public static deleteRoleRolesRoleIdDelete(
        roleId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/roles/{role_id}',
            path: {
                'role_id': roleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
