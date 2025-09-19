/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_province_provinces__post } from '../models/Body_create_province_provinces__post';
import type { Body_update_province_provinces__province_id__put } from '../models/Body_update_province_provinces__province_id__put';
import type { ProvinceResponse } from '../models/ProvinceResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProvincesService {
    /**
     * Get Provinces
     * Get all provinces (department_manager only)
     * @returns ProvinceResponse Successful Response
     * @throws ApiError
     */
    public static getProvincesProvincesGet(): CancelablePromise<Array<ProvinceResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/provinces/',
        });
    }
    /**
     * Create Province
     * Create new province (department_manager only)
     * @param requestBody
     * @returns ProvinceResponse Successful Response
     * @throws ApiError
     */
    public static createProvinceProvincesPost(
        requestBody: Body_create_province_provinces__post,
    ): CancelablePromise<ProvinceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/provinces/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Province
     * Get province by ID (department_manager only)
     * @param provinceId
     * @returns ProvinceResponse Successful Response
     * @throws ApiError
     */
    public static getProvinceProvincesProvinceIdGet(
        provinceId: string,
    ): CancelablePromise<ProvinceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/provinces/{province_id}',
            path: {
                'province_id': provinceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Province
     * Update province (department_manager only)
     * @param provinceId
     * @param requestBody
     * @returns ProvinceResponse Successful Response
     * @throws ApiError
     */
    public static updateProvinceProvincesProvinceIdPut(
        provinceId: string,
        requestBody: Body_update_province_provinces__province_id__put,
    ): CancelablePromise<ProvinceResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/provinces/{province_id}',
            path: {
                'province_id': provinceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Province
     * Delete province (department_manager only)
     * @param provinceId
     * @returns void
     * @throws ApiError
     */
    public static deleteProvinceProvincesProvinceIdDelete(
        provinceId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/provinces/{province_id}',
            path: {
                'province_id': provinceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
