/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IndexDocumentsRequest } from '../models/IndexDocumentsRequest';
import type { IndexingResponse } from '../models/IndexingResponse';
import type { SearchDocumentsRequest } from '../models/SearchDocumentsRequest';
import type { SearchResponse } from '../models/SearchResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DocumentIndexingService {
    /**
     * Index User Documents
     * Index user documents for RAG functionality
     * @param requestBody
     * @returns IndexingResponse Successful Response
     * @throws ApiError
     */
    public static indexUserDocumentsDocumentsIndexingIndexPost(
        requestBody: IndexDocumentsRequest,
    ): CancelablePromise<IndexingResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/documents/indexing/index',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search User Documents
     * Search user documents using RAG
     * @param requestBody
     * @returns SearchResponse Successful Response
     * @throws ApiError
     */
    public static searchUserDocumentsDocumentsIndexingSearchPost(
        requestBody: SearchDocumentsRequest,
    ): CancelablePromise<SearchResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/documents/indexing/search',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reindex All Documents
     * Reindex all documents in the system (admin only)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static reindexAllDocumentsDocumentsIndexingReindexAllPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/documents/indexing/reindex-all',
        });
    }
}
