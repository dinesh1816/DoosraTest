import * as AbstractModels from "../models/AbstractModels";
import UserActivity from "../models/UserActivity";

export async function addToUserActivity(userId, referenceId, action, metadata) {
  const document = {
    user_id: userId,
    reference_id: referenceId ?? "NA",
    action,
    metadata,
  };

  await AbstractModels.mongoInsertOne(UserActivity, document);
}

export function dummyFunction() { }
