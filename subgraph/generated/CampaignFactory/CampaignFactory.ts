// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class CampaignCreated extends ethereum.Event {
  get params(): CampaignCreated__Params {
    return new CampaignCreated__Params(this);
  }
}

export class CampaignCreated__Params {
  _event: CampaignCreated;

  constructor(event: CampaignCreated) {
    this._event = event;
  }

  get campaignId(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get campaignAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get creator(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get name(): string {
    return this._event.parameters[3].value.toString();
  }

  get deadline(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get totalRewardAmount(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get rewardPerReferral(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class CampaignStopped extends ethereum.Event {
  get params(): CampaignStopped__Params {
    return new CampaignStopped__Params(this);
  }
}

export class CampaignStopped__Params {
  _event: CampaignStopped;

  constructor(event: CampaignStopped) {
    this._event = event;
  }

  get campaignId(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get campaignAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get name(): string {
    return this._event.parameters[2].value.toString();
  }

  get deadline(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get timestamp(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class CampaignFactory extends ethereum.SmartContract {
  static bind(address: Address): CampaignFactory {
    return new CampaignFactory("CampaignFactory", address);
  }

  REWARD_TOKEN(): Address {
    let result = super.call("REWARD_TOKEN", "REWARD_TOKEN():(address)", []);

    return result[0].toAddress();
  }

  try_REWARD_TOKEN(): ethereum.CallResult<Address> {
    let result = super.tryCall("REWARD_TOKEN", "REWARD_TOKEN():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  campaignCount(): BigInt {
    let result = super.call("campaignCount", "campaignCount():(uint256)", []);

    return result[0].toBigInt();
  }

  try_campaignCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "campaignCount",
      "campaignCount():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  campaignImplementation(): Address {
    let result = super.call(
      "campaignImplementation",
      "campaignImplementation():(address)",
      [],
    );

    return result[0].toAddress();
  }

  try_campaignImplementation(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "campaignImplementation",
      "campaignImplementation():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  currentTime(): BigInt {
    let result = super.call("currentTime", "currentTime():(uint256)", []);

    return result[0].toBigInt();
  }

  try_currentTime(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("currentTime", "currentTime():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateCampaignCall extends ethereum.Call {
  get inputs(): CreateCampaignCall__Inputs {
    return new CreateCampaignCall__Inputs(this);
  }

  get outputs(): CreateCampaignCall__Outputs {
    return new CreateCampaignCall__Outputs(this);
  }
}

export class CreateCampaignCall__Inputs {
  _call: CreateCampaignCall;

  constructor(call: CreateCampaignCall) {
    this._call = call;
  }

  get name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get deadline(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get totalRewardAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get rewardPerReferral(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class CreateCampaignCall__Outputs {
  _call: CreateCampaignCall;

  constructor(call: CreateCampaignCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class StopExpiredCampaignCall extends ethereum.Call {
  get inputs(): StopExpiredCampaignCall__Inputs {
    return new StopExpiredCampaignCall__Inputs(this);
  }

  get outputs(): StopExpiredCampaignCall__Outputs {
    return new StopExpiredCampaignCall__Outputs(this);
  }
}

export class StopExpiredCampaignCall__Inputs {
  _call: StopExpiredCampaignCall;

  constructor(call: StopExpiredCampaignCall) {
    this._call = call;
  }

  get _campaign(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class StopExpiredCampaignCall__Outputs {
  _call: StopExpiredCampaignCall;

  constructor(call: StopExpiredCampaignCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
