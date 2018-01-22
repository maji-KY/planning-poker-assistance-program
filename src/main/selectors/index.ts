import { createSelector } from "reselect";
import { loginUser } from "utils/Apps";
import Player from "models/Player";

const getPlayers = (state) => state.boardReducer.players;

export const makeUserBoardJoined = () => createSelector(
  [ getPlayers ],
  (players: Player[]) => {
    const user = loginUser();
    return !!(user && players.find(x => x.userId === user.uid));
  }
);
