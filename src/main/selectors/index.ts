import { createSelector } from "reselect";
import Player from "models/Player";
import User from "models/User";
import Group from "models/Group";

const getPlanningGroup = (state) => state.boardReducer.group;
const getShowOwnTrump = (state) => state.boardReducer.showOwnTrump;
const getPlayers = (state) => state.boardReducer.players;
const getLoginUser = (state) => state.userReducer.loginUser;

export function isStopperTrump(trump: string): boolean {
  return trump === "BIG" || trump === "?" || trump === "BREAK";
}

function getViewableTrump(group: Group, player: Player, loginUser: User, showOwnTrump: boolean): string {
  if (player.rightToTalk || isStopperTrump(player.trump)) {
    return player.trump;
  } else if (group.allReady && !group.antiOpportunism) {
    return player.trump;
  } else if (player.userId === loginUser.id && showOwnTrump) {
    return player.trump;
  } else if (player.ready) {
    return "ready...";
  }
  return "";
}

export const makeUserBoardJoined = () => createSelector(
  [ getPlayers, getLoginUser ],
  (players: Player[], loginUser: User) => {
    return !!players.find(x => x.userId === loginUser.id);
  }
);

export const makeViewPlayers = () => createSelector(
  [ getPlanningGroup, getPlayers, getLoginUser, getShowOwnTrump ],
  (group: Group, players: Player[], loginUser: User, showOwnTrump: boolean) =>
    players.map(x => ({...x,
      "trump": getViewableTrump(group, x, loginUser, showOwnTrump),
      "isStopper": isStopperTrump(x.trump)
    }))
);
