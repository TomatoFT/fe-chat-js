/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SchoolDataCreate } from '../models/SchoolDataCreate';
import type { SchoolResponse } from '../models/SchoolResponse';
import type { SchoolUpdate } from '../models/SchoolUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SchoolsService {
    /**
     * Get Schools
     * Get all schools
     * @returns SchoolResponse Successful Response
     * @throws ApiError
     */
    public static getSchoolsSchoolsGet(): CancelablePromise<Array<SchoolResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/schools/',
        });
    }
    /**
     * Create School
     * Create new school (province manager and above)
     * @param requestBody
     * @returns SchoolResponse Successful Response
     * @throws ApiError
     */
    public static createSchoolSchoolsPost(
        requestBody: SchoolDataCreate,
    ): CancelablePromise<SchoolResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/schools/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get School
     * Get school by ID
     * @param schoolId
     * @returns SchoolResponse Successful Response
     * @throws ApiError
     */
    public static getSchoolSchoolsSchoolIdGet(
        schoolId: string,
    ): CancelablePromise<SchoolResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/schools/{school_id}',
            path: {
                'school_id': schoolId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update School
     * Update school (province manager and above)
     * @param schoolId
     * @param requestBody
     * @returns SchoolResponse Successful Response
     * @throws ApiError
     */
    public static updateSchoolSchoolsSchoolIdPut(
        schoolId: string,
        requestBody: SchoolUpdate,
    ): CancelablePromise<SchoolResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/schools/{school_id}',
            path: {
                'school_id': schoolId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete School
     * Delete school (province manager and above)
     * @param schoolId
     * @returns void
     * @throws ApiError
     */
    public static deleteSchoolSchoolsSchoolIdDelete(
        schoolId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/schools/{school_id}',
            path: {
                'school_id': schoolId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
