import {
  CampaignCreated as CampaignCreatedEvent,
  CampaignStopped as CampaignStoppedEvent,
} from "../generated/CampaignFactory/CampaignFactory"
import {
  CampaignCreated,
  CampaignStopped,
} from "../generated/schema"

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let entity = new CampaignCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.id=event.params.campaignId
  entity.campaignId = event.params.campaignId
  entity.campaignAddress = event.params.campaignAddress
  entity.creator = event.params.creator
  entity.name = event.params.name
  entity.deadline = event.params.deadline
  entity.totalRewardAmount = event.params.totalRewardAmount
  entity.rewardPerReferral = event.params.rewardPerReferral

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.isLive="1";

  entity.save()
}

export function handleCampaignStopped(event: CampaignStoppedEvent): void {
  let id = event.params.campaignId
  let entity = CampaignCreated.load(id)
  
  if (entity) {
    entity.id=id
    entity.isLive = "0"
    entity.save()
  }
}

