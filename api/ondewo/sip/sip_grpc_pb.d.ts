// package: ondewo.sip
// file: ondewo/sip/sip.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from 'grpc';
import * as ondewo_sip_sip_pb from '../../ondewo/sip/sip_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

interface ISipService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
	sipStartSession: ISipService_ISipStartSession;
	sipEndSession: ISipService_ISipEndSession;
	sipStartCall: ISipService_ISipStartCall;
	sipEndCall: ISipService_ISipEndCall;
	sipTransferCall: ISipService_ISipTransferCall;
	sipRegisterAccount: ISipService_ISipRegisterAccount;
	sipGetSipStatus: ISipService_ISipGetSipStatus;
	sipGetSipStatusHistory: ISipService_ISipGetSipStatusHistory;
	sipPlayWavFiles: ISipService_ISipPlayWavFiles;
	sipMute: ISipService_ISipMute;
	sipUnMute: ISipService_ISipUnMute;
}

interface ISipService_ISipStartSession
	extends grpc.MethodDefinition<ondewo_sip_sip_pb.SipStartSessionRequest, ondewo_sip_sip_pb.SipStatus> {
	path: '/ondewo.sip.Sip/SipStartSession';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStartSessionRequest>;
	requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStartSessionRequest>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}
interface ISipService_ISipEndSession
	extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatus> {
	path: '/ondewo.sip.Sip/SipEndSession';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
	requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}
interface ISipService_ISipStartCall
	extends grpc.MethodDefinition<ondewo_sip_sip_pb.SipStartCallRequest, ondewo_sip_sip_pb.SipStatus> {
	path: '/ondewo.sip.Sip/SipStartCall';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStartCallRequest>;
	requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStartCallRequest>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}
interface ISipService_ISipEndCall
	extends grpc.MethodDefinition<ondewo_sip_sip_pb.SipEndCallRequest, ondewo_sip_sip_pb.SipStatus> {
	path: '/ondewo.sip.Sip/SipEndCall';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<ondewo_sip_sip_pb.SipEndCallRequest>;
	requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipEndCallRequest>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}
interface ISipService_ISipTransferCall
	extends grpc.MethodDefinition<ondewo_sip_sip_pb.SipTransferCallRequest, ondewo_sip_sip_pb.SipStatus> {
	path: '/ondewo.sip.Sip/SipTransferCall';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<ondewo_sip_sip_pb.SipTransferCallRequest>;
	requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipTransferCallRequest>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}
interface ISipService_ISipRegisterAccount
	extends grpc.MethodDefinition<ondewo_sip_sip_pb.SipRegisterAccountRequest, ondewo_sip_sip_pb.SipStatus> {
	path: '/ondewo.sip.Sip/SipRegisterAccount';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<ondewo_sip_sip_pb.SipRegisterAccountRequest>;
	requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipRegisterAccountRequest>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}
interface ISipService_ISipGetSipStatus
	extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatus> {
	path: '/ondewo.sip.Sip/SipGetSipStatus';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
	requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}
interface ISipService_ISipGetSipStatusHistory
	extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatusHistoryResponse> {
	path: '/ondewo.sip.Sip/SipGetSipStatusHistory';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
	requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatusHistoryResponse>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatusHistoryResponse>;
}
interface ISipService_ISipPlayWavFiles
	extends grpc.MethodDefinition<ondewo_sip_sip_pb.SipPlayWavFilesRequest, ondewo_sip_sip_pb.SipStatus> {
	path: '/ondewo.sip.Sip/SipPlayWavFiles';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<ondewo_sip_sip_pb.SipPlayWavFilesRequest>;
	requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipPlayWavFilesRequest>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}
interface ISipService_ISipMute
	extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatus> {
	path: '/ondewo.sip.Sip/SipMute';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
	requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}
interface ISipService_ISipUnMute
	extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatus> {
	path: '/ondewo.sip.Sip/SipUnMute';
	requestStream: false;
	responseStream: false;
	requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
	requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
	responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
	responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}

export const SipService: ISipService;

export interface ISipServer {
	sipStartSession: grpc.handleUnaryCall<ondewo_sip_sip_pb.SipStartSessionRequest, ondewo_sip_sip_pb.SipStatus>;
	sipEndSession: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatus>;
	sipStartCall: grpc.handleUnaryCall<ondewo_sip_sip_pb.SipStartCallRequest, ondewo_sip_sip_pb.SipStatus>;
	sipEndCall: grpc.handleUnaryCall<ondewo_sip_sip_pb.SipEndCallRequest, ondewo_sip_sip_pb.SipStatus>;
	sipTransferCall: grpc.handleUnaryCall<ondewo_sip_sip_pb.SipTransferCallRequest, ondewo_sip_sip_pb.SipStatus>;
	sipRegisterAccount: grpc.handleUnaryCall<ondewo_sip_sip_pb.SipRegisterAccountRequest, ondewo_sip_sip_pb.SipStatus>;
	sipGetSipStatus: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatus>;
	sipGetSipStatusHistory: grpc.handleUnaryCall<
		google_protobuf_empty_pb.Empty,
		ondewo_sip_sip_pb.SipStatusHistoryResponse
	>;
	sipPlayWavFiles: grpc.handleUnaryCall<ondewo_sip_sip_pb.SipPlayWavFilesRequest, ondewo_sip_sip_pb.SipStatus>;
	sipMute: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatus>;
	sipUnMute: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatus>;
}

export interface ISipClient {
	sipStartSession(
		request: ondewo_sip_sip_pb.SipStartSessionRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipStartSession(
		request: ondewo_sip_sip_pb.SipStartSessionRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipStartSession(
		request: ondewo_sip_sip_pb.SipStartSessionRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipEndSession(
		request: google_protobuf_empty_pb.Empty,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipEndSession(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipEndSession(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipStartCall(
		request: ondewo_sip_sip_pb.SipStartCallRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipStartCall(
		request: ondewo_sip_sip_pb.SipStartCallRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipStartCall(
		request: ondewo_sip_sip_pb.SipStartCallRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipEndCall(
		request: ondewo_sip_sip_pb.SipEndCallRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipEndCall(
		request: ondewo_sip_sip_pb.SipEndCallRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipEndCall(
		request: ondewo_sip_sip_pb.SipEndCallRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipTransferCall(
		request: ondewo_sip_sip_pb.SipTransferCallRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipTransferCall(
		request: ondewo_sip_sip_pb.SipTransferCallRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipTransferCall(
		request: ondewo_sip_sip_pb.SipTransferCallRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipRegisterAccount(
		request: ondewo_sip_sip_pb.SipRegisterAccountRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipRegisterAccount(
		request: ondewo_sip_sip_pb.SipRegisterAccountRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipRegisterAccount(
		request: ondewo_sip_sip_pb.SipRegisterAccountRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipGetSipStatus(
		request: google_protobuf_empty_pb.Empty,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipGetSipStatus(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipGetSipStatus(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipGetSipStatusHistory(
		request: google_protobuf_empty_pb.Empty,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void
	): grpc.ClientUnaryCall;
	sipGetSipStatusHistory(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void
	): grpc.ClientUnaryCall;
	sipGetSipStatusHistory(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void
	): grpc.ClientUnaryCall;
	sipPlayWavFiles(
		request: ondewo_sip_sip_pb.SipPlayWavFilesRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipPlayWavFiles(
		request: ondewo_sip_sip_pb.SipPlayWavFilesRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipPlayWavFiles(
		request: ondewo_sip_sip_pb.SipPlayWavFilesRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipMute(
		request: google_protobuf_empty_pb.Empty,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipMute(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipMute(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipUnMute(
		request: google_protobuf_empty_pb.Empty,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipUnMute(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	sipUnMute(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
}

export class SipClient extends grpc.Client implements ISipClient {
	constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
	public sipStartSession(
		request: ondewo_sip_sip_pb.SipStartSessionRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipStartSession(
		request: ondewo_sip_sip_pb.SipStartSessionRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipStartSession(
		request: ondewo_sip_sip_pb.SipStartSessionRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipEndSession(
		request: google_protobuf_empty_pb.Empty,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipEndSession(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipEndSession(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipStartCall(
		request: ondewo_sip_sip_pb.SipStartCallRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipStartCall(
		request: ondewo_sip_sip_pb.SipStartCallRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipStartCall(
		request: ondewo_sip_sip_pb.SipStartCallRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipEndCall(
		request: ondewo_sip_sip_pb.SipEndCallRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipEndCall(
		request: ondewo_sip_sip_pb.SipEndCallRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipEndCall(
		request: ondewo_sip_sip_pb.SipEndCallRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipTransferCall(
		request: ondewo_sip_sip_pb.SipTransferCallRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipTransferCall(
		request: ondewo_sip_sip_pb.SipTransferCallRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipTransferCall(
		request: ondewo_sip_sip_pb.SipTransferCallRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipRegisterAccount(
		request: ondewo_sip_sip_pb.SipRegisterAccountRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipRegisterAccount(
		request: ondewo_sip_sip_pb.SipRegisterAccountRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipRegisterAccount(
		request: ondewo_sip_sip_pb.SipRegisterAccountRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipGetSipStatus(
		request: google_protobuf_empty_pb.Empty,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipGetSipStatus(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipGetSipStatus(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipGetSipStatusHistory(
		request: google_protobuf_empty_pb.Empty,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void
	): grpc.ClientUnaryCall;
	public sipGetSipStatusHistory(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void
	): grpc.ClientUnaryCall;
	public sipGetSipStatusHistory(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void
	): grpc.ClientUnaryCall;
	public sipPlayWavFiles(
		request: ondewo_sip_sip_pb.SipPlayWavFilesRequest,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipPlayWavFiles(
		request: ondewo_sip_sip_pb.SipPlayWavFilesRequest,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipPlayWavFiles(
		request: ondewo_sip_sip_pb.SipPlayWavFilesRequest,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipMute(
		request: google_protobuf_empty_pb.Empty,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipMute(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipMute(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipUnMute(
		request: google_protobuf_empty_pb.Empty,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipUnMute(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
	public sipUnMute(
		request: google_protobuf_empty_pb.Empty,
		metadata: grpc.Metadata,
		options: Partial<grpc.CallOptions>,
		callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void
	): grpc.ClientUnaryCall;
}
