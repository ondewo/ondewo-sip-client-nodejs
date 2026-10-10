// package: ondewo.sip
// file: ondewo/sip/sip.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class SipEndCallRequest extends jspb.Message { 
    getHardHangup(): boolean;
    setHardHangup(value: boolean): SipEndCallRequest;
    getEndReason(): SipEndCallRequest.EndCallReason;
    setEndReason(value: SipEndCallRequest.EndCallReason): SipEndCallRequest;

    hasAmdResult(): boolean;
    clearAmdResult(): void;
    getAmdResult(): AnsweringMachineDetectionResult | undefined;
    setAmdResult(value?: AnsweringMachineDetectionResult): SipEndCallRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipEndCallRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SipEndCallRequest): SipEndCallRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipEndCallRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipEndCallRequest;
    static deserializeBinaryFromReader(message: SipEndCallRequest, reader: jspb.BinaryReader): SipEndCallRequest;
}

export namespace SipEndCallRequest {
    export type AsObject = {
        hardHangup: boolean,
        endReason: SipEndCallRequest.EndCallReason,
        amdResult?: AnsweringMachineDetectionResult.AsObject,
    }

    export enum EndCallReason {
    END_CALL_REASON_UNSPECIFIED = 0,
    ANSWERING_MACHINE = 1,
    ANSWERING_MACHINE_VOICE_MESSAGE_LEFT = 2,
    END_CALL_REASON_TRANSFERRED = 3,
    }

}

export class SipReportAnsweringMachineDetectedRequest extends jspb.Message { 

    hasAmdResult(): boolean;
    clearAmdResult(): void;
    getAmdResult(): AnsweringMachineDetectionResult | undefined;
    setAmdResult(value?: AnsweringMachineDetectionResult): SipReportAnsweringMachineDetectedRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipReportAnsweringMachineDetectedRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SipReportAnsweringMachineDetectedRequest): SipReportAnsweringMachineDetectedRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipReportAnsweringMachineDetectedRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipReportAnsweringMachineDetectedRequest;
    static deserializeBinaryFromReader(message: SipReportAnsweringMachineDetectedRequest, reader: jspb.BinaryReader): SipReportAnsweringMachineDetectedRequest;
}

export namespace SipReportAnsweringMachineDetectedRequest {
    export type AsObject = {
        amdResult?: AnsweringMachineDetectionResult.AsObject,
    }
}

export class AnsweringMachineDetectionResult extends jspb.Message { 
    getVerdict(): AnsweringMachineDetectionResult.Verdict;
    setVerdict(value: AnsweringMachineDetectionResult.Verdict): AnsweringMachineDetectionResult;
    getCause(): AnsweringMachineDetectionResult.Cause;
    setCause(value: AnsweringMachineDetectionResult.Cause): AnsweringMachineDetectionResult;
    getConfidence(): number;
    setConfidence(value: number): AnsweringMachineDetectionResult;
    getDecisionMs(): number;
    setDecisionMs(value: number): AnsweringMachineDetectionResult;
    getRuleId(): string;
    setRuleId(value: string): AnsweringMachineDetectionResult;
    clearMatchedCueIdsList(): void;
    getMatchedCueIdsList(): Array<string>;
    setMatchedCueIdsList(value: Array<string>): AnsweringMachineDetectionResult;
    addMatchedCueIds(value: string, index?: number): string;
    getActionTaken(): AnsweringMachineDetectionResult.ActionTaken;
    setActionTaken(value: AnsweringMachineDetectionResult.ActionTaken): AnsweringMachineDetectionResult;
    getCallId(): string;
    setCallId(value: string): AnsweringMachineDetectionResult;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AnsweringMachineDetectionResult.AsObject;
    static toObject(includeInstance: boolean, msg: AnsweringMachineDetectionResult): AnsweringMachineDetectionResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AnsweringMachineDetectionResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AnsweringMachineDetectionResult;
    static deserializeBinaryFromReader(message: AnsweringMachineDetectionResult, reader: jspb.BinaryReader): AnsweringMachineDetectionResult;
}

export namespace AnsweringMachineDetectionResult {
    export type AsObject = {
        verdict: AnsweringMachineDetectionResult.Verdict,
        cause: AnsweringMachineDetectionResult.Cause,
        confidence: number,
        decisionMs: number,
        ruleId: string,
        matchedCueIdsList: Array<string>,
        actionTaken: AnsweringMachineDetectionResult.ActionTaken,
        callId: string,
    }

    export enum Verdict {
    VERDICT_UNSPECIFIED = 0,
    HUMAN = 1,
    MACHINE = 2,
    IVR = 3,
    FAX = 4,
    NETWORK_ANNOUNCEMENT = 5,
    CALL_SCREENING = 6,
    NO_SPEECH = 7,
    UNKNOWN = 8,
    }

    export enum Cause {
    CAUSE_UNSPECIFIED = 0,
    CADENCE = 1,
    KEYWORD = 2,
    BEEP = 3,
    TONE = 4,
    CADENCE_AND_KEYWORD = 5,
    CADENCE_AND_BEEP = 6,
    TIMEOUT = 7,
    SILENCE = 8,
    }

    export enum ActionTaken {
    ACTION_TAKEN_UNSPECIFIED = 0,
    HUNG_UP = 1,
    CONTINUED = 2,
    DETECT_ONLY = 3,
    LEFT_VOICE_MESSAGE = 4,
    }

}

export class SipStartCallRequest extends jspb.Message { 
    getCalleeId(): string;
    setCalleeId(value: string): SipStartCallRequest;

    getHeadersMap(): jspb.Map<string, string>;
    clearHeadersMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipStartCallRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SipStartCallRequest): SipStartCallRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipStartCallRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipStartCallRequest;
    static deserializeBinaryFromReader(message: SipStartCallRequest, reader: jspb.BinaryReader): SipStartCallRequest;
}

export namespace SipStartCallRequest {
    export type AsObject = {
        calleeId: string,

        headersMap: Array<[string, string]>,
    }
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipRegisterAccountRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipRegisterAccountRequest;
    static deserializeBinaryFromReader(message: SipRegisterAccountRequest, reader: jspb.BinaryReader): SipRegisterAccountRequest;
}

export namespace SipRegisterAccountRequest {
    export type AsObject = {
        accountName: string,
        password: string,
        authUsername: string,
        outboundProxy: string,
    }
}

export class SipStartSessionRequest extends jspb.Message { 
    getAccountName(): string;
    setAccountName(value: string): SipStartSessionRequest;
    getAutoAnswerInterval(): number;
    setAutoAnswerInterval(value: number): SipStartSessionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipStartSessionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SipStartSessionRequest): SipStartSessionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipStartSessionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipStartSessionRequest;
    static deserializeBinaryFromReader(message: SipStartSessionRequest, reader: jspb.BinaryReader): SipStartSessionRequest;
}

export namespace SipStartSessionRequest {
    export type AsObject = {
        accountName: string,
        autoAnswerInterval: number,
    }
}

export class SipTransferCallRequest extends jspb.Message { 
    getTransferId(): string;
    setTransferId(value: string): SipTransferCallRequest;

    getHeadersMap(): jspb.Map<string, string>;
    clearHeadersMap(): void;
    getOutcomeTimeoutMs(): number;
    setOutcomeTimeoutMs(value: number): SipTransferCallRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipTransferCallRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SipTransferCallRequest): SipTransferCallRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipTransferCallRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipTransferCallRequest;
    static deserializeBinaryFromReader(message: SipTransferCallRequest, reader: jspb.BinaryReader): SipTransferCallRequest;
}

export namespace SipTransferCallRequest {
    export type AsObject = {
        transferId: string,

        headersMap: Array<[string, string]>,
        outcomeTimeoutMs: number,
    }
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

    hasAmdResult(): boolean;
    clearAmdResult(): void;
    getAmdResult(): AnsweringMachineDetectionResult | undefined;
    setAmdResult(value?: AnsweringMachineDetectionResult): SipStatus;
    getCallId(): string;
    setCallId(value: string): SipStatus;
    getBotMuted(): boolean;
    setBotMuted(value: boolean): SipStatus;
    getListeningPaused(): boolean;
    setListeningPaused(value: boolean): SipStatus;
    getCallAudioStreams(): number;
    setCallAudioStreams(value: number): SipStatus;
    getSipResponseCode(): number;
    setSipResponseCode(value: number): SipStatus;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipStatus.AsObject;
    static toObject(includeInstance: boolean, msg: SipStatus): SipStatus.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipStatus, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipStatus;
    static deserializeBinaryFromReader(message: SipStatus, reader: jspb.BinaryReader): SipStatus;
}

export namespace SipStatus {
    export type AsObject = {
        accountName: string,
        timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        statusType: SipStatus.StatusType,
        calleeId: string,
        transferCallId: string,

        headersMap: Array<[string, string]>,
        description: string,
        exceptionName: string,
        exceptionTraceback: string,
        nluSessionName: string,
        amdResult?: AnsweringMachineDetectionResult.AsObject,
        callId: string,
        botMuted: boolean,
        listeningPaused: boolean,
        callAudioStreams: number,
        sipResponseCode: number,
    }

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
    NO_ONGOING_CALL = 21,
    OUTGOING_CALL_ANSWERING_MACHINE_DETECTED = 22,
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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipStatusHistoryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipStatusHistoryResponse;
    static deserializeBinaryFromReader(message: SipStatusHistoryResponse, reader: jspb.BinaryReader): SipStatusHistoryResponse;
}

export namespace SipStatusHistoryResponse {
    export type AsObject = {
        statusHistoryList: Array<SipStatus.AsObject>,
    }
}

export class SipSetCallMediaControlRequest extends jspb.Message { 
    getBotVoice(): MediaControlSetting;
    setBotVoice(value: MediaControlSetting): SipSetCallMediaControlRequest;
    getBotListening(): MediaControlSetting;
    setBotListening(value: MediaControlSetting): SipSetCallMediaControlRequest;
    getOwner(): MediaControlOwner;
    setOwner(value: MediaControlOwner): SipSetCallMediaControlRequest;
    getParticipantsPresent(): boolean;
    setParticipantsPresent(value: boolean): SipSetCallMediaControlRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipSetCallMediaControlRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SipSetCallMediaControlRequest): SipSetCallMediaControlRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipSetCallMediaControlRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipSetCallMediaControlRequest;
    static deserializeBinaryFromReader(message: SipSetCallMediaControlRequest, reader: jspb.BinaryReader): SipSetCallMediaControlRequest;
}

export namespace SipSetCallMediaControlRequest {
    export type AsObject = {
        botVoice: MediaControlSetting,
        botListening: MediaControlSetting,
        owner: MediaControlOwner,
        participantsPresent: boolean,
    }
}

export class SipCallAudioConfig extends jspb.Message { 
    getMode(): SipCallAudioMode;
    setMode(value: SipCallAudioMode): SipCallAudioConfig;
    getSampleRateHz(): number;
    setSampleRateHz(value: number): SipCallAudioConfig;
    getFrameMs(): number;
    setFrameMs(value: number): SipCallAudioConfig;
    getTakeOver(): boolean;
    setTakeOver(value: boolean): SipCallAudioConfig;
    getStreamId(): string;
    setStreamId(value: string): SipCallAudioConfig;
    getMaxDurationS(): number;
    setMaxDurationS(value: number): SipCallAudioConfig;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipCallAudioConfig.AsObject;
    static toObject(includeInstance: boolean, msg: SipCallAudioConfig): SipCallAudioConfig.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipCallAudioConfig, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipCallAudioConfig;
    static deserializeBinaryFromReader(message: SipCallAudioConfig, reader: jspb.BinaryReader): SipCallAudioConfig;
}

export namespace SipCallAudioConfig {
    export type AsObject = {
        mode: SipCallAudioMode,
        sampleRateHz: number,
        frameMs: number,
        takeOver: boolean,
        streamId: string,
        maxDurationS: number,
    }
}

export class SipCallAudioFrame extends jspb.Message { 
    getPcmS16le(): Uint8Array | string;
    getPcmS16le_asU8(): Uint8Array;
    getPcmS16le_asB64(): string;
    setPcmS16le(value: Uint8Array | string): SipCallAudioFrame;
    getSequence(): number;
    setSequence(value: number): SipCallAudioFrame;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipCallAudioFrame.AsObject;
    static toObject(includeInstance: boolean, msg: SipCallAudioFrame): SipCallAudioFrame.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipCallAudioFrame, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipCallAudioFrame;
    static deserializeBinaryFromReader(message: SipCallAudioFrame, reader: jspb.BinaryReader): SipCallAudioFrame;
}

export namespace SipCallAudioFrame {
    export type AsObject = {
        pcmS16le: Uint8Array | string,
        sequence: number,
    }
}

export class SipCallAudioRequest extends jspb.Message { 

    hasConfig(): boolean;
    clearConfig(): void;
    getConfig(): SipCallAudioConfig | undefined;
    setConfig(value?: SipCallAudioConfig): SipCallAudioRequest;

    hasAudio(): boolean;
    clearAudio(): void;
    getAudio(): SipCallAudioFrame | undefined;
    setAudio(value?: SipCallAudioFrame): SipCallAudioRequest;

    hasAgentMuted(): boolean;
    clearAgentMuted(): void;
    getAgentMuted(): boolean;
    setAgentMuted(value: boolean): SipCallAudioRequest;

    getRequestCase(): SipCallAudioRequest.RequestCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipCallAudioRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SipCallAudioRequest): SipCallAudioRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipCallAudioRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipCallAudioRequest;
    static deserializeBinaryFromReader(message: SipCallAudioRequest, reader: jspb.BinaryReader): SipCallAudioRequest;
}

export namespace SipCallAudioRequest {
    export type AsObject = {
        config?: SipCallAudioConfig.AsObject,
        audio?: SipCallAudioFrame.AsObject,
        agentMuted: boolean,
    }

    export enum RequestCase {
        REQUEST_NOT_SET = 0,
        CONFIG = 1,
        AUDIO = 2,
        AGENT_MUTED = 3,
    }

}

export class SipCallAudioStarted extends jspb.Message { 
    getStreamId(): string;
    setStreamId(value: string): SipCallAudioStarted;
    getSampleRateHz(): number;
    setSampleRateHz(value: number): SipCallAudioStarted;
    getFrameMs(): number;
    setFrameMs(value: number): SipCallAudioStarted;
    getMode(): SipCallAudioMode;
    setMode(value: SipCallAudioMode): SipCallAudioStarted;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipCallAudioStarted.AsObject;
    static toObject(includeInstance: boolean, msg: SipCallAudioStarted): SipCallAudioStarted.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipCallAudioStarted, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipCallAudioStarted;
    static deserializeBinaryFromReader(message: SipCallAudioStarted, reader: jspb.BinaryReader): SipCallAudioStarted;
}

export namespace SipCallAudioStarted {
    export type AsObject = {
        streamId: string,
        sampleRateHz: number,
        frameMs: number,
        mode: SipCallAudioMode,
    }
}

export class SipCallAudioStats extends jspb.Message { 
    getFramesSent(): number;
    setFramesSent(value: number): SipCallAudioStats;
    getFramesDropped(): number;
    setFramesDropped(value: number): SipCallAudioStats;
    getFramesReceived(): number;
    setFramesReceived(value: number): SipCallAudioStats;
    getUnderruns(): number;
    setUnderruns(value: number): SipCallAudioStats;
    getFramesDiscarded(): number;
    setFramesDiscarded(value: number): SipCallAudioStats;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipCallAudioStats.AsObject;
    static toObject(includeInstance: boolean, msg: SipCallAudioStats): SipCallAudioStats.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipCallAudioStats, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipCallAudioStats;
    static deserializeBinaryFromReader(message: SipCallAudioStats, reader: jspb.BinaryReader): SipCallAudioStats;
}

export namespace SipCallAudioStats {
    export type AsObject = {
        framesSent: number,
        framesDropped: number,
        framesReceived: number,
        underruns: number,
        framesDiscarded: number,
    }
}

export class SipCallAudioEnded extends jspb.Message { 
    getReason(): SipCallAudioEndReason;
    setReason(value: SipCallAudioEndReason): SipCallAudioEnded;
    getDetail(): string;
    setDetail(value: string): SipCallAudioEnded;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipCallAudioEnded.AsObject;
    static toObject(includeInstance: boolean, msg: SipCallAudioEnded): SipCallAudioEnded.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipCallAudioEnded, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipCallAudioEnded;
    static deserializeBinaryFromReader(message: SipCallAudioEnded, reader: jspb.BinaryReader): SipCallAudioEnded;
}

export namespace SipCallAudioEnded {
    export type AsObject = {
        reason: SipCallAudioEndReason,
        detail: string,
    }
}

export class SipCallAudioResponse extends jspb.Message { 

    hasStarted(): boolean;
    clearStarted(): void;
    getStarted(): SipCallAudioStarted | undefined;
    setStarted(value?: SipCallAudioStarted): SipCallAudioResponse;

    hasAudio(): boolean;
    clearAudio(): void;
    getAudio(): SipCallAudioFrame | undefined;
    setAudio(value?: SipCallAudioFrame): SipCallAudioResponse;

    hasStats(): boolean;
    clearStats(): void;
    getStats(): SipCallAudioStats | undefined;
    setStats(value?: SipCallAudioStats): SipCallAudioResponse;

    hasEnded(): boolean;
    clearEnded(): void;
    getEnded(): SipCallAudioEnded | undefined;
    setEnded(value?: SipCallAudioEnded): SipCallAudioResponse;

    getResponseCase(): SipCallAudioResponse.ResponseCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SipCallAudioResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SipCallAudioResponse): SipCallAudioResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipCallAudioResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipCallAudioResponse;
    static deserializeBinaryFromReader(message: SipCallAudioResponse, reader: jspb.BinaryReader): SipCallAudioResponse;
}

export namespace SipCallAudioResponse {
    export type AsObject = {
        started?: SipCallAudioStarted.AsObject,
        audio?: SipCallAudioFrame.AsObject,
        stats?: SipCallAudioStats.AsObject,
        ended?: SipCallAudioEnded.AsObject,
    }

    export enum ResponseCase {
        RESPONSE_NOT_SET = 0,
        STARTED = 1,
        AUDIO = 2,
        STATS = 3,
        ENDED = 4,
    }

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
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SipPlayWavFilesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SipPlayWavFilesRequest;
    static deserializeBinaryFromReader(message: SipPlayWavFilesRequest, reader: jspb.BinaryReader): SipPlayWavFilesRequest;
}

export namespace SipPlayWavFilesRequest {
    export type AsObject = {
        wavFilesList: Array<Uint8Array | string>,
    }
}

export enum MediaControlSetting {
    MEDIA_CONTROL_SETTING_UNCHANGED = 0,
    MEDIA_CONTROL_SETTING_ON = 1,
    MEDIA_CONTROL_SETTING_OFF = 2,
}

export enum MediaControlOwner {
    MEDIA_CONTROL_OWNER_UNSPECIFIED = 0,
    MEDIA_CONTROL_OWNER_OPERATOR = 1,
    MEDIA_CONTROL_OWNER_PARTICIPANT = 2,
}

export enum SipCallAudioMode {
    SIP_CALL_AUDIO_MODE_UNSPECIFIED = 0,
    SIP_CALL_AUDIO_MODE_LISTEN = 1,
    SIP_CALL_AUDIO_MODE_TALK = 2,
}

export enum SipCallAudioEndReason {
    SIP_CALL_AUDIO_END_REASON_UNSPECIFIED = 0,
    SIP_CALL_AUDIO_END_REASON_CLIENT_CLOSED = 1,
    SIP_CALL_AUDIO_END_REASON_CALL_ENDED = 2,
    SIP_CALL_AUDIO_END_REASON_CALL_TRANSFERRED = 3,
    SIP_CALL_AUDIO_END_REASON_MAX_DURATION = 4,
    SIP_CALL_AUDIO_END_REASON_STALLED = 5,
    SIP_CALL_AUDIO_END_REASON_INTERNAL = 6,
}
