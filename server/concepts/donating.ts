import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

// Represents the state of a clothing item in the donation process
export enum DonationStatus {
  NotListed = "not-listed",
  ListedForDonation = "listed",
  Donated = "donated",
}

export interface DonationDoc extends BaseDoc {
  itemId: ObjectId;
  userId: ObjectId;
  status: DonationStatus;
}

/**
 * Concept: Donating [User, Item]
 * Purpose: Allows users to mark items for donation, unmark them, or mark them as donated.
 */
export default class DonatingConcept {
  public readonly donations: DocCollection<DonationDoc>;

  constructor(collectionName: string) {
    this.donations = new DocCollection<DonationDoc>(collectionName);
  }

  /**
   * Mark an item as listed for donation
   */
  async listForDonation(userId: ObjectId, itemId: ObjectId) {
    // Check if item is already listed
    const existingEntry = await this.donations.readOne({ itemId, userId });
    if (existingEntry && existingEntry.status === DonationStatus.ListedForDonation) {
      throw new NotAllowedError("This item is already listed for donation.");
    }

    // Add new entry or update the existing entry
    const updatedDoc = await this.donations.createOne({ itemId, userId, status: DonationStatus.ListedForDonation });
    return { msg: "Item listed for donation!", donation: updatedDoc };
  }

  /**
   * Unmark an item as listed for donation
   */
  async unlistForDonation(userId: ObjectId, itemId: ObjectId) {
    // Check if item exists and is listed for donation
    const existingEntry = await this.donations.readOne({ itemId, userId });
    if (!existingEntry || existingEntry.status !== DonationStatus.ListedForDonation) {
      throw new NotFoundError("This item is not listed for donation.");
    }

    // Update the status to not listed
    const updatedDoc = await this.donations.partialUpdateOne({ itemId, userId }, { status: DonationStatus.NotListed });
    return { msg: "Item unlisted from donation.", donation: updatedDoc };
  }

  /**
   * Mark an item as donated
   */
  async markAsDonated(userId: ObjectId, itemId: ObjectId) {
    // Check if item exists and is listed for donation
    const existingEntry = await this.donations.readOne({ itemId, userId });
    if (!existingEntry || existingEntry.status !== DonationStatus.ListedForDonation) {
      throw new NotFoundError("This item is not listed for donation.");
    }

    // Update the status to donated
    const updatedDoc = await this.donations.partialUpdateOne({ itemId, userId }, { status: DonationStatus.Donated });
    return { msg: "Item marked as donated.", donation: updatedDoc };
  }

  /**
   * Get all items listed for donation by a user
   */
  async getListedItems(userId: ObjectId) {
    return await this.donations.readMany({ userId, status: DonationStatus.ListedForDonation });
  }

  /**
   * Get the donation status of a specific item
   */
  async getDonationStatus(userId: ObjectId, itemId: ObjectId) {
    const donationEntry = await this.donations.readOne({ userId, itemId });
    if (!donationEntry) {
      throw new NotFoundError("Donation status for this item not found.");
    }
    return donationEntry.status;
  }

  /**
   * Get a list of previously donated items for a user
   */
  async getDonatedItems(userId: ObjectId) {
    return await this.donations.readMany({ userId, status: DonationStatus.Donated });
  }
}
