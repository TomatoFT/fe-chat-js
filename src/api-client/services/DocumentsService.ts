/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_document_documents_upload_post } from '../models/Body_upload_document_documents_upload_post';
import type { Body_upload_examinations_document_documents_upload_examinations_post } from '../models/Body_upload_examinations_document_documents_upload_examinations_post';
import type { Body_upload_staff_document_documents_upload_staff_post } from '../models/Body_upload_staff_document_documents_upload_staff_post';
import type { Body_upload_students_document_documents_upload_students_post } from '../models/Body_upload_students_document_documents_upload_students_post';
import type { DocumentResponse } from '../models/DocumentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DocumentsService {
    /**
     * Upload Document
     * Upload a document to MinIO
     * @param formData
     * @returns DocumentResponse Successful Response
     * @throws ApiError
     */
    public static uploadDocumentDocumentsUploadPost(
        formData: Body_upload_document_documents_upload_post,
    ): CancelablePromise<DocumentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/documents/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Documents
     * Get all documents for current user
     * @returns DocumentResponse Successful Response
     * @throws ApiError
     */
    public static getDocumentsDocumentsGet(): CancelablePromise<Array<DocumentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/documents/',
        });
    }
    /**
     * Download Document
     * Download a document from MinIO
     * @param documentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadDocumentDocumentsDocumentIdDownloadGet(
        documentId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/documents/{document_id}/download',
            path: {
                'document_id': documentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Document
     * Get document by ID
     * @param documentId
     * @returns DocumentResponse Successful Response
     * @throws ApiError
     */
    public static getDocumentDocumentsDocumentIdGet(
        documentId: string,
    ): CancelablePromise<DocumentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/documents/{document_id}',
            path: {
                'document_id': documentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Document
     * Delete a document from MinIO and database
     * @param documentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteDocumentDocumentsDocumentIdDelete(
        documentId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/documents/{document_id}',
            path: {
                'document_id': documentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Staff Document
     * Upload a document for staff
     * @param formData
     * @returns DocumentResponse Successful Response
     * @throws ApiError
     */
    public static uploadStaffDocumentDocumentsUploadStaffPost(
        formData: Body_upload_staff_document_documents_upload_staff_post,
    ): CancelablePromise<DocumentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/documents/upload-staff',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Students Document
     * Upload a document for students
     * @param formData
     * @returns DocumentResponse Successful Response
     * @throws ApiError
     */
    public static uploadStudentsDocumentDocumentsUploadStudentsPost(
        formData: Body_upload_students_document_documents_upload_students_post,
    ): CancelablePromise<DocumentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/documents/upload-students',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Examinations Document
     * Upload a document for examinations
     * @param formData
     * @returns DocumentResponse Successful Response
     * @throws ApiError
     */
    public static uploadExaminationsDocumentDocumentsUploadExaminationsPost(
        formData: Body_upload_examinations_document_documents_upload_examinations_post,
    ): CancelablePromise<DocumentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/documents/upload-examinations',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
