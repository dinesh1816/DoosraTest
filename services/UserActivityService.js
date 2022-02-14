import * as AbstractModels from "../models/AbstractModels";
import UserActivity from "../models/UserActivity";

async function addToUserActivity(userId, referenceId, action, metaData) {
  const document = {
    user_id: userId,
    reference_id: referenceId ?? "NA",
    action,
    metadata: metaData,
  };

  AbstractModels.mongoInsertOne(UserActivity, document);
}

export default { addToUserActivity };
