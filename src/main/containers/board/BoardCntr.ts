import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Board } from "components/board/Board";
import { changeShowOwnTrump, changeAntiOpportunism, stand, clearCards, settingDialogOpen, settingDialogClose, join, kick } from "modules/Board";
import { makeUserBoardJoined } from "selectors";

function makeMapStateToProps(): any {
  const userBoardJoined = makeUserBoardJoined();
  return (state: any) => {
    const { boardReducer } = state;
    const { group, players, settingDialogOpened, showOwnTrump, antiOpportunism } = boardReducer;
    const joined = userBoardJoined(state);
    return {group, players, joined, settingDialogOpened, showOwnTrump, antiOpportunism};
  };
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({
    changeShowOwnTrump, changeAntiOpportunism, stand, clearCards, settingDialogOpen, settingDialogClose, join, kick
  }, dispatch);
}

const BoardCntr: any = connect(makeMapStateToProps, mapDispatchToProps)(Board);

export default BoardCntr;
