import React from "react";
import ReactDOM from "react-dom";
import {Mutation, useApolloClient} from "react-apollo";
import gql from "graphql-tag.macro";
import Tour from "reactour";
import IntlProvider from "./intl";
import "./tourHelper.scss";
import {FaVolumeUp} from "react-icons/fa";

const synth = window.speechSynthesis;

const TourHelper = ({steps, training: propsTraining, onRequestClose}) => {
  const client = useApolloClient();
  const speak = stepNum => {
    synth && synth.cancel();
    const step = steps[stepNum - 1];
    if (typeof step.content === "string") {
      return synth.speak(new SpeechSynthesisUtterance(step.content));
    }
    const div = document.createElement("div");
    // Process the training, in case it's a react element.
    ReactDOM.render(<IntlProvider>{step.content}</IntlProvider>, div);
    setTimeout(
      () => synth.speak(new SpeechSynthesisUtterance(div.innerText)),
      100,
    );
  };
  let {training, id} = client;
  if (!training) training = propsTraining;

  return (
    <Mutation
      mutation={gql`
        mutation ClientSetTraining($id: ID!, $training: Boolean!) {
          clientSetTraining(client: $id, training: $training)
        }
      `}
      variables={{
        id,
        training: false,
      }}
    >
      {action => (
        <Tour
          steps={steps}
          isOpen={training || false}
          onRequestClose={() => {
            synth && synth.cancel();
            onRequestClose ? onRequestClose() : action();
          }}
          badgeContent={(current, total) => {
            return (
              <div className="tour-speaker" onClick={() => speak(current)}>
                <FaVolumeUp size="1em" /> Speak This
              </div>
            );
          }}
        />
      )}
    </Mutation>
  );
};
export default TourHelper;
