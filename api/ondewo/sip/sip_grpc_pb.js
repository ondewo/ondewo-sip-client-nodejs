// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright 2021 - 2026 ONDEWO GmbH
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
'use strict';
var grpc = require('@grpc/grpc-js');
var ondewo_sip_sip_pb = require('../../ondewo/sip/sip_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipCallAudioRequest(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipCallAudioRequest)) {
    throw new Error('Expected argument of type ondewo.sip.SipCallAudioRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipCallAudioRequest(buffer_arg) {
  return ondewo_sip_sip_pb.SipCallAudioRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipCallAudioResponse(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipCallAudioResponse)) {
    throw new Error('Expected argument of type ondewo.sip.SipCallAudioResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipCallAudioResponse(buffer_arg) {
  return ondewo_sip_sip_pb.SipCallAudioResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipEndCallRequest(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipEndCallRequest)) {
    throw new Error('Expected argument of type ondewo.sip.SipEndCallRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipEndCallRequest(buffer_arg) {
  return ondewo_sip_sip_pb.SipEndCallRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipPlayWavFilesRequest(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipPlayWavFilesRequest)) {
    throw new Error('Expected argument of type ondewo.sip.SipPlayWavFilesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipPlayWavFilesRequest(buffer_arg) {
  return ondewo_sip_sip_pb.SipPlayWavFilesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipRegisterAccountRequest(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipRegisterAccountRequest)) {
    throw new Error('Expected argument of type ondewo.sip.SipRegisterAccountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipRegisterAccountRequest(buffer_arg) {
  return ondewo_sip_sip_pb.SipRegisterAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipReportAnsweringMachineDetectedRequest(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipReportAnsweringMachineDetectedRequest)) {
    throw new Error('Expected argument of type ondewo.sip.SipReportAnsweringMachineDetectedRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipReportAnsweringMachineDetectedRequest(buffer_arg) {
  return ondewo_sip_sip_pb.SipReportAnsweringMachineDetectedRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipSetCallMediaControlRequest(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipSetCallMediaControlRequest)) {
    throw new Error('Expected argument of type ondewo.sip.SipSetCallMediaControlRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipSetCallMediaControlRequest(buffer_arg) {
  return ondewo_sip_sip_pb.SipSetCallMediaControlRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipStartCallRequest(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipStartCallRequest)) {
    throw new Error('Expected argument of type ondewo.sip.SipStartCallRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipStartCallRequest(buffer_arg) {
  return ondewo_sip_sip_pb.SipStartCallRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipStartSessionRequest(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipStartSessionRequest)) {
    throw new Error('Expected argument of type ondewo.sip.SipStartSessionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipStartSessionRequest(buffer_arg) {
  return ondewo_sip_sip_pb.SipStartSessionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipStatus(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipStatus)) {
    throw new Error('Expected argument of type ondewo.sip.SipStatus');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipStatus(buffer_arg) {
  return ondewo_sip_sip_pb.SipStatus.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipStatusHistoryResponse(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipStatusHistoryResponse)) {
    throw new Error('Expected argument of type ondewo.sip.SipStatusHistoryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipStatusHistoryResponse(buffer_arg) {
  return ondewo_sip_sip_pb.SipStatusHistoryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_SipTransferCallRequest(arg) {
  if (!(arg instanceof ondewo_sip_sip_pb.SipTransferCallRequest)) {
    throw new Error('Expected argument of type ondewo.sip.SipTransferCallRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_SipTransferCallRequest(buffer_arg) {
  return ondewo_sip_sip_pb.SipTransferCallRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// <p>ONDEWO-SIP API available at <a href="https://github.com/ondewo/ondewo-sip-api">GitHub</a></p>
var SipService = exports.SipService = {
  // <p>Starts a new SIP session for an account registered at a SIP server. <code>RegisterAccount</code> need to be called before.</p>
sipStartSession: {
    path: '/ondewo.sip.Sip/SipStartSession',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_sip_sip_pb.SipStartSessionRequest,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_ondewo_sip_SipStartSessionRequest,
    requestDeserialize: deserialize_ondewo_sip_SipStartSessionRequest,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Not idempotent (no idempotency_level): (re)creates the SIP session and registration.
// <p>Ends a SIP session for an account registered at a SIP server</p>
sipEndSession: {
    path: '/ondewo.sip.Sip/SipEndSession',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Not idempotent (no idempotency_level): tears down the session; a repeat records a new status.
// <p>Starts a call in an active SIP session for an account registered at a SIP server</p>
sipStartCall: {
    path: '/ondewo.sip.Sip/SipStartCall',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_sip_sip_pb.SipStartCallRequest,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_ondewo_sip_SipStartCallRequest,
    requestDeserialize: deserialize_ondewo_sip_SipStartCallRequest,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Not idempotent (no idempotency_level): a repeat dials a second call.
// <p>Ends a call in an active SIP session for an account registered at a SIP server</p>
sipEndCall: {
    path: '/ondewo.sip.Sip/SipEndCall',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_sip_sip_pb.SipEndCallRequest,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_ondewo_sip_SipEndCallRequest,
    requestDeserialize: deserialize_ondewo_sip_SipEndCallRequest,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Not idempotent (no idempotency_level): a repeat without a call appends its refusal to the history and ends
// a one-shot caller container; unscoped it can end the next call.
// <p>Transfers a call in an active SIP session for an account registered at a SIP server to another SIP account or phone number specified by <code>transfer_id</code></p>
// <p>Call scoping: when the gRPC metadatum <code>x-ondewo-expected-call-id</code> is present it must equal
// <code>SipStatus.call_id</code> of the ongoing call, otherwise the request is refused with
// <code>exception_name=CallScopeMismatch</code> and nothing is assigned to the status. When it is absent the request is
// accepted for backward compatibility (unless the server requires call scoping).</p>
// <p>With <code>outcome_timeout_ms = 0</code> the call is transferred as before (REFER, then an immediate hangup).
// With <code>outcome_timeout_ms &gt; 0</code> see <code>SipTransferCallRequest.outcome_timeout_ms</code>.</p>
// <p>Refused while invited participants are present (see
// <code>SipSetCallMediaControlRequest.participants_present</code>): a REFER into a conference bridge transfers every
// party in it, the invited participant included. The refusal is RETURNED as <code>TRANSFER_CALL_FAILED</code> with
// <code>exception_name=ParticipantsPresent</code> and <code>description = reason=participants-present</code>; nothing
// is sent and the call is kept.</p>
sipTransferCall: {
    path: '/ondewo.sip.Sip/SipTransferCall',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_sip_sip_pb.SipTransferCallRequest,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_ondewo_sip_SipTransferCallRequest,
    requestDeserialize: deserialize_ondewo_sip_SipTransferCallRequest,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Not idempotent (no idempotency_level): a repeat sends another REFER.
// <p>Registers s SIP account at a SIP server</p>
sipRegisterAccount: {
    path: '/ondewo.sip.Sip/SipRegisterAccount',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_sip_sip_pb.SipRegisterAccountRequest,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_ondewo_sip_SipRegisterAccountRequest,
    requestDeserialize: deserialize_ondewo_sip_SipRegisterAccountRequest,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Not idempotent (no idempotency_level): re-registers the account at the SIP server.
// <p>Gets the current SIP status</p>
sipGetSipStatus: {
    path: '/ondewo.sip.Sip/SipGetSipStatus',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // <p>Gets the history of SIP status</p>
sipGetSipStatusHistory: {
    path: '/ondewo.sip.Sip/SipGetSipStatusHistory',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: ondewo_sip_sip_pb.SipStatusHistoryResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_ondewo_sip_SipStatusHistoryResponse,
    responseDeserialize: deserialize_ondewo_sip_SipStatusHistoryResponse,
  },
  // <p>Plays wav files during an ongoing call of an active SIP session</p>
// <p>Call scoping as for <code>SipTransferCall</code>: a present <code>x-ondewo-expected-call-id</code> metadatum must
// match <code>SipStatus.call_id</code>.</p>
sipPlayWavFiles: {
    path: '/ondewo.sip.Sip/SipPlayWavFiles',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_sip_sip_pb.SipPlayWavFilesRequest,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_ondewo_sip_SipPlayWavFilesRequest,
    requestDeserialize: deserialize_ondewo_sip_SipPlayWavFilesRequest,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Not idempotent (no idempotency_level): a repeat plays the files again.
// <p>Mutes the microphone in an ongoing call of an active SIP session</p>
// <p>Call scoping as for <code>SipTransferCall</code>. Sent by the in-container speech-to-speech pipeline it mutes only
// the bot's own mixer slot; sent by a remote client it sets the operator mute of
// <code>SipSetCallMediaControl</code>, which the pipeline cannot undo.</p>
sipMute: {
    path: '/ondewo.sip.Sip/SipMute',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Not idempotent (no idempotency_level): without a call it assigns NO_ONGOING_CALL and appends to the history.
// <p>Un-mutes the microphone in an ongoing call of an active SIP session</p>
// <p>Call scoping and the split between the pipeline's own mute and the operator mute as for <code>SipMute</code>.</p>
sipUnMute: {
    path: '/ondewo.sip.Sip/SipUnMute',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Not idempotent (no idempotency_level): without a call it assigns NO_ONGOING_CALL and appends to the history.
// <p>Reports that answering machine detection reached a verdict on the ongoing outgoing call. Sets the status
// <code>OUTGOING_CALL_ANSWERING_MACHINE_DETECTED</code> carrying <code>amd_result</code>; the call stays up.</p>
// <p>Called by the speech-to-speech pipeline (ONDEWO-CSI) inside the same container, i.e. over loopback only.
// Refused, and the current status left untouched, when no outgoing call is connected: the returned
// <code>SipStatus</code> then carries the refusal in <code>exception_name</code> and <code>description</code></p>
sipReportAnsweringMachineDetected: {
    path: '/ondewo.sip.Sip/SipReportAnsweringMachineDetected',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_sip_sip_pb.SipReportAnsweringMachineDetectedRequest,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_ondewo_sip_SipReportAnsweringMachineDetectedRequest,
    requestDeserialize: deserialize_ondewo_sip_SipReportAnsweringMachineDetectedRequest,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Not idempotent (no idempotency_level): assigns a status and records answering machine detection telemetry.
// <p>Call-scoped operator media control of the ongoing call: mute the bot and/or pause its listening.</p>
// <p>Metadata REQUIRED: <code>x-ondewo-expected-call-id</code> (must equal <code>SipStatus.call_id</code> of the ongoing
// call) and <code>x-ondewo-sip-call-control-token</code> (the per-container call-control token).</p>
// <p>Every request sets a desired level per owner and never toggles; a repeat leaves the level unchanged. The bot is
// muted while ANY owner holds a mute, and its listening is paused while ANY owner holds a pause.</p>
// <p>Returns the live status with <code>call_id</code>, <code>bot_muted</code>, <code>listening_paused</code> and
// <code>call_audio_streams</code> filled. Refusals are RETURNED in <code>exception_name</code> /
// <code>description</code> (<code>CallScopeMismatch</code>, <code>CallControlUnauthenticated</code>,
// <code>NoOngoingCall</code>, <code>AmdInProgress</code>, <code>CsiMediaControlFailed</code>) and never assigned to
// the shared status. When the pipeline refuses or fails, a requested pause is rolled back and a requested mute is
// kept (the safe direction); the returned fields carry the actual level.</p>
sipSetCallMediaControl: {
    path: '/ondewo.sip.Sip/SipSetCallMediaControl',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_sip_sip_pb.SipSetCallMediaControlRequest,
    responseType: ondewo_sip_sip_pb.SipStatus,
    requestSerialize: serialize_ondewo_sip_SipSetCallMediaControlRequest,
    requestDeserialize: deserialize_ondewo_sip_SipSetCallMediaControlRequest,
    responseSerialize: serialize_ondewo_sip_SipStatus,
    responseDeserialize: deserialize_ondewo_sip_SipStatus,
  },
  // Deliberately unmarked although a repeat leaves the level unchanged: a retried attempt can land after a newer
// request of the same owner and restore a stale mute or pause.
// <p>Bidirectional live audio of the ongoing call.</p>
// <p>The first request MUST be <code>config</code> and must arrive within 2 seconds. Metadata as for
// <code>SipSetCallMediaControl</code>.</p>
// <p>LISTEN receives the caller (plus any conference participants) mixed with the bot. TALK sends the agent's audio to
// the caller; it REQUIRES <code>take_over</code>, i.e. the bot is muted and does not listen while the stream is
// connected, and in TALK the agent hears the caller only. Audio is LINEAR16 little-endian mono in 20 ms frames.</p>
// <p>gRPC status codes: <code>UNAUTHENTICATED</code> (token), <code>FAILED_PRECONDITION</code> (call id mismatch, no
// connected call, answering machine detection in progress, bot still speaking at TALK start),
// <code>INVALID_ARGUMENT</code> (missing or invalid <code>config</code>, wrong frame size),
// <code>RESOURCE_EXHAUSTED</code> (stream cap reached, a second TALK). A normal end sends one <code>ended</code>
// message and then OK.</p>
sipStreamCallAudio: {
    path: '/ondewo.sip.Sip/SipStreamCallAudio',
    requestStream: true,
    responseStream: true,
    requestType: ondewo_sip_sip_pb.SipCallAudioRequest,
    responseType: ondewo_sip_sip_pb.SipCallAudioResponse,
    requestSerialize: serialize_ondewo_sip_SipCallAudioRequest,
    requestDeserialize: deserialize_ondewo_sip_SipCallAudioRequest,
    responseSerialize: serialize_ondewo_sip_SipCallAudioResponse,
    responseDeserialize: deserialize_ondewo_sip_SipCallAudioResponse,
  },
  // Not idempotent (no idempotency_level): a stream takes a slot and, in TALK, takes over the call.
};

exports.SipClient = grpc.makeGenericClientConstructor(SipService, 'Sip');
// <p>SIP LifeCycle is explained at <a href="https://thanhloi2603.wordpress.com/2017/06/10/sip-lifecycle-overview/">here</a></p>
