import { removeOldTokensCron } from "./remove-old-tokens";

export const cronRunner = async () => {
    removeOldTokensCron.start();
};
