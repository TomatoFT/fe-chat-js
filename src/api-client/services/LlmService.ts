/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LLMConfigRequest } from '../models/LLMConfigRequest';
import type { LLMConfigResponse } from '../models/LLMConfigResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LlmService {
    /**
     * Get Llm Config
     * Get current LLM configuration
     * @returns LLMConfigResponse Successful Response
     * @throws ApiError
     */
    public static getLlmConfigLlmConfigGet(): CancelablePromise<LLMConfigResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/llm/config',
        });
    }
    /**
     * Update Llm Config
     * Update LLM configuration
     * @param requestBody
     * @returns LLMConfigResponse Successful Response
     * @throws ApiError
     */
    public static updateLlmConfigLlmConfigPost(
        requestBody: LLMConfigRequest,
    ): CancelablePromise<LLMConfigResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/llm/config',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Available Adapters
     * Get list of available LLM adapters
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getAvailableAdaptersLlmAdaptersGet(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/llm/adapters',
        });
    }
}
