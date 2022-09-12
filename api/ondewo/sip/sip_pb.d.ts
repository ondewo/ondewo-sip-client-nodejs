// package: ondewo.sip
// file: ondewo/sip/sip.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

export class EndCallRequest extends jspb.Message {
	getHardHangup(): boolean;
	setHardHangup(value: boolean): EndCallRequest;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): EndCallRequest.AsObject;
	static toObject(includeInstance: boolean, msg: EndCallRequest): EndCallRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: EndCallRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): EndCallRequest;
	static deserializeBinaryFromReader(message: EndCallRequest, reader: jspb.BinaryReader): EndCallRequest;
}

export namespace EndCallRequest {
	export type AsObject = {
		hardHangup: boolean;
	};
}

export class StartCallRequest extends jspb.Message {
	getCalleeId(): string;
	setCalleeId(value: string): StartCallRequest;

	getHeadersMap(): jspb.Map<string, string>;
	clearHeadersMap(): void;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): StartCallRequest.AsObject;
	static toObject(includeInstance: boolean, msg: StartCallRequest): StartCallRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: StartCallRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): StartCallRequest;
	static deserializeBinaryFromReader(message: StartCallRequest, reader: jspb.BinaryReader): StartCallRequest;
}

export namespace StartCallRequest {
	export type AsObject = {
		calleeId: string;

		headersMap: Array<[string, string]>;
	};
}

export class RegisterAccountRequest extends jspb.Message {
	getAccountName(): string;
	setAccountName(value: string): RegisterAccountRequest;
	getPassword(): string;
	setPassword(value: string): RegisterAccountRequest;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): RegisterAccountRequest.AsObject;
	static toObject(includeInstance: boolean, msg: RegisterAccountRequest): RegisterAccountRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: RegisterAccountRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): RegisterAccountRequest;
	static deserializeBinaryFromReader(
		message: RegisterAccountRequest,
		reader: jspb.BinaryReader
	): RegisterAccountRequest;
}

export namespace RegisterAccountRequest {
	export type AsObject = {
		accountName: string;
		password: string;
	};
}

export class StartSessionRequest extends jspb.Message {
	getAccountName(): string;
	setAccountName(value: string): StartSessionRequest;
	getAutoAnswerInterval(): number;
	setAutoAnswerInterval(value: number): StartSessionRequest;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): StartSessionRequest.AsObject;
	static toObject(includeInstance: boolean, msg: StartSessionRequest): StartSessionRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: StartSessionRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): StartSessionRequest;
	static deserializeBinaryFromReader(message: StartSessionRequest, reader: jspb.BinaryReader): StartSessionRequest;
}

export namespace StartSessionRequest {
	export type AsObject = {
		accountName: string;
		autoAnswerInterval: number;
	};
}

export class TransferCallRequest extends jspb.Message {
	getTransferId(): string;
	setTransferId(value: string): TransferCallRequest;

	getHeadersMap(): jspb.Map<string, string>;
	clearHeadersMap(): void;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): TransferCallRequest.AsObject;
	static toObject(includeInstance: boolean, msg: TransferCallRequest): TransferCallRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: TransferCallRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): TransferCallRequest;
	static deserializeBinaryFromReader(message: TransferCallRequest, reader: jspb.BinaryReader): TransferCallRequest;
}

export namespace TransferCallRequest {
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
		OUTGOING_CALL_FINISHED = 13
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

export class PlayWavFilesRequest extends jspb.Message {
	clearWavFilesList(): void;
	getWavFilesList(): Array<Uint8Array | string>;
	getWavFilesList_asU8(): Array<Uint8Array>;
	getWavFilesList_asB64(): Array<string>;
	setWavFilesList(value: Array<Uint8Array | string>): PlayWavFilesRequest;
	addWavFiles(value: Uint8Array | string, index?: number): Uint8Array | string;

	serializeBinary(): Uint8Array;
	toObject(includeInstance?: boolean): PlayWavFilesRequest.AsObject;
	static toObject(includeInstance: boolean, msg: PlayWavFilesRequest): PlayWavFilesRequest.AsObject;
	static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
	static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
	static serializeBinaryToWriter(message: PlayWavFilesRequest, writer: jspb.BinaryWriter): void;
	static deserializeBinary(bytes: Uint8Array): PlayWavFilesRequest;
	static deserializeBinaryFromReader(message: PlayWavFilesRequest, reader: jspb.BinaryReader): PlayWavFilesRequest;
}

export namespace PlayWavFilesRequest {
	export type AsObject = {
		wavFilesList: Array<Uint8Array | string>;
	};
}
