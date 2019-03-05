import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import BoardTopicForm from "components/board/BoardTopicForm";
import { changeTopic } from "modules/Board";


function handleSubmit(value: any, dispatch: Dispatch<any>, { "group": { organizationId, "id": groupId } }: any) {
  const actionDispatcher = bindActionCreators({
    changeTopic
  }, dispatch);
  actionDispatcher.changeTopic({organizationId, groupId, "topic": value.topic });
}

function mapStateToProps({ boardReducer }: any): any {
  return {"group": boardReducer.group, "loading": boardReducer.loading};
}

function mapDispatchToProps(dispatch: Dispatch<any>): any {
  return bindActionCreators({}, dispatch);
}

const BoardTopicFormCntr = connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    "form": "BoardTopicForm",
    "onSubmit": handleSubmit
  })(BoardTopicForm)
);

export default BoardTopicFormCntr;
