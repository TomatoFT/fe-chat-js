/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatSendRequest } from '../models/ChatSendRequest';
import type { ChatSessionCreate } from '../models/ChatSessionCreate';
import type { ChatSessionRename } from '../models/ChatSessionRename';
import type { ChatSessionResponse } from '../models/ChatSessionResponse';
import type { ChatSessionWithMessagesResponse } from '../models/ChatSessionWithMessagesResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatService {
    /**
     * Send Message
     * Send a chat message and get both user prompt and chatbot response
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static sendMessageChatSendPost(
        requestBody: ChatSendRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat/send',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Chat Sessions
     * Get all chat sessions for current user
     * @returns ChatSessionResponse Successful Response
     * @throws ApiError
     */
    public static getChatSessionsChatSessionsGet(): CancelablePromise<Array<ChatSessionResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/sessions',
        });
    }
    /**
     * Create Chat Session
     * Create a new chat session
     * @param requestBody
     * @returns ChatSessionResponse Successful Response
     * @throws ApiError
     */
    public static createChatSessionChatSessionsPost(
        requestBody: ChatSessionCreate,
    ): CancelablePromise<ChatSessionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat/sessions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Session With Messages
     * Get a specific chat session with messages
     * @param sessionId
     * @returns ChatSessionWithMessagesResponse Successful Response
     * @throws ApiError
     */
    public static getSessionWithMessagesChatSessionsSessionIdGet(
        sessionId: string,
    ): CancelablePromise<ChatSessionWithMessagesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/sessions/{session_id}',
            path: {
                'session_id': sessionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Session
     * Update a chat session
     * @param sessionId
     * @param requestBody
     * @returns ChatSessionResponse Successful Response
     * @throws ApiError
     */
    public static updateSessionChatSessionsSessionIdPut(
        sessionId: string,
        requestBody: ChatSessionRename,
    ): CancelablePromise<ChatSessionResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/chat/sessions/{session_id}',
            path: {
                'session_id': sessionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Session
     * Delete a chat session
     * @param sessionId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteSessionChatSessionsSessionIdDelete(
        sessionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/chat/sessions/{session_id}',
            path: {
                'session_id': sessionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
