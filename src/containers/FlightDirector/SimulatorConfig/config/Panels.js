import React from "react";
import gql from "graphql-tag.macro";
import {withApollo} from "react-apollo";
import {useQuery} from "@apollo/react-hooks";
import {FaBan} from "react-icons/fa";
const QUERY = gql`
  query SoftwarePanels {
    softwarePanels {
      id
      name
    }
  }
`;
const App = ({selectedSimulator, client}) => {
  const {loading, data} = useQuery(QUERY);
  const mutation = gql`
    mutation UpdateSimulatorPanels($simulatorId: ID!, $panels: [ID]!) {
      updateSimulatorPanels(simulatorId: $simulatorId, panels: $panels)
    }
  `;
  const updatePanels = e => {
    const variables = {
      simulatorId: selectedSimulator.id,
      panels: selectedSimulator.panels.concat(e.target.value),
    };
    client.mutate({
      mutation,
      variables,
    });
  };
  const removePanel = id => {
    const variables = {
      simulatorId: selectedSimulator.id,
      panels: (selectedSimulator.panels || []).filter(s => s !== id),
    };
    client.mutate({
      mutation,
      variables,
    });
  };
  if (loading || !data) return null;
  const {softwarePanels} = data;
  return (
    <div>
      <select
        className="btn btn-primary"
        value={"nothing"}
        onChange={updatePanels}
      >
        <option value="nothing">Add a panel to the simulator</option>
        {softwarePanels
          .filter(s => !(selectedSimulator.panels || []).find(c => c === s.id))
          .map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
      </select>
      {(selectedSimulator.panels || []).map(s => (
        <p key={s}>
          {(softwarePanels.find(c => c.id === s) || {}).name}{" "}
          <FaBan className="text-danger" onClick={() => removePanel(s)} />
        </p>
      ))}
    </div>
  );
};

export default withApollo(App);
