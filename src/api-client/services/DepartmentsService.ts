/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_department_departments__post } from '../models/Body_create_department_departments__post';
import type { Body_update_department_departments__department_id__put } from '../models/Body_update_department_departments__department_id__put';
import type { DepartmentResponse } from '../models/DepartmentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepartmentsService {
    /**
     * Get Departments
     * Get all departments
     * @returns DepartmentResponse Successful Response
     * @throws ApiError
     */
    public static getDepartmentsDepartmentsGet(): CancelablePromise<Array<DepartmentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/departments/',
        });
    }
    /**
     * Create Department
     * Create new department (admin only)
     * @param requestBody
     * @returns DepartmentResponse Successful Response
     * @throws ApiError
     */
    public static createDepartmentDepartmentsPost(
        requestBody: Body_create_department_departments__post,
    ): CancelablePromise<DepartmentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/departments/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Department
     * Get department by ID
     * @param departmentId
     * @returns DepartmentResponse Successful Response
     * @throws ApiError
     */
    public static getDepartmentDepartmentsDepartmentIdGet(
        departmentId: string,
    ): CancelablePromise<DepartmentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/departments/{department_id}',
            path: {
                'department_id': departmentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Department
     * Update department (admin only)
     * @param departmentId
     * @param requestBody
     * @returns DepartmentResponse Successful Response
     * @throws ApiError
     */
    public static updateDepartmentDepartmentsDepartmentIdPut(
        departmentId: string,
        requestBody: Body_update_department_departments__department_id__put,
    ): CancelablePromise<DepartmentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/departments/{department_id}',
            path: {
                'department_id': departmentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Department
     * Delete department (admin only)
     * @param departmentId
     * @returns void
     * @throws ApiError
     */
    public static deleteDepartmentDepartmentsDepartmentIdDelete(
        departmentId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/departments/{department_id}',
            path: {
                'department_id': departmentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
