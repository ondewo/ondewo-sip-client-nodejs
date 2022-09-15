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

function serialize_ondewo_sip_EndCallRequest(arg) {
	if (!(arg instanceof ondewo_sip_sip_pb.EndCallRequest)) {
		throw new Error('Expected argument of type ondewo.sip.EndCallRequest');
	}
	return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_EndCallRequest(buffer_arg) {
	return ondewo_sip_sip_pb.EndCallRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_PlayWavFilesRequest(arg) {
	if (!(arg instanceof ondewo_sip_sip_pb.PlayWavFilesRequest)) {
		throw new Error('Expected argument of type ondewo.sip.PlayWavFilesRequest');
	}
	return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_PlayWavFilesRequest(buffer_arg) {
	return ondewo_sip_sip_pb.PlayWavFilesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_RegisterAccountRequest(arg) {
	if (!(arg instanceof ondewo_sip_sip_pb.RegisterAccountRequest)) {
		throw new Error('Expected argument of type ondewo.sip.RegisterAccountRequest');
	}
	return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_RegisterAccountRequest(buffer_arg) {
	return ondewo_sip_sip_pb.RegisterAccountRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_ondewo_sip_StartCallRequest(arg) {
	if (!(arg instanceof ondewo_sip_sip_pb.StartCallRequest)) {
		throw new Error('Expected argument of type ondewo.sip.StartCallRequest');
	}
	return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_StartCallRequest(buffer_arg) {
	return ondewo_sip_sip_pb.StartCallRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_StartSessionRequest(arg) {
	if (!(arg instanceof ondewo_sip_sip_pb.StartSessionRequest)) {
		throw new Error('Expected argument of type ondewo.sip.StartSessionRequest');
	}
	return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_StartSessionRequest(buffer_arg) {
	return ondewo_sip_sip_pb.StartSessionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_sip_TransferCallRequest(arg) {
	if (!(arg instanceof ondewo_sip_sip_pb.TransferCallRequest)) {
		throw new Error('Expected argument of type ondewo.sip.TransferCallRequest');
	}
	return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_sip_TransferCallRequest(buffer_arg) {
	return ondewo_sip_sip_pb.TransferCallRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

// ONDEWO-SIP API available at <a href="https://github.com/ondewo/ondewo-sip-api>">GitHub</a>
var SipService = (exports.SipService = {
	// Starts a new SIP session for an account registered at a SIP server. <code>RegisterAccount</code> need to be called before.
	startSession: {
		path: '/ondewo.sip.Sip/StartSession',
		requestStream: false,
		responseStream: false,
		requestType: ondewo_sip_sip_pb.StartSessionRequest,
		responseType: ondewo_sip_sip_pb.SipStatus,
		requestSerialize: serialize_ondewo_sip_StartSessionRequest,
		requestDeserialize: deserialize_ondewo_sip_StartSessionRequest,
		responseSerialize: serialize_ondewo_sip_SipStatus,
		responseDeserialize: deserialize_ondewo_sip_SipStatus
	},
	// Ends a SIP session for an account registered at a SIP server
	endSession: {
		path: '/ondewo.sip.Sip/EndSession',
		requestStream: false,
		responseStream: false,
		requestType: google_protobuf_empty_pb.Empty,
		responseType: ondewo_sip_sip_pb.SipStatus,
		requestSerialize: serialize_google_protobuf_Empty,
		requestDeserialize: deserialize_google_protobuf_Empty,
		responseSerialize: serialize_ondewo_sip_SipStatus,
		responseDeserialize: deserialize_ondewo_sip_SipStatus
	},
	// Starts a call in an active SIP session for an account registered at a SIP server
	startCall: {
		path: '/ondewo.sip.Sip/StartCall',
		requestStream: false,
		responseStream: false,
		requestType: ondewo_sip_sip_pb.StartCallRequest,
		responseType: ondewo_sip_sip_pb.SipStatus,
		requestSerialize: serialize_ondewo_sip_StartCallRequest,
		requestDeserialize: deserialize_ondewo_sip_StartCallRequest,
		responseSerialize: serialize_ondewo_sip_SipStatus,
		responseDeserialize: deserialize_ondewo_sip_SipStatus
	},
	// Ends a call in an active SIP session for an account registered at a SIP server
	endCall: {
		path: '/ondewo.sip.Sip/EndCall',
		requestStream: false,
		responseStream: false,
		requestType: ondewo_sip_sip_pb.EndCallRequest,
		responseType: ondewo_sip_sip_pb.SipStatus,
		requestSerialize: serialize_ondewo_sip_EndCallRequest,
		requestDeserialize: deserialize_ondewo_sip_EndCallRequest,
		responseSerialize: serialize_ondewo_sip_SipStatus,
		responseDeserialize: deserialize_ondewo_sip_SipStatus
	},
	// Transfers a call in an active SIP session for an account registered at a SIP server to
	// another SIP account or phone number specified by <code>transfer_id</code>
	transferCall: {
		path: '/ondewo.sip.Sip/TransferCall',
		requestStream: false,
		responseStream: false,
		requestType: ondewo_sip_sip_pb.TransferCallRequest,
		responseType: ondewo_sip_sip_pb.SipStatus,
		requestSerialize: serialize_ondewo_sip_TransferCallRequest,
		requestDeserialize: deserialize_ondewo_sip_TransferCallRequest,
		responseSerialize: serialize_ondewo_sip_SipStatus,
		responseDeserialize: deserialize_ondewo_sip_SipStatus
	},
	// Registers s SIP account at a SIP server
	registerAccount: {
		path: '/ondewo.sip.Sip/RegisterAccount',
		requestStream: false,
		responseStream: false,
		requestType: ondewo_sip_sip_pb.RegisterAccountRequest,
		responseType: ondewo_sip_sip_pb.SipStatus,
		requestSerialize: serialize_ondewo_sip_RegisterAccountRequest,
		requestDeserialize: deserialize_ondewo_sip_RegisterAccountRequest,
		responseSerialize: serialize_ondewo_sip_SipStatus,
		responseDeserialize: deserialize_ondewo_sip_SipStatus
	},
	// Gets the current SIP status
	getSipStatus: {
		path: '/ondewo.sip.Sip/GetSipStatus',
		requestStream: false,
		responseStream: false,
		requestType: google_protobuf_empty_pb.Empty,
		responseType: ondewo_sip_sip_pb.SipStatus,
		requestSerialize: serialize_google_protobuf_Empty,
		requestDeserialize: deserialize_google_protobuf_Empty,
		responseSerialize: serialize_ondewo_sip_SipStatus,
		responseDeserialize: deserialize_ondewo_sip_SipStatus
	},
	// Gets the history of SIP status
	getSipStatusHistory: {
		path: '/ondewo.sip.Sip/GetSipStatusHistory',
		requestStream: false,
		responseStream: false,
		requestType: google_protobuf_empty_pb.Empty,
		responseType: ondewo_sip_sip_pb.SipStatusHistoryResponse,
		requestSerialize: serialize_google_protobuf_Empty,
		requestDeserialize: deserialize_google_protobuf_Empty,
		responseSerialize: serialize_ondewo_sip_SipStatusHistoryResponse,
		responseDeserialize: deserialize_ondewo_sip_SipStatusHistoryResponse
	},
	// Plays wav files during an ongoing call of an active SIP session
	playWavFiles: {
		path: '/ondewo.sip.Sip/PlayWavFiles',
		requestStream: false,
		responseStream: false,
		requestType: ondewo_sip_sip_pb.PlayWavFilesRequest,
		responseType: ondewo_sip_sip_pb.SipStatus,
		requestSerialize: serialize_ondewo_sip_PlayWavFilesRequest,
		requestDeserialize: deserialize_ondewo_sip_PlayWavFilesRequest,
		responseSerialize: serialize_ondewo_sip_SipStatus,
		responseDeserialize: deserialize_ondewo_sip_SipStatus
	},
	// Mutes the microphone in an ongoing call of an active SIP session
	mute: {
		path: '/ondewo.sip.Sip/Mute',
		requestStream: false,
		responseStream: false,
		requestType: google_protobuf_empty_pb.Empty,
		responseType: ondewo_sip_sip_pb.SipStatus,
		requestSerialize: serialize_google_protobuf_Empty,
		requestDeserialize: deserialize_google_protobuf_Empty,
		responseSerialize: serialize_ondewo_sip_SipStatus,
		responseDeserialize: deserialize_ondewo_sip_SipStatus
	},
	// Unmutes the microphone in an ongoing call of an active SIP session
	unMute: {
		path: '/ondewo.sip.Sip/UnMute',
		requestStream: false,
		responseStream: false,
		requestType: google_protobuf_empty_pb.Empty,
		responseType: ondewo_sip_sip_pb.SipStatus,
		requestSerialize: serialize_google_protobuf_Empty,
		requestDeserialize: deserialize_google_protobuf_Empty,
		responseSerialize: serialize_ondewo_sip_SipStatus,
		responseDeserialize: deserialize_ondewo_sip_SipStatus
	}
});

exports.SipClient = grpc.makeGenericClientConstructor(SipService);
// SIP LifeCycle is explained at <a href="https://thanhloi2603.wordpress.com/2017/06/10/sip-lifecycle-overview/">here</a>
