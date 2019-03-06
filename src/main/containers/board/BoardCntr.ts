import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Board } from "components/board/Board";
import { changeShowOwnTrump, changeAntiOpportunism, stand, clearCards, dismiss, settingDialogOpen, settingDialogClose, join, kick } from "modules/Board";
import { makeUserBoardJoined, makeViewPlayers } from "selectors";

function makeMapStateToProps(): any {
  const userBoardJoined = makeUserBoardJoined();
  const viewPlayers = makeViewPlayers();
  return (state: any) => {
    const { boardReducer } = state;
    const { loading, group, settingDialogOpened, showOwnTrump, standing } = boardReducer;
    const joined = userBoardJoined(state);
    const players = viewPlayers(state);
    return {loading, group, players, joined, settingDialogOpened, showOwnTrump, standing};
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): any {
  return bindActionCreators({
    changeShowOwnTrump, changeAntiOpportunism, stand, clearCards, dismiss, settingDialogOpen, settingDialogClose, join, kick
  }, dispatch);
}

const BoardCntr: any = connect(makeMapStateToProps, mapDispatchToProps)(Board);

export default BoardCntr;
