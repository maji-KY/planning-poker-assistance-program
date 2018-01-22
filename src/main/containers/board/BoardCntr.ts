import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Board } from "components/board/Board";
import { changeShowOwnTrump, changeAntiOpportunism, stand, clearCards, settingDialogOpen, settingDialogClose, join, kick } from "modules/Board";
import { makeUserBoardJoined } from "selectors";

function makeMapStateToProps(): any {
  const userBoardJoined = makeUserBoardJoined();
  return (state: any) => {
    const { boardReducer } = state;
    const { loading, group, players, settingDialogOpened, showOwnTrump } = boardReducer;
    const joined = userBoardJoined(state);
    return {loading, group, players, joined, settingDialogOpened, showOwnTrump};
  };
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({
    changeShowOwnTrump, changeAntiOpportunism, stand, clearCards, settingDialogOpen, settingDialogClose, join, kick
  }, dispatch);
}

const BoardCntr: any = connect(makeMapStateToProps, mapDispatchToProps)(Board);

export default BoardCntr;
