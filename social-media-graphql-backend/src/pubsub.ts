import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
export const NEW_NOTIFICATION = "NEW_NOTIFICATION";

export default pubsub;
