/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { Token } from '../models/Token';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Login
     * Login endpoint
     * @param requestBody
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static loginAuthLoginPost(
        requestBody: LoginRequest,
    ): CancelablePromise<Token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Register
     * Register endpoint
     * @param requestBody
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static registerAuthRegisterPost(
        requestBody: RegisterRequest,
    ): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Current User Info
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static getCurrentUserInfoAuthMeGet(): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
        });
    }
}
