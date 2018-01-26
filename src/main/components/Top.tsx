import * as React from "react";

import { StyleRulesCallback, WithStyles, withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Card, { CardContent, CardMedia } from "material-ui/Card";

export function TopComponent(props: WithStyles) {
  const { classes } = props;
  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="https://raw.githubusercontent.com/wiki/maji-KY/planning-poker-assistance-program/images/planning-poker-assistance-program.jpg"
          title="PPAP"
        />
        <CardContent>
          <Typography type="headline" component="h2">
            Planning-Poker-Assistance-Program
          </Typography>
          <Typography component="p">
            {
              `"Planning-Poker-Assistance-Program" (PPAP) makes the planning more quickly and accurately.
All you need is a Google Account.
Let's start a wonderful planning now.`
            }
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

const styles: StyleRulesCallback<string> = theme => ({
  "card": {
    "maxWidth": 800,
    "margin": "20px auto"
  },
  "media": {
    "height": 400
  }
});

export const Top = withStyles(styles)(TopComponent);
