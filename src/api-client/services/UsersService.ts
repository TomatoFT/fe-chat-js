/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get Current User Info
     * Get current user information
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static getCurrentUserInfoUsersMeGet(): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
        });
    }
    /**
     * Get Users
     * Get all users (admin only)
     * @param skip
     * @param limit
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static getUsersUsersGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<UserResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User
     * Get user by ID
     * @param userId
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static getUserUsersUserIdGet(
        userId: string,
    ): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
