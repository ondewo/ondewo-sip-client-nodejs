// package: ondewo.sip
// file: ondewo/sip/sip.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as ondewo_sip_sip_pb from "../../ondewo/sip/sip_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface ISipService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    startSession: ISipService_IStartSession;
    endSession: ISipService_IEndSession;
    startCall: ISipService_IStartCall;
    endCall: ISipService_IEndCall;
    transferCall: ISipService_ITransferCall;
    registerAccount: ISipService_IRegisterAccount;
    getSipStatus: ISipService_IGetSipStatus;
    getSipStatusHistory: ISipService_IGetSipStatusHistory;
    playWavFiles: ISipService_IPlayWavFiles;
    mute: ISipService_IMute;
    unMute: ISipService_IUnMute;
}

interface ISipService_IStartSession extends grpc.MethodDefinition<ondewo_sip_sip_pb.StartSessionRequest, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.sip.Sip/StartSession";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_sip_sip_pb.StartSessionRequest>;
    requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.StartSessionRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISipService_IEndSession extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.sip.Sip/EndSession";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISipService_IStartCall extends grpc.MethodDefinition<ondewo_sip_sip_pb.StartCallRequest, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.sip.Sip/StartCall";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_sip_sip_pb.StartCallRequest>;
    requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.StartCallRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISipService_IEndCall extends grpc.MethodDefinition<ondewo_sip_sip_pb.EndCallRequest, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.sip.Sip/EndCall";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_sip_sip_pb.EndCallRequest>;
    requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.EndCallRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISipService_ITransferCall extends grpc.MethodDefinition<ondewo_sip_sip_pb.TransferCallRequest, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.sip.Sip/TransferCall";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_sip_sip_pb.TransferCallRequest>;
    requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.TransferCallRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISipService_IRegisterAccount extends grpc.MethodDefinition<ondewo_sip_sip_pb.RegisterAccountRequest, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.sip.Sip/RegisterAccount";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_sip_sip_pb.RegisterAccountRequest>;
    requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.RegisterAccountRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISipService_IGetSipStatus extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatus> {
    path: "/ondewo.sip.Sip/GetSipStatus";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatus>;
    responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatus>;
}
interface ISipService_IGetSipStatusHistory extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatusHistoryResponse> {
    path: "/ondewo.sip.Sip/GetSipStatusHistory";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<ondewo_sip_sip_pb.SipStatusHistoryResponse>;
    responseDeserialize: grpc.deserialize<ondewo_sip_sip_pb.SipStatusHistoryResponse>;
}
interface ISipService_IPlayWavFiles extends grpc.MethodDefinition<ondewo_sip_sip_pb.PlayWavFilesRequest, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.sip.Sip/PlayWavFiles";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_sip_sip_pb.PlayWavFilesRequest>;
    requestDeserialize: grpc.deserialize<ondewo_sip_sip_pb.PlayWavFilesRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISipService_IMute extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.sip.Sip/Mute";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISipService_IUnMute extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.sip.Sip/UnMute";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const SipService: ISipService;

export interface ISipServer {
    startSession: grpc.handleUnaryCall<ondewo_sip_sip_pb.StartSessionRequest, google_protobuf_empty_pb.Empty>;
    endSession: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty>;
    startCall: grpc.handleUnaryCall<ondewo_sip_sip_pb.StartCallRequest, google_protobuf_empty_pb.Empty>;
    endCall: grpc.handleUnaryCall<ondewo_sip_sip_pb.EndCallRequest, google_protobuf_empty_pb.Empty>;
    transferCall: grpc.handleUnaryCall<ondewo_sip_sip_pb.TransferCallRequest, google_protobuf_empty_pb.Empty>;
    registerAccount: grpc.handleUnaryCall<ondewo_sip_sip_pb.RegisterAccountRequest, google_protobuf_empty_pb.Empty>;
    getSipStatus: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatus>;
    getSipStatusHistory: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, ondewo_sip_sip_pb.SipStatusHistoryResponse>;
    playWavFiles: grpc.handleUnaryCall<ondewo_sip_sip_pb.PlayWavFilesRequest, google_protobuf_empty_pb.Empty>;
    mute: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty>;
    unMute: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty>;
}

export interface ISipClient {
    startSession(request: ondewo_sip_sip_pb.StartSessionRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    startSession(request: ondewo_sip_sip_pb.StartSessionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    startSession(request: ondewo_sip_sip_pb.StartSessionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    endSession(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    endSession(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    endSession(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    startCall(request: ondewo_sip_sip_pb.StartCallRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    startCall(request: ondewo_sip_sip_pb.StartCallRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    startCall(request: ondewo_sip_sip_pb.StartCallRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    endCall(request: ondewo_sip_sip_pb.EndCallRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    endCall(request: ondewo_sip_sip_pb.EndCallRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    endCall(request: ondewo_sip_sip_pb.EndCallRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    transferCall(request: ondewo_sip_sip_pb.TransferCallRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    transferCall(request: ondewo_sip_sip_pb.TransferCallRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    transferCall(request: ondewo_sip_sip_pb.TransferCallRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    registerAccount(request: ondewo_sip_sip_pb.RegisterAccountRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    registerAccount(request: ondewo_sip_sip_pb.RegisterAccountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    registerAccount(request: ondewo_sip_sip_pb.RegisterAccountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    getSipStatus(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void): grpc.ClientUnaryCall;
    getSipStatus(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void): grpc.ClientUnaryCall;
    getSipStatus(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void): grpc.ClientUnaryCall;
    getSipStatusHistory(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void): grpc.ClientUnaryCall;
    getSipStatusHistory(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void): grpc.ClientUnaryCall;
    getSipStatusHistory(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void): grpc.ClientUnaryCall;
    playWavFiles(request: ondewo_sip_sip_pb.PlayWavFilesRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    playWavFiles(request: ondewo_sip_sip_pb.PlayWavFilesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    playWavFiles(request: ondewo_sip_sip_pb.PlayWavFilesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    mute(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    mute(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    mute(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    unMute(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    unMute(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    unMute(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class SipClient extends grpc.Client implements ISipClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public startSession(request: ondewo_sip_sip_pb.StartSessionRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public startSession(request: ondewo_sip_sip_pb.StartSessionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public startSession(request: ondewo_sip_sip_pb.StartSessionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public endSession(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public endSession(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public endSession(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public startCall(request: ondewo_sip_sip_pb.StartCallRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public startCall(request: ondewo_sip_sip_pb.StartCallRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public startCall(request: ondewo_sip_sip_pb.StartCallRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public endCall(request: ondewo_sip_sip_pb.EndCallRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public endCall(request: ondewo_sip_sip_pb.EndCallRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public endCall(request: ondewo_sip_sip_pb.EndCallRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public transferCall(request: ondewo_sip_sip_pb.TransferCallRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public transferCall(request: ondewo_sip_sip_pb.TransferCallRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public transferCall(request: ondewo_sip_sip_pb.TransferCallRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public registerAccount(request: ondewo_sip_sip_pb.RegisterAccountRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public registerAccount(request: ondewo_sip_sip_pb.RegisterAccountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public registerAccount(request: ondewo_sip_sip_pb.RegisterAccountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public getSipStatus(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void): grpc.ClientUnaryCall;
    public getSipStatus(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void): grpc.ClientUnaryCall;
    public getSipStatus(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatus) => void): grpc.ClientUnaryCall;
    public getSipStatusHistory(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void): grpc.ClientUnaryCall;
    public getSipStatusHistory(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void): grpc.ClientUnaryCall;
    public getSipStatusHistory(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_sip_sip_pb.SipStatusHistoryResponse) => void): grpc.ClientUnaryCall;
    public playWavFiles(request: ondewo_sip_sip_pb.PlayWavFilesRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public playWavFiles(request: ondewo_sip_sip_pb.PlayWavFilesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public playWavFiles(request: ondewo_sip_sip_pb.PlayWavFilesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public mute(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public mute(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public mute(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public unMute(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public unMute(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public unMute(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
