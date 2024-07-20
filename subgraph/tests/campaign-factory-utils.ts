import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CampaignCreated,
  CampaignStopped,
  OwnershipTransferred
} from "../generated/CampaignFactory/CampaignFactory"

export function createCampaignCreatedEvent(
  campaignId: Bytes,
  campaignAddress: Address,
  creator: Address,
  name: string,
  deadline: BigInt,
  totalRewardAmount: BigInt,
  rewardPerReferral: BigInt
): CampaignCreated {
  let campaignCreatedEvent = changetype<CampaignCreated>(newMockEvent())

  campaignCreatedEvent.parameters = new Array()

  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("campaignId", ethereum.Value.fromBytes(campaignId))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignAddress",
      ethereum.Value.fromAddress(campaignAddress)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "deadline",
      ethereum.Value.fromUnsignedBigInt(deadline)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalRewardAmount",
      ethereum.Value.fromUnsignedBigInt(totalRewardAmount)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardPerReferral",
      ethereum.Value.fromUnsignedBigInt(rewardPerReferral)
    )
  )

  return campaignCreatedEvent
}

export function createCampaignStoppedEvent(
  campaignId: Bytes,
  campaignAddress: Address,
  name: string,
  deadline: BigInt,
  timestamp: BigInt
): CampaignStopped {
  let campaignStoppedEvent = changetype<CampaignStopped>(newMockEvent())

  campaignStoppedEvent.parameters = new Array()

  campaignStoppedEvent.parameters.push(
    new ethereum.EventParam("campaignId", ethereum.Value.fromBytes(campaignId))
  )
  campaignStoppedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignAddress",
      ethereum.Value.fromAddress(campaignAddress)
    )
  )
  campaignStoppedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  campaignStoppedEvent.parameters.push(
    new ethereum.EventParam(
      "deadline",
      ethereum.Value.fromUnsignedBigInt(deadline)
    )
  )
  campaignStoppedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return campaignStoppedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
