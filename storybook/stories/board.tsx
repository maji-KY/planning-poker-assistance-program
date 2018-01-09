import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { object, boolean } from "@storybook/addon-knobs";
import { combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import { reduxForm, reducer as formReducer  } from "redux-form";

import { Board, Player } from "components/board/Board";
import BoardTopicForm from "components/board/BoardTopicForm";
import Group from "models/Group";
import User from "models/User";

const group = new Group("id1", "id1", "group1", "topic1", false, false);
const players = [
  new Player(
    new User("userId1", "user1", "https://raw.githubusercontent.com/wiki/maji-KY/planning-poker-assistance-program/images/planning-poker-assistance-program.jpg"),
    false
  ),
  new Player(
    new User("userId2", "user2", "https://raw.githubusercontent.com/wiki/maji-KY/planning-poker-assistance-program/images/planning-poker-assistance-program.jpg"),
    false
  )
];

const reducer = combineReducers({formReducer});
const store = createStore(reducer);

storiesOf("Board", module)
  .add("show", () => {
    return (
      <Board
        group={object("group", group)}
        players={object("user", players)}
        joined={boolean("joined", false)}
        settingDialogOpened={boolean("settingDialogOpened", false)}
        showOwnTrump={boolean("showOwnTrump", false)}
        antiOpportunism={boolean("antiOpportunism", false)}
        join={action("join")}
        kick={action("kick")}
        stand={action("stand")}
        clearCards={action("clearCards")}
        onSettingDialogOpen={action("onSettingDialogOpen")}
        onSettingDialogClose={action("onSettingDialogClose")}
        changeShowOwnTrump={action("changeShowOwnTrump")}
        changeAntiOpportunism={action("changeAntiOpportunism")}
      >
        <div>children</div>
      </Board>
    );
  })
  .addDecorator((story: any) => <Provider store={store}>{story()}</Provider>)
  .add("topicForm", () => {
    const Component = reduxForm({
      "form": "CreateGroupForm"
    })(BoardTopicForm);
    return (
      <Component />
    )
  });
