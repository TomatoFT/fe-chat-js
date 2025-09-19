/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCreate } from '../models/AdminCreate';
import type { AdminResponse } from '../models/AdminResponse';
import type { AdminUpdate } from '../models/AdminUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminsService {
    /**
     * Get Admins
     * Get all admins (admin only)
     * @returns AdminResponse Successful Response
     * @throws ApiError
     */
    public static getAdminsAdminsGet(): CancelablePromise<Array<AdminResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admins/',
        });
    }
    /**
     * Create Admin
     * Create new admin (admin only)
     * @param requestBody
     * @returns AdminResponse Successful Response
     * @throws ApiError
     */
    public static createAdminAdminsPost(
        requestBody: AdminCreate,
    ): CancelablePromise<AdminResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admins/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Admin
     * Get admin by ID
     * @param adminId
     * @returns AdminResponse Successful Response
     * @throws ApiError
     */
    public static getAdminAdminsAdminIdGet(
        adminId: number,
    ): CancelablePromise<AdminResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admins/{admin_id}',
            path: {
                'admin_id': adminId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Admin
     * Update admin (admin only)
     * @param adminId
     * @param requestBody
     * @returns AdminResponse Successful Response
     * @throws ApiError
     */
    public static updateAdminAdminsAdminIdPut(
        adminId: number,
        requestBody: AdminUpdate,
    ): CancelablePromise<AdminResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admins/{admin_id}',
            path: {
                'admin_id': adminId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Admin
     * Delete admin (admin only)
     * @param adminId
     * @returns void
     * @throws ApiError
     */
    public static deleteAdminAdminsAdminIdDelete(
        adminId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admins/{admin_id}',
            path: {
                'admin_id': adminId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
