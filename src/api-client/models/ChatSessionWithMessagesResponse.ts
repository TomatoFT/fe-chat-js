/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatMessageResponse } from './ChatMessageResponse';
export type ChatSessionWithMessagesResponse = {
    name?: (string | null);
    content?: (string | null);
    id: string;
    created_at: string;
    updated_at?: (string | null);
    messages?: Array<ChatMessageResponse>;
};

