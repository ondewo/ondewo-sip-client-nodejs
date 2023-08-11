// package: ondewo.sip
// file: ondewo/sip/sip.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

export class SipEndCallRequest extends jspb.Message {
	getHardHangup(): boolean;
	setHardHangup(value: boolean): SipEndCallRequest;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): SipEndCallRequest.AsObject;
	static toObject(includeInstance: boolean, msg: SipEndCallRequest): SipEndCallRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: SipEndCallRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): SipEndCallRequest;
	static deserializeBinaryFromReader(message: SipEndCallRequest, reader: jspb.BinaryReader): SipEndCallRequest;
}

export namespace SipEndCallRequest {
	export type AsObject = {
		hardHangup: boolean;
	};
}

export class SipStartCallRequest extends jspb.Message {
	getCalleeId(): string;
	setCalleeId(value: string): SipStartCallRequest;

	getHeadersMap(): jspb.Map<string, string>;
	clearHeadersMap(): void;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): SipStartCallRequest.AsObject;
	static toObject(includeInstance: boolean, msg: SipStartCallRequest): SipStartCallRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: SipStartCallRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): SipStartCallRequest;
	static deserializeBinaryFromReader(message: SipStartCallRequest, reader: jspb.BinaryReader): SipStartCallRequest;
}

export namespace SipStartCallRequest {
	export type AsObject = {
		calleeId: string;

		headersMap: Array<[string, string]>;
	};
}

export class SipRegisterAccountRequest extends jspb.Message {
	getAccountName(): string;
	setAccountName(value: string): SipRegisterAccountRequest;
	getPassword(): string;
	setPassword(value: string): SipRegisterAccountRequest;
	getAuthUsername(): string;
	setAuthUsername(value: string): SipRegisterAccountRequest;
	getOutboundProxy(): string;
	setOutboundProxy(value: string): SipRegisterAccountRequest;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): SipRegisterAccountRequest.AsObject;
	static toObject(includeInstance: boolean, msg: SipRegisterAccountRequest): SipRegisterAccountRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: SipRegisterAccountRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): SipRegisterAccountRequest;
	static deserializeBinaryFromReader(
		message: SipRegisterAccountRequest,
		reader: jspb.BinaryReader
	): SipRegisterAccountRequest;
}

export namespace SipRegisterAccountRequest {
	export type AsObject = {
		accountName: string;
		password: string;
		authUsername: string;
		outboundProxy: string;
	};
}

export class SipStartSessionRequest extends jspb.Message {
	getAccountName(): string;
	setAccountName(value: string): SipStartSessionRequest;
	getAutoAnswerInterval(): number;
	setAutoAnswerInterval(value: number): SipStartSessionRequest;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): SipStartSessionRequest.AsObject;
	static toObject(includeInstance: boolean, msg: SipStartSessionRequest): SipStartSessionRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: SipStartSessionRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): SipStartSessionRequest;
	static deserializeBinaryFromReader(
		message: SipStartSessionRequest,
		reader: jspb.BinaryReader
	): SipStartSessionRequest;
}

export namespace SipStartSessionRequest {
	export type AsObject = {
		accountName: string;
		autoAnswerInterval: number;
	};
}

export class SipTransferCallRequest extends jspb.Message {
	getTransferId(): string;
	setTransferId(value: string): SipTransferCallRequest;

	getHeadersMap(): jspb.Map<string, string>;
	clearHeadersMap(): void;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): SipTransferCallRequest.AsObject;
	static toObject(includeInstance: boolean, msg: SipTransferCallRequest): SipTransferCallRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: SipTransferCallRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): SipTransferCallRequest;
	static deserializeBinaryFromReader(
		message: SipTransferCallRequest,
		reader: jspb.BinaryReader
	): SipTransferCallRequest;
}

export namespace SipTransferCallRequest {
	export type AsObject = {
		transferId: string;

		headersMap: Array<[string, string]>;
	};
}

export class SipStatus extends jspb.Message {
	getAccountName(): string;
	setAccountName(value: string): SipStatus;

	hasTimestamp(): boolean;
	clearTimestamp(): void;
	getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
	setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): SipStatus;
	getStatusType(): SipStatus.StatusType;
	setStatusType(value: SipStatus.StatusType): SipStatus;
	getCalleeId(): string;
	setCalleeId(value: string): SipStatus;
	getTransferCallId(): string;
	setTransferCallId(value: string): SipStatus;

	getHeadersMap(): jspb.Map<string, string>;
	clearHeadersMap(): void;
	getDescription(): string;
	setDescription(value: string): SipStatus;
	getExceptionName(): string;
	setExceptionName(value: string): SipStatus;
	getExceptionTraceback(): string;
	setExceptionTraceback(value: string): SipStatus;
	getNluSessionName(): string;
	setNluSessionName(value: string): SipStatus;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): SipStatus.AsObject;
	static toObject(includeInstance: boolean, msg: SipStatus): SipStatus.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: SipStatus, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): SipStatus;
	static deserializeBinaryFromReader(message: SipStatus, reader: jspb.BinaryReader): SipStatus;
}

export namespace SipStatus {
	export type AsObject = {
		accountName: string;
		timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject;
		statusType: SipStatus.StatusType;
		calleeId: string;
		transferCallId: string;

		headersMap: Array<[string, string]>;
		description: string;
		exceptionName: string;
		exceptionTraceback: string;
		nluSessionName: string;
	};

	export enum StatusType {
		NO_SESSION = 0,
		REGISTERED = 1,
		READY = 2,
		INCOMING_CALL_INITIATED = 3,
		OUTGOING_CALL_INITIATED = 4,
		OUTGOING_CALL_CONNECTED = 5,
		INCOMING_CALL_CONNECTED = 6,
		TRANSFER_CALL_INITIATED = 7,
		SOFT_HANGUP_INITIATED = 8,
		HARD_HANGUP_INITIATED = 9,
		INCOMING_CALL_FAILED = 10,
		OUTGOING_CALL_FAILED = 11,
		INCOMING_CALL_FINISHED = 12,
		OUTGOING_CALL_FINISHED = 13,
		SESSION_REGISTRATION_FAILED = 14,
		SESSION_STARTED = 15,
		SESSION_ENDED = 16,
		TRANSFER_CALL_FAILED = 17,
		MICROPHONE_MUTED = 18,
		MICROPHONE_UNMUTED = 19,
		MICROPHONE_WAV_FILES_PLAYED = 20,
		NO_ONGOING_CALL = 21
	}
}

export class SipStatusHistoryResponse extends jspb.Message {
	clearStatusHistoryList(): void;
	getStatusHistoryList(): Array<SipStatus>;
	setStatusHistoryList(value: Array<SipStatus>): SipStatusHistoryResponse;
	addStatusHistory(value?: SipStatus, index?: number): SipStatus;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): SipStatusHistoryResponse.AsObject;
	static toObject(includeInstance: boolean, msg: SipStatusHistoryResponse): SipStatusHistoryResponse.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: SipStatusHistoryResponse, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): SipStatusHistoryResponse;
	static deserializeBinaryFromReader(
		message: SipStatusHistoryResponse,
		reader: jspb.BinaryReader
	): SipStatusHistoryResponse;
}

export namespace SipStatusHistoryResponse {
	export type AsObject = {
		statusHistoryList: Array<SipStatus.AsObject>;
	};
}

export class SipPlayWavFilesRequest extends jspb.Message {
	clearWavFilesList(): void;
	getWavFilesList(): Array<Uint8Array | string>;
	getWavFilesList_asU8(): Array<Uint8Array>;
	getWavFilesList_asB64(): Array<string>;
	setWavFilesList(value: Array<Uint8Array | string>): SipPlayWavFilesRequest;
	addWavFiles(value: Uint8Array | string, index?: number): Uint8Array | string;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): SipPlayWavFilesRequest.AsObject;
	static toObject(includeInstance: boolean, msg: SipPlayWavFilesRequest): SipPlayWavFilesRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: SipPlayWavFilesRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): SipPlayWavFilesRequest;
	static deserializeBinaryFromReader(
		message: SipPlayWavFilesRequest,
		reader: jspb.BinaryReader
	): SipPlayWavFilesRequest;
}

export namespace SipPlayWavFilesRequest {
	export type AsObject = {
		wavFilesList: Array<Uint8Array | string>;
	};
}
