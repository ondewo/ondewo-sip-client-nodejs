// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright 2021 ONDEWO GmbH
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


// ONDEWO-SIP API available at <a href="https://github.com/ondewo/ondewo-sip-api>">GitHub</a>
var SipService = exports.SipService = {
  // Starts a new SIP session for an account registered at a SIP server. <code>RegisterAccount</code> need to be called before.
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
  // Ends a SIP session for an account registered at a SIP server
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
  // Starts a call in an active SIP session for an account registered at a SIP server
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
  // Ends a call in an active SIP session for an account registered at a SIP server
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
  // Transfers a call in an active SIP session for an account registered at a SIP server to
// another SIP account or phone number specified by <code>transfer_id</code>
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
  // Registers s SIP account at a SIP server
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
  // Gets the current SIP status
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
  // Gets the history of SIP status
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
  // Plays wav files during an ongoing call of an active SIP session
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
  // Mutes the microphone in an ongoing call of an active SIP session
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
  // Un-mutes the microphone in an ongoing call of an active SIP session
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
};

exports.SipClient = grpc.makeGenericClientConstructor(SipService);
// SIP LifeCycle is explained at <a href="https://thanhloi2603.wordpress.com/2017/06/10/sip-lifecycle-overview/">here</a>
