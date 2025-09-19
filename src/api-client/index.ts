/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiError } from './core/ApiError';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { AdminCreate } from './models/AdminCreate';
export type { AdminResponse } from './models/AdminResponse';
export type { AdminUpdate } from './models/AdminUpdate';
export type { Body_create_department_departments__post } from './models/Body_create_department_departments__post';
export type { Body_create_province_provinces__post } from './models/Body_create_province_provinces__post';
export type { Body_update_department_departments__department_id__put } from './models/Body_update_department_departments__department_id__put';
export type { Body_update_province_provinces__province_id__put } from './models/Body_update_province_provinces__province_id__put';
export type { Body_upload_document_documents_upload_post } from './models/Body_upload_document_documents_upload_post';
export type { Body_upload_examinations_document_documents_upload_examinations_post } from './models/Body_upload_examinations_document_documents_upload_examinations_post';
export type { Body_upload_staff_document_documents_upload_staff_post } from './models/Body_upload_staff_document_documents_upload_staff_post';
export type { Body_upload_students_document_documents_upload_students_post } from './models/Body_upload_students_document_documents_upload_students_post';
export type { ChatMessageResponse } from './models/ChatMessageResponse';
export type { ChatSendRequest } from './models/ChatSendRequest';
export type { ChatSessionCreate } from './models/ChatSessionCreate';
export type { ChatSessionRename } from './models/ChatSessionRename';
export type { ChatSessionResponse } from './models/ChatSessionResponse';
export type { ChatSessionWithMessagesResponse } from './models/ChatSessionWithMessagesResponse';
export type { DepartmentCreate } from './models/DepartmentCreate';
export type { DepartmentResponse } from './models/DepartmentResponse';
export type { DepartmentUpdate } from './models/DepartmentUpdate';
export type { DocumentResponse } from './models/DocumentResponse';
export type { HTTPValidationError } from './models/HTTPValidationError';
export type { IndexDocumentsRequest } from './models/IndexDocumentsRequest';
export type { IndexingResponse } from './models/IndexingResponse';
export type { LLMConfigRequest } from './models/LLMConfigRequest';
export type { LLMConfigResponse } from './models/LLMConfigResponse';
export type { LoginRequest } from './models/LoginRequest';
export type { ProvinceCreate } from './models/ProvinceCreate';
export type { ProvinceResponse } from './models/ProvinceResponse';
export type { ProvinceUpdate } from './models/ProvinceUpdate';
export type { RegisterRequest } from './models/RegisterRequest';
export type { RoleCreate } from './models/RoleCreate';
export type { RoleResponse } from './models/RoleResponse';
export type { RoleUpdate } from './models/RoleUpdate';
export type { SchoolDataCreate } from './models/SchoolDataCreate';
export type { SchoolResponse } from './models/SchoolResponse';
export type { SchoolUpdate } from './models/SchoolUpdate';
export type { SearchDocumentsRequest } from './models/SearchDocumentsRequest';
export type { SearchResponse } from './models/SearchResponse';
export type { Token } from './models/Token';
export type { UserCreate } from './models/UserCreate';
export type { UserResponse } from './models/UserResponse';
export type { UserUpdate } from './models/UserUpdate';
export type { ValidationError } from './models/ValidationError';

export { AdminsService } from './services/AdminsService';
export { AuthenticationService } from './services/AuthenticationService';
export { ChatService } from './services/ChatService';
export { DefaultService } from './services/DefaultService';
export { DepartmentsService } from './services/DepartmentsService';
export { DocumentIndexingService } from './services/DocumentIndexingService';
export { DocumentsService } from './services/DocumentsService';
export { LlmService } from './services/LlmService';
export { ProvincesService } from './services/ProvincesService';
export { RolesService } from './services/RolesService';
export { SchoolsService } from './services/SchoolsService';
export { UsersService } from './services/UsersService';
