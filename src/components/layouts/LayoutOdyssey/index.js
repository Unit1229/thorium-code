import React, { Component } from "react";
import Views from "../../views";
import Alerts from "../../generic/Alerts";
import ActionsMixin from "../../generic/Actions";
import ErrorBoundary from "../../../helpers/errorBoundary";
import CardFrame from "./frame";

import { Button } from "reactstrap";
import "./layout.css";

export default class LayoutOdyssey extends Component {
  state = {};
  render() {
    let { simulator, station, cardName, changeCard, clientObj } = this.props;
    const { changingCard } = this.state;
    let alertClass = `alertColor${simulator.alertlevel || 5}`;
    return (
      <ActionsMixin {...this.props}>
        <div id="layout-odyssey" className={alertClass}>
          <div
            className="backdrop"
            onClick={() => this.setState({ changingCard: false })}
          >
            {station.cards.map(c => (
              <div className="cardName" key={c.name}>
                {c.name}
              </div>
            ))}
          </div>
          <div
            className={`perspectiveContainer ${changingCard ? "active" : ""}`}
          >
            <div className="cardContainer">
              <ErrorBoundary
                render={
                  <div className={"card-error"}>
                    <p className="offline-title">Station Error</p>
                    <p className="offline-message" style={{ fontSize: "40px" }}>
                      Your station has experienced an error. A diagnostic must
                      be performed to restore this station to functionality. If
                      you continue to see this screen after performing the
                      diagnostic, please contact a computer specialist.
                    </p>
                    <Button
                      block
                      color="primary"
                      size="lg"
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Perform Diagnostic
                    </Button>
                  </div>
                }
              >
                {station.cards
                  .concat({ name: "Login", component: "Login", icon: "Login" })
                  .concat({
                    name: "Offline",
                    component: "Offline",
                    icon: "Offline"
                  })
                  .map(card => {
                    const Card = Views[card.component];
                    if (card.name === cardName) {
                      return (
                        <Card
                          {...this.props}
                          stopTraining={this.stopTraining}
                          key={card.name}
                        />
                      );
                    }
                    return null;
                  })
                  .filter(card => card)}
              </ErrorBoundary>
            </div>
            <div className="frame-text">
              <h1 className="simulator-name">{simulator.name}</h1>
              <h2 className="station-name">{station.name}</h2>
              <h2
                className="card-name"
                onClick={() => this.setState({ changingCard: !changingCard })}
              >
                {cardName}
              </h2>
            </div>
            <CardFrame simulator={simulator} />

            <Alerts
              ref="alert-widget"
              simulator={simulator}
              station={station}
            />
          </div>
        </div>
      </ActionsMixin>
    );
  }
}