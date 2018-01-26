import { createSelector } from "reselect";
import Player from "models/Player";
import User from "models/User";

const getPlayers = (state) => state.boardReducer.players;
const getLoginUser = (state) => state.userReducer.loginUser;

export function isStopperTrump(trump: string): boolean {
  return trump === "BIG" || trump === "?" || trump === "BREAK";
}

export const makeUserBoardJoined = () => createSelector(
  [ getPlayers, getLoginUser ],
  (players: Player[], loginUser: User) => {
    return !!players.find(x => x.userId === loginUser.id);
  }
);

export const makeViewPlayers = () => createSelector(
  [ getPlayers, getLoginUser ],
  (players: Player[], loginUser: User) =>
    players.map(x => ({...x,
      "isMe": x.userId === loginUser.id,
      "isStopper": isStopperTrump(x.trump)
    }))
);
